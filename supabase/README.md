# Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. Import `BC_Transition_Houses_Safe_Homes.csv` into the `organizations` table, mapping:
   - `Location` -> `location`
   - `Organization` -> `organization`
   - `Program` -> `program`
   - `Phone` -> `phone`
   - `Toll Free` -> `toll_free`
   - `Text Only` -> `text_only`
   - `Type` -> `type`
4. Do not map an `id` column. The database creates one automatically.
5. Copy `.env.example` to `.env.local` and add your project URL and anon key.
6. Restart the Vite dev server.

When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present, the app uses Supabase. Without them, it falls back to the local browser database.
