-- Drop and recreate views with proper security settings
DROP VIEW IF EXISTS public.top_cache_latest_with_delta;
DROP VIEW IF EXISTS public.top_cache_latest;

-- Latest week view with SECURITY INVOKER
CREATE OR REPLACE VIEW public.top_cache_latest 
WITH (security_invoker = true) AS
SELECT DISTINCT ON (platform, metric, page)
  platform, metric, page, week_start, data_json, delta_json, fetched_at
FROM public.top_cache
ORDER BY platform, metric, page, week_start DESC, fetched_at DESC;

-- Flattened delta view with SECURITY INVOKER  
CREATE OR REPLACE VIEW public.top_cache_latest_with_delta 
WITH (security_invoker = true) AS
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