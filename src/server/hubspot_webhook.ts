import { getSupabaseClient } from './supabaseClient'
import { verifyHubSpotSignature } from './verify_signature'
import { Database } from '../integrations/supabase/types'

export async function handleRequest(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const signatureValid = await verifyHubSpotSignature(req)
  if (!signatureValid) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const payload = await req.json()
    if (!Array.isArray(payload)) {
      console.error('Invalid payload format:', payload)
      return new Response('Bad Request - Invalid payload format', { status: 400 })
    }

    const supabaseClient = getSupabaseClient()

    for (const event of payload) {
      if (
        typeof event.objectId !== 'number' ||
        typeof event.propertyName !== 'string' ||
        typeof event.propertyValue !== 'string' ||
        typeof event.changeSource !== 'string'
      ) {
        console.warn('Skipping event due to unexpected data types:', event)
        continue
      }

      // upsert into public.hubspot_contacts_cache
      await supabaseClient
        .from('hubspot_contacts_cache')
        .upsert({
          hubspot_id: event.objectId,
          property_name: event.propertyName,
          property_value: event.propertyValue,
          change_source: event.changeSource,
        })
        .then((res) => {
          if (res.error) {
            console.error('Supabase upsert error:', res.error)
          }
        })
    }

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Webhook processing failed:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
