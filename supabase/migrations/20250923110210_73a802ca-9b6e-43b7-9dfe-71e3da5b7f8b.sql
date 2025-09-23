-- Create the weekly snapshots table for global cache
CREATE TABLE IF NOT EXISTS public.top_snapshots (
  platform text NOT NULL,
  week_start date NOT NULL,
  limit_size int NOT NULL DEFAULT 100,
  data_json jsonb NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (platform, week_start)
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS top_snapshots_recent ON public.top_snapshots (platform, week_start DESC);

-- Disable RLS for this table since it's public data
ALTER TABLE public.top_snapshots DISABLE ROW LEVEL SECURITY;