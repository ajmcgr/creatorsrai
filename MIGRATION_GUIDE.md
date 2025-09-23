# Migrating from Lovable Cloud to Your Own Supabase

## Overview
This guide helps you migrate from Lovable Cloud to your own Supabase project, giving you full control over your backend infrastructure.

## Prerequisites
- A Supabase account (free tier is fine)
- Your Social Blade API credentials

## Step 1: Create Your Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create an account and new project
3. Choose a region close to your users
4. Set a strong database password

## Step 2: Get Your Credentials

From your Supabase project settings, copy:
- **Project URL**: `https://your-project-id.supabase.co`
- **Anon Key**: `eyJ...` (safe to expose in frontend)
- **Service Role Key**: `eyJ...` (keep secret, server-only)

## Step 3: Update Environment Variables

Replace the values in your `.env` file:

```bash
# Replace with your Supabase project credentials
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key-here"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

## Step 4: Set Up Secrets for Edge Functions

In your Supabase project, go to Edge Functions > Settings and add these secrets:
- `SUPABASE_URL`: Your project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key
- `SB_CLIENT_ID`: Your Social Blade client ID
- `SB_TOKEN`: Your Social Blade token
- `SB_BASE_URL`: `https://matrix.sbapis.com/b`
- `ADMIN_REFRESH_SECRET`: A random string for admin access

## Step 5: Create Database Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Create the top_cache table
create table if not exists public.top_cache (
  platform text not null,
  page integer not null default 1,
  data_json jsonb not null,
  delta_json jsonb,
  metric text not null,
  fetched_at timestamptz not null default now(),
  week_start date not null default current_date,
  primary key (platform, page, week_start)
);

-- Create index for performance
create index if not exists top_cache_fetched_idx on public.top_cache (fetched_at desc);

-- Enable RLS for security
alter table public.top_cache enable row level security;

-- Allow public read access
create policy "Allow public read access to top_cache" 
on public.top_cache for select 
using (true);

-- Allow service role full access
create policy "Allow service role full access to top_cache" 
on public.top_cache for all 
using (auth.role() = 'service_role');
```

## Step 6: Deploy Edge Functions

Your edge functions will automatically deploy to your Supabase project when you save them.

## Step 7: Test the Migration

1. Check that your leaderboard loads data
2. Test different platforms (YouTube, TikTok, Instagram)
3. Verify data is being cached properly

## Benefits of Your Own Supabase

✅ **Full Control**: Access to Supabase dashboard and all features  
✅ **Data Ownership**: Your data stays in your project  
✅ **Scaling**: Can upgrade plans as needed  
✅ **Customization**: Full access to database, auth, storage  
✅ **Integration**: Can connect to other tools and services  

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Social Blade API Docs](https://socialblade.com/api)

## Troubleshooting

If you encounter issues:
1. Check your environment variables are correct
2. Verify your Supabase project is active
3. Check edge function logs in Supabase dashboard
4. Ensure RLS policies allow your operations

Your migration is complete! You now have full control over your backend infrastructure.