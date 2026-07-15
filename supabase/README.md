# Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. In the SQL editor, run `supabase/seed.sql` to import the organizations from
   `BC_Transition_Houses_Safe_Homes.csv`. It is generated from that CSV and is
   safe to re-run; existing rows are skipped. `population_categories`,
   `service_categories` and `more_info` are filled in by the
   `prepare_organization_import` trigger, so the seed does not set them.
4. Copy `.env.example` to `.env.local` and add your project URL and anon key.
5. Restart the Vite dev server (env vars are only read at startup).

To regenerate `seed.sql` after the CSV changes, see the id slug format in
`src/data/mockData.js`; the ids must match so the local CSV fallback and
Supabase agree.

When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present, the app uses Supabase. Without them, it falls back to the local browser database.

## Worker approval flow

New worker accounts are always created with `approval_status = 'pending'`.
Their signup details are stored in `worker_profiles`; they cannot approve
themselves from the app.

To approve a worker:

1. Open Supabase Table Editor.
2. Open `worker_profiles`.
3. Find the worker by `email`.
4. Set `organization_id` to the matching row from `organizations`.
5. Set `approval_status` to `approved`.
6. Save.

After approval, the worker can sign in and manage only their assigned
organization. Their signup categories and display information are synced to
the organization row after approval.

## Approval email

The app shows a small approval popup the first time an approved worker opens
their dashboard.

To send an email at the moment you approve a worker, deploy
`supabase/functions/approval-email` and connect it to a Database Webhook:

1. Create a Resend API key.
2. In Supabase Edge Function secrets, set:
   - `RESEND_API_KEY`
   - `APPROVAL_EMAIL_FROM`
   - `PUBLIC_APP_URL`
3. Deploy the function:
   - `supabase functions deploy approval-email`
4. In Supabase, open Database Webhooks.
5. Create a webhook for table `public.worker_profiles`.
6. Trigger it on `UPDATE`.
7. Point it to the deployed `approval-email` function URL.

The function only sends when `approval_status` changes from a non-approved
value to `approved`.
