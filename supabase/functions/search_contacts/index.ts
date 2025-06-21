import { handleRequest } from '../../src/server/search_contacts.ts'

Deno.serve(handleRequest)
