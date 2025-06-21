import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID || '';
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface PostNoteInput {
  portal_id: string;
  hubspot_object_id: string;
  app_record_url: string;
}

class SimpleLimiter {
  private queue: (() => void)[] = [];
  private active = false;
  constructor(private intervalMs: number) {}

  private next() {
    if (this.queue.length === 0) {
      this.active = false;
      return;
    }
    this.active = true;
    const fn = this.queue.shift()!;
    fn();
    setTimeout(() => this.next(), this.intervalMs);
  }

  schedule<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const run = () => task().then(resolve, reject);
      this.queue.push(run);
      if (!this.active) {
        this.next();
      }
    });
  }
}

const limiters = new Map<string, SimpleLimiter>();

function limiterFor(token: string) {
  if (!limiters.has(token)) {
    limiters.set(token, new SimpleLimiter(250));
  }
  return limiters.get(token)!;
}

async function ensureAccessToken(portal_id: string): Promise<string> {
  const { data, error } = await supabase
    .from('hubspot_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('portal_id', portal_id)
    .maybeSingle();

  if (error || !data) {
    throw new Error('Token fetch failed');
  }

  if (data.expires_at && new Date(data.expires_at).getTime() > Date.now() + 60_000) {
    return data.access_token;
  }

  const resp = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: data.refresh_token,
      client_id: HUBSPOT_CLIENT_ID,
      client_secret: HUBSPOT_CLIENT_SECRET,
    }).toString(),
  });

  if (!resp.ok) throw new Error('Refresh failed');
  const json: any = await resp.json();

  await supabase
    .from('hubspot_tokens')
    .update({
      access_token: json.access_token,
      refresh_token: json.refresh_token ?? data.refresh_token,
      expires_at: new Date(Date.now() + json.expires_in * 1000).toISOString(),
    })
    .eq('portal_id', portal_id);

  return json.access_token;
}

export async function postNote({
  portal_id,
  hubspot_object_id,
  app_record_url,
}: PostNoteInput): Promise<{ noteId: string } | { error: any }> {
  try {
    const accessToken = await ensureAccessToken(portal_id);
    const limiter = limiterFor(accessToken);
    const response = await limiter.schedule(() =>
      fetch('https://api.hubapi.com/crm/v3/objects/notes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': crypto.createHash('sha256').update(app_record_url).digest('hex'),
        },
        body: JSON.stringify({
          properties: {
            hs_note_body: `\ud83d\udd17 View in App: ${app_record_url}`,
            hs_timestamp: new Date().toISOString(),
          },
          associations: [{ to: { id: hubspot_object_id, type: 'contact' } }],
        }),
      })
    );

    const json = await response.json();
    if (!response.ok) {
      return { error: json };
    }
    return { noteId: json.id };
  } catch (err) {
    return { error: (err as Error).message };
  }
}
