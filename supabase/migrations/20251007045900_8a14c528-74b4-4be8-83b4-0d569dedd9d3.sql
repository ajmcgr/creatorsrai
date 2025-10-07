-- Create snapshots table to store weekly Top 200 data
CREATE TABLE IF NOT EXISTS public.sb_snapshots (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('youtube','instagram','tiktok')),
  run_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create new entries table to track creators entering Top 200
CREATE TABLE IF NOT EXISTS public.sb_new_entries (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('youtube','instagram','tiktok')),
  run_at TIMESTAMPTZ NOT NULL,
  profile_id TEXT NOT NULL,
  handle TEXT,
  display_name TEXT,
  rank INT,
  metrics JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (platform, run_at, profile_id)
);

-- Create rollups table for run summaries
CREATE TABLE IF NOT EXISTS public.sb_rollups (
  id BIGSERIAL PRIMARY KEY,
  run_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_sb_snapshots_platform_run ON public.sb_snapshots(platform, run_at DESC);
CREATE INDEX IF NOT EXISTS idx_sb_new_entries_run ON public.sb_new_entries(run_at DESC);
CREATE INDEX IF NOT EXISTS idx_sb_new_entries_platform_run ON public.sb_new_entries(platform, run_at DESC);

-- Enable RLS
ALTER TABLE public.sb_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sb_new_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sb_rollups ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to sb_snapshots" 
ON public.sb_snapshots FOR SELECT USING (true);

CREATE POLICY "Allow public read access to sb_new_entries" 
ON public.sb_new_entries FOR SELECT USING (true);

CREATE POLICY "Allow public read access to sb_rollups" 
ON public.sb_rollups FOR SELECT USING (true);

-- Allow service role to insert/update
CREATE POLICY "Allow service role to manage sb_snapshots" 
ON public.sb_snapshots FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role to manage sb_new_entries" 
ON public.sb_new_entries FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role to manage sb_rollups" 
ON public.sb_rollups FOR ALL USING (true) WITH CHECK (true);