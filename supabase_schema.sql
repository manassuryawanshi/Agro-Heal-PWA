-- Create Farmers Table
create table public.farmers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text unique,
  district text not null,
  crop text not null,
  language text default 'en',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.farmers enable row level security;

-- Create policy to allow anyone to insert a profile (since we aren't enforcing strict auth for the hackathon yet)
create policy "Allow anonymous inserts" on public.farmers for insert with check (true);
create policy "Allow anonymous select" on public.farmers for select using (true);
create policy "Allow anonymous update" on public.farmers for update using (true);
