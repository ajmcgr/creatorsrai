-- Create avatars cache table for 30-day avatar caching
CREATE TABLE IF NOT EXISTS public.avatars_cache (
  platform text NOT NULL,
  person_id text NOT NULL,
  display_name text,
  username text,
  avatar_url text,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (platform, person_id)
);

-- Create index for efficient cleanup of old entries
CREATE INDEX IF NOT EXISTS avatars_cache_fetched_idx ON public.avatars_cache (fetched_at DESC);

-- Enable RLS for security
ALTER TABLE public.avatars_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access to avatars cache
CREATE POLICY "Allow public read access to avatars_cache" 
ON public.avatars_cache 
FOR SELECT 
USING (true);

-- Allow public insert/update for avatar enrichment
CREATE POLICY "Allow public upsert access to avatars_cache" 
ON public.avatars_cache 
FOR ALL 
USING (true);