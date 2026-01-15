-- Enable RLS and allow anonymous (public) SELECT so /admin.html works
alter table public.rsvps enable row level security;

create policy "Public read rsvps"
on public.rsvps
for select
to anon
using (true);
