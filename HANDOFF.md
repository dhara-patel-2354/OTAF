# Handoff — 15 July 2026

Work on issues #8, #11, #12, #15 and #18, plus a move to a new Supabase
project. Everything below is on `main`.

**If you pull this branch, read [Action required](#action-required) first — the
Supabase project changed and your existing `.env.local` will no longer work.**

---

## Issues closed

| # | Issue | What changed | How it was checked |
|---|-------|--------------|--------------------|
| 8 | Make the buttons work | Call and Email on the shelter cards now dial and compose. The add-category `+` buttons open an input. | All 12 rendered cards showed real phone numbers; Email went live as soon as an address existed |
| 11 | Add info@techalonglabs.com as collaborator | Resolved by the project move — the new project is owned by that account | Supabase reports the project as `info@techalonglabs.com's Project` |
| 12 | Update information without refreshing | Subscribes to organization changes over Supabase realtime | A live `UPDATE` event was captured arriving at a subscriber |
| 15 | Sign in should ask for credentials again | Auth sessions moved from `localStorage` to `sessionStorage` | Refresh keeps the session; closing the browser forces a fresh sign-in |
| 18 | More columns for contact details | Added `email` and `website`; mapped the existing contact columns through | Contact data reached the UI and enabled the buttons |

### #8 — Make the buttons work

`Call` and `Email` on `ShelterCard` had no `onClick` at all — they were
decorative. `Call` now opens a `tel:` link, falling back to the toll free
number when there is no direct line, and strips the CSV's formatting so the
number is dialable. `Email` opens a `mailto:`.

Both are disabled when there is no number or address on file. This is not a
visual change — the styles have no `disabled:` variant, so a disabled button
looks identical. It only stops a click that would do nothing.

The `+` buttons beside Population and Service Categories also did nothing.
They now open an input for adding a category that is not in the built-in list.
Categories held by an organization but missing from that list — anything from
the CSV, for example — previously did not render at all; they now appear
alongside the built-in options.

### #18 — More columns for contact details

`organizations` already had `phone`, `toll_free` and `text_only`, populated
for every row, but `toShelter` dropped all three so nothing could reach the
UI. That is why the Call button had nothing to dial. Mapping them through was
most of this issue.

`email` and `website` are new. No email address existed anywhere — not in the
CSV, not in the schema — so the Email button had nothing to work with. Workers
now enter their own address in the Contact Details fields on their dashboard,
and that organization's Email button goes live once saved. An invalid address
is rejected on save rather than stored, since it would otherwise produce a
`mailto:` link that silently goes nowhere.

**All 107 organizations currently have `email = null`, so every Email button is
disabled until workers fill theirs in.**

### #15 — Ask for credentials again

Sessions were kept in `localStorage`, which does not expire: signing in once
kept a worker signed in indefinitely, across browser restarts. They now live
in `sessionStorage`, so closing the browser ends the session while refreshing
or navigating does not. Any token left in `localStorage` by the old behaviour
is cleared on load so it cannot outlive the change.

This matters because transition house staff often share a computer. Before,
the next person at that machine was still signed in as the previous worker and
could change that shelter's availability.

### #12 — Update without refreshing

A worker's own edits already applied optimistically. What was missing was
other workers' changes. `AppDataContext` now subscribes to `organizations`
over realtime, and `schema.sql` adds the table to the `supabase_realtime`
publication — without that the client subscribes successfully but never
receives anything, which is easy to mistake for working.

The dashboard's edit form only resyncs when a different organization loads.
Resyncing on every change, as it did before, would discard whatever a worker
was part way through typing as soon as a realtime update arrived.

---

## Supabase project moved

The app now points at a **new Supabase project owned by
`info@techalonglabs.com`**.

| | |
|---|---|
| Project ref | `ptyzorsszvxpwhfldtox` |
| Region | `ca-central-1` |
| Previous ref | `cbpvcqgyydccammjmjfw` (no longer used) |

Applied to the new project:

1. `supabase/schema.sql` — tables, RLS policies, the import trigger, the new
   contact columns, and the realtime publication.
2. `supabase/seed.sql` — all 107 organizations, generated from
   `BC_Transition_Houses_Safe_Homes.csv`. Ids match the slugs the local CSV
   fallback uses, so both data sources agree. Safe to re-run.

**Auth accounts did not transfer.** The new project has zero users. Anyone who
had a worker account on the old project must sign up again and be re-approved.

RLS was verified against the new project: the anon key cannot insert or update
organizations, and cannot read `worker_profiles`.

---

## Approval email

Deployed and confirmed working end to end — a real approval sent a real email.

| Piece | Detail |
|---|---|
| Function | `approval-email`, deployed to `ptyzorsszvxpwhfldtox` |
| Sender | `donotreply@techalonglabs.com` |
| Domain | `techalonglabs.com`, verified in Resend |
| Trigger | Database Webhook on `worker_profiles`, `UPDATE` only |

DNS records were added under Squarespace on the `send.` subdomain and
`resend._domainkey`. The root `MX` still points at Google Workspace and was
not touched.

### JWT verification must stay on

`supabase/config.toml` sets `verify_jwt = true` for this function. **Do not
deploy it with `--no-verify-jwt`.** Without verification the endpoint is public
and anyone can post a fake approval payload to send mail from the verified
sending domain. The CLI has no flag to turn verification back on and remembers
the previous deploy's setting, which is why the intent lives in
`config.toml`.

The webhook must therefore send an `Authorization: Bearer <anon key>` header.
Without it the webhook gets a 401 and no email sends — with no error anywhere
you would normally look.

### Supabase auth emails are still rate limited

Supabase's built-in email sender allows roughly 2–3 messages an hour and is
meant for testing. Signup confirmations use it, so **the third worker to sign
up within an hour will fail**. Point auth email at Resend to fix this:
Authentication → Emails → SMTP Settings, host `smtp.resend.com`, port `465`,
username `resend`, password the Resend API key.

---

## Bugs found along the way

**Contact fields were being dropped.** `toShelter` never mapped `phone`,
`toll_free` or `text_only`, so data that existed for all 107 organizations
could not reach the UI. This is why the Call button had nothing to dial.

**Half-finished signups failed with a misleading error.** Signup collects the
email and password on one page and creates the account on the next, holding the
credentials in React state. Refreshing on the second step, using the back
button, or opening `/worker/org-info` directly reached `signUp` with empty
strings; Supabase reads that as an anonymous signup and rejects it with
"Anonymous sign-ins are disabled", which says nothing about the real problem. A
refresh mid-signup is ordinary behaviour, so real workers would have hit this.
Missing credentials now redirect back to the sign-up step.

---

## Action required

### The site has never deployed

`https://dhara-patel-2354.github.io/OTAF/` returns 404, and has since the
workflow was added on 30 May. This predates the work above and is not caused by
it.

The cause is a deadlock:

- `.github/workflows/deploy.yml` runs only on push to `main`
- the `github-pages` environment only permits `worker-page` to deploy

So pushing to `main` builds successfully and is then rejected at the deploy
step; pushing to `worker-page` does not trigger the workflow at all. The build
itself is fine.

Either change the workflow trigger to `worker-page`, or allow `main` to deploy
in the environment's branch policy.

### The deployed site would not connect to Supabase

`deploy.yml` passes no `VITE_SUPABASE_*` variables, and Vite inlines those at
build time. A deploy today would fall back to the CSV and browser storage: no
worker sign-in, no realtime, no approval emails. Add `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` as repository secrets and pass them to the build step.

The anon key is safe to expose — it is compiled into the public bundle whatever
you do, and RLS is what protects the data.

### These need repository admin

`dhara-patel-2354` owns the repository; other contributors have push but not
admin. All three of these need them:

1. Allowing `main` to deploy, if that route is taken over changing the trigger
2. Adding the repository secrets
3. Setting a custom domain

If a custom domain is used, `vite.config.js` must change from
`base: '/OTAF/'` to `base: '/'` — the site would sit at the root, and the
current base path would 404 every asset and render a blank page.

---

## Running locally

```bash
npm install
cp .env.example .env.local   # add the project URL and anon key
npm run dev
```

Vite only reads `.env` files at startup — restart the server after changing
them. Without the Supabase variables the app falls back to the CSV and browser
storage, which is a supported path, not an error.

See `supabase/README.md` for setting up a project from scratch and for the
worker approval flow.

---

## Still open

- **Every Email button is disabled** until workers save an address. The column
  exists and the field is there; the data does not.
- **#15 aside, nothing verifies on the deployed site**, because there is no
  deployed site.
- `ui-backups/` holds a full snapshot of the project from 29 May. It is now
  gitignored but still on disk; delete it if it is no longer wanted.
