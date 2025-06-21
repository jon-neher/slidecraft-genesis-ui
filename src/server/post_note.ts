import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';
import crypto from 'crypto';
import {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from './config';
import { getAccessToken } from '../integrations/hubspot/token';

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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


export async function postNote({
  portal_id,
  hubspot_object_id,
  app_record_url,
}: PostNoteInput): Promise<{ noteId: string } | { error: any }> {
  try {
    const accessToken = await getAccessToken(portal_id);
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
