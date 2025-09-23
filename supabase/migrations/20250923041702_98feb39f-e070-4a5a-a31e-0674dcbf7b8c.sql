-- Subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access for now (can be refined later)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to subscribers" 
ON public.subscribers 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to subscribers" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (true);

-- Weekly snapshots of Top 100 per platform
CREATE TABLE IF NOT EXISTS public.top_snapshots (
  platform text NOT NULL,
  week_start date NOT NULL,
  data_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (platform, week_start)
);

CREATE INDEX IF NOT EXISTS top_snapshots_created_idx ON public.top_snapshots(created_at DESC);

-- Enable RLS with public read access
ALTER TABLE public.top_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to top_snapshots" 
ON public.top_snapshots 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to top_snapshots" 
ON public.top_snapshots 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to top_snapshots" 
ON public.top_snapshots 
FOR UPDATE 
USING (true);