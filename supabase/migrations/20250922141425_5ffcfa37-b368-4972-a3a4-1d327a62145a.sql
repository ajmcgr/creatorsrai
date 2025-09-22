-- Weekly cache with WoW delta
CREATE TABLE IF NOT EXISTS public.top_cache (
  platform text NOT NULL,
  metric text NOT NULL,
  page int NOT NULL DEFAULT 0,
  week_start date NOT NULL,
  data_json jsonb NOT NULL,
  delta_json jsonb,  -- { person_id: { current, prev, diff } }
  fetched_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (platform, metric, page, week_start)
);

-- Profile cache
CREATE TABLE IF NOT EXISTS public.person_cache (
  platform text NOT NULL,
  person_id text NOT NULL,
  data_json jsonb NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (platform, person_id)
);

-- Enable RLS
ALTER TABLE public.top_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access (leaderboard is public data)
CREATE POLICY "Allow public read access to top_cache" 
ON public.top_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to person_cache" 
ON public.person_cache 
FOR SELECT 
USING (true);

-- Latest week view
CREATE OR REPLACE VIEW public.top_cache_latest AS
SELECT DISTINCT ON (platform, metric, page)
  platform, metric, page, week_start, data_json, delta_json, fetched_at
FROM public.top_cache
ORDER BY platform, metric, page, week_start DESC, fetched_at DESC;

-- Flattened delta view (exposes current, prev, diff per person)
CREATE OR REPLACE VIEW public.top_cache_latest_with_delta AS
SELECT
  t.platform,
  t.metric,
  t.page,
  t.week_start,
  jsonb_array_elements(t.data_json) ->> 'id' as person_id,
  (jsonb_array_elements(t.data_json) ->> 'username') as username,
  (jsonb_array_elements(t.data_json) ->> 'displayName') as display_name,
  (jsonb_array_elements(t.data_json) ->> 'avatar') as avatar,
  (jsonb_array_elements(t.data_json) ->> 'subscribers')::bigint as current_value,
  (t.delta_json -> (jsonb_array_elements(t.data_json) ->> 'id') ->> 'prev')::bigint as prev_value,
  (t.delta_json -> (jsonb_array_elements(t.data_json) ->> 'id') ->> 'diff')::bigint as diff_value,
  t.fetched_at
FROM public.top_cache t
WHERE t.week_start = (
  SELECT max(week_start) FROM public.top_cache
);