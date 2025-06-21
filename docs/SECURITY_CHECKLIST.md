# Security Checklist

- [ ] Clerk JWT TTL ≤ 1 h, Supabase JWKS set
- [ ] Tokens encrypted in Vault, rotated quarterly
- [ ] Scopes: crm.objects.*.read + notes.write only
- [ ] Purge tokens & cache rows on uninstall webhook
- [ ] GDPR delete handler truncates cache & notes
- [ ] Nightly cron runs with service-role but writes through RLS-safe function
- [ ] HSTS + HTTPS redirect
