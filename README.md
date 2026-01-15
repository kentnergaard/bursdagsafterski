# Afterski 40 (Netlify + Supabase) — v4

## Poster-like bubble AFTERSKI
This version adds thicker 'bubble' outline/glow to the AFTERSKI letters using layered text-shadow and gradient fill.

## RSVP fields
Only:
- name
- coming (ja/nei)

## Netlify env vars
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

## Supabase
Your `rsvps` table should include at least:
- name (text)
- coming (boolean)
- created_at (timestamptz default now())
- source (text)
- ip_hash (text)

If you already have a wider table from earlier, that's fine — extra columns can be nullable.


## Admin-side
Admin er tilgjengelig på:
- /admin.html

### Viktig (RLS-policy)
For at /admin.html skal kunne lese påmeldinger med publishable/anon key, må du aktivere RLS og legge til en SELECT-policy.

Kjør i Supabase SQL Editor:

```sql
alter table public.rsvps enable row level security;

create policy "Public read rsvps"
on public.rsvps
for select
to anon
using (true);
```

## Troubleshooting keys
- Admin-siden bruker *anon public key* (JWT) fra Supabase: Settings → API → Project API keys → anon public.
- Netlify Function (påmelding) bruker *service_role key* (secret): Settings → API → Project API keys → service_role.

I Netlify legges den som Environment Variable:
SUPABASE_SERVICE_ROLE_KEY

## Netlify: Environment Variable (viktig for påmelding)
I Netlify:
Site settings → Build & deploy → Environment → Environment variables → Add variable

Key: SUPABASE_SERVICE_ROLE_KEY
Value: (Supabase Settings → API → Project API keys → service_role)

Etterpå: Redeploy.

## If you see: "the string did not match the expected pattern"
This usually means the Supabase URL was malformed in the function. v10 fixes this by hardcoding a clean supabaseUrl.
Redeploy after updating.

## HTTP 404 on /.netlify/functions/rsvp
Dette betyr at Netlify ikke har deployet Functions i den deployen.

Viktig:
- "Drag & Drop" (Netlify Drop / manuell opplasting av statiske filer) deployer ofte kun statiske filer, ikke Functions.
Anbefalt:
1) Deploy via Git (Import existing project) ELLER
2) Bruk Netlify CLI (netlify deploy --prod) fra prosjektmappen.

Sjekk at du ser funksjonen under Netlify → Functions (rsvp).
