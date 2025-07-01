
import type { ContactRecord } from './types';

export interface HubSpotClientConfig {
  portalId: string;
}

export class HubSpotClientSafe {
  private portalId: string;

  constructor(config: HubSpotClientConfig) {
    this.portalId = config.portalId;
  }

  async searchContacts(query: string, limit: number = 10): Promise<ContactRecord[]> {
    // This will be handled by the Edge Function
    const response = await fetch(`/api/search-contacts?portal_id=${this.portalId}&q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to search contacts');
    }
    
    return response.json();
  }

  async postNote(objectId: string, noteBody: string, appRecordUrl: string): Promise<{ noteId: string }> {
    // This will be handled by the Edge Function
    const response = await fetch('/api/post-note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        portal_id: this.portalId,
        hubspot_object_id: objectId,
        note_body: noteBody,
        app_record_url: appRecordUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to post note');
    }

    return response.json();
  }
}
