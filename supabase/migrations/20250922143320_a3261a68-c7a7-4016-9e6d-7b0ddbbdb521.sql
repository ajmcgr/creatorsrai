-- Create the top_cache table for storing leaderboard data
CREATE TABLE IF NOT EXISTS public.top_cache (
    platform text NOT NULL,
    metric text NOT NULL,
    page integer NOT NULL DEFAULT 0,
    week_start date NOT NULL,
    data_json jsonb NOT NULL,
    delta_json jsonb,
    fetched_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (platform, metric, page, week_start)
);

-- Enable RLS
ALTER TABLE public.top_cache ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to top_cache" 
ON public.top_cache 
FOR SELECT 
USING (true);

-- Create view for latest data with delta calculations
CREATE OR REPLACE VIEW public.top_cache_latest_with_delta AS
WITH latest_data AS (
    SELECT DISTINCT ON (platform, metric, page)
        platform,
        metric, 
        page,
        week_start,
        data_json,
        delta_json,
        fetched_at
    FROM public.top_cache
    ORDER BY platform, metric, page, week_start DESC, fetched_at DESC
)
SELECT 
    ld.platform,
    ld.metric,
    ld.page,
    ld.week_start,
    ld.fetched_at,
    (entry.value->>'id')::text as person_id,
    (entry.value->>'username')::text as username,
    (entry.value->>'display_name')::text as display_name,
    (entry.value->>'avatar')::text as avatar,
    COALESCE((entry.value->>'subscribers')::bigint, (entry.value->>'followers')::bigint, 0) as current_value,
    COALESCE((ld.delta_json->(entry.value->>'id'))->>'prev', '0')::bigint as prev_value,
    COALESCE((ld.delta_json->(entry.value->>'id'))->>'diff', '0')::bigint as diff_value
FROM latest_data ld
CROSS JOIN LATERAL jsonb_array_elements(ld.data_json) AS entry(value)
ORDER BY current_value DESC;