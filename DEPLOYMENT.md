# DEPLOYMENT.md

## Frontend — Vercel

1. Push this project to a GitHub repo.
2. [vercel.com](https://vercel.com) → New Project → import the repo.
3. Framework preset: Next.js (auto-detected).
4. Add all variables from `.env.example` under Project Settings →
   Environment Variables — for **Production**, **Preview**, and
   **Development** as needed. Double-check `SUPABASE_SERVICE_ROLE_KEY`
   and the Razorpay secret keys are **not** prefixed `NEXT_PUBLIC_`.
5. Deploy.

## Database — Supabase

Supabase is already "deployed" the moment you create the project — there's
no separate build step. Just make sure:
- `supabase/schema.sql` has been run against your production project.
- Auth → URL Configuration → Site URL is set to your real domain (so
  password-reset and email-confirmation links point to the right place).
- Auth → Providers → Google is configured if you want Google sign-in
  (needs a Google Cloud OAuth client ID/secret).

## Payments — Razorpay

- Switch from Test Mode to Live Mode in the Razorpay dashboard once
  you're ready to accept real payments, and swap the `RAZORPAY_KEY_ID`/
  `SECRET` env vars in Vercel to the live keys.
- Update the webhook URL in Razorpay to your production domain.

## Post-deploy checklist

- [ ] Sign up a real account and promote it to `super_admin` via SQL
- [ ] Confirm `/admin` is reachable for that account and blocked for others
- [ ] Publish at least one destination and package from `/admin` so the
      homepage isn't empty
- [ ] Do one full test booking + test payment in Razorpay Test Mode
- [ ] Verify the webhook fires (Razorpay dashboard → Webhooks → shows
      delivery attempts)
