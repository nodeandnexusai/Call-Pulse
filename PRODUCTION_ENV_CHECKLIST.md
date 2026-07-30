# Production Deployment Checklist — Call-Pulse (Meta WhatsApp Only)

Use this checklist to deploy Call-Pulse to production. The codebase stores Meta WhatsApp credentials per tenant in the database (encrypted); webhook validation secrets and tokens belong in env vars.

## Generated secrets (Step A1)

Run three times and save outputs:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Assign to:

| Variable | Purpose |
|----------|---------|
| `ENCRYPTION_KEY` | AES-256-GCM for integration credentials in DB |
| `CRON_SECRET` | Auth for `/api/cron/*` routes (Vercel cron) |
| `WHATSAPP_VERIFY_TOKEN` | Meta webhook challenge verification (choose any random string) |

## Required environment variables

### App

- [ ] `NEXT_PUBLIC_APP_URL` — Production URL, no trailing slash (e.g. `https://app.callpulse.io`)

### Database

- [ ] `DATABASE_URL` — PostgreSQL connection string (`?sslmode=require` for Supabase/Neon)

After setting, run:

```bash
npx prisma migrate deploy
npx prisma generate
```

### Clerk (production instance)

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — `pk_live_...`
- [ ] `CLERK_SECRET_KEY` — `sk_live_...`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
- [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding`

### Encryption & background jobs

- [ ] `ENCRYPTION_KEY` — 64-char hex
- [ ] `CRON_SECRET` — 64-char hex

Follow-up sequences use **Vercel cron** (`vercel.json`):

| Cron path | Schedule |
|-----------|----------|
| `/api/cron/follow-up-sequences` | Every 5 minutes |
| `/api/cron/rollup-metrics` | Daily at 01:00 UTC |

### Meta WhatsApp Business Cloud API

- [ ] `WHATSAPP_ACCESS_TOKEN` — Permanent System User token
- [ ] `WHATSAPP_PHONE_NUMBER_ID` — Numeric Phone Number ID from Meta Developer Console
- [ ] `WHATSAPP_WABA_ID` — WhatsApp Business Account ID
- [ ] `WHATSAPP_VERIFY_TOKEN` — Meta webhook GET challenge token
- [ ] `WHATSAPP_APP_SECRET` — Meta App Secret for `X-Hub-Signature-256` signature validation

## External service setup

### B1 — Database (Supabase or Neon)

1. Create project and copy connection string → `DATABASE_URL`
2. Enable automated backups / PITR
3. Run `npx prisma migrate deploy && npx prisma generate`

### B2 — Clerk

1. Create **Production** application
2. Add custom domain
3. Deploy → confirm no "Development mode" badge on sign-in

### B3 — Vercel

1. Add custom domain with HTTPS
2. Copy all env vars from `.env.example` into Production environment
3. Trigger fresh production deploy

### B4 — Meta WhatsApp Business Setup

1. Verified Meta Business Account + approved WABA (not sandbox/test mode)
2. Permanent System User token with `whatsapp_business_messaging` + `whatsapp_business_management`
3. Webhook callback URL: `https://<domain>/api/webhooks/whatsapp/inbound`
4. Verify token: matches `WHATSAPP_VERIFY_TOKEN`
5. Subscribe to `messages`, `message_deliveries`, `message_reads` fields
6. Save credentials in Call-Pulse Integrations Vault UI

## Security hardening (verified in code)

- [x] API routes scoped by `businessId` via `requireBusiness()`
- [x] Integration credentials returned masked only (`/api/integrations`)
- [x] Meta webhooks: `X-Hub-Signature-256` validation, HTTP 403 on failure
- [x] Rate limiting on webhook routes and integration test endpoint
- [x] Security headers in `next.config.ts`

## Build before deploy

```bash
npm run build
```

## End-to-end smoke tests (Part G)

| # | Test | Pass criteria |
|---|------|---------------|
| 1 | Missed call → WhatsApp auto-reply | WhatsApp message received within 30s; call in Activity Logs; lead status `messaged` |
| 2 | WhatsApp reply → lead scoring | Status `replied`/`qualified`; score `hot` for interest keywords |
| 3 | Webhook security | Unsigned POST to `/api/webhooks/whatsapp/inbound` → HTTP 403 |
| 4 | Multi-tenant isolation | Second signup sees clean empty state |

## Go-live checklist (Part H)

- [ ] All Twilio code removed — `npm run build` passes with 0 errors
- [ ] `npm uninstall twilio` done — no twilio in `package.json`
- [ ] WhatsApp Business Account verified (not sandbox/test mode)
- [ ] Permanent System User token in use (not temporary token)
- [ ] `WHATSAPP_APP_SECRET` set — webhook signature verification active
- [ ] Webhook subscribed to `messages` field in Meta Developer Console
- [ ] Custom domain live with HTTPS
- [ ] Clerk production instance active
- [ ] All 4 smoke tests passed
- [ ] Privacy Policy at `/privacy`, Terms at `/terms`
- [ ] Clean empty state for new signups
