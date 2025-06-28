import { handleRequest } from '../../src/server/hubspot_fetch_contacts.ts'

Deno.serve(handleRequest)
