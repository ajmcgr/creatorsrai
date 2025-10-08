-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule weekly-ingest to run on first Monday of every month at 00:00 UTC
-- Cron expression: '0 0 1-7 * 1' means "at 00:00 on days 1-7 of the month if it's a Monday"
SELECT cron.schedule(
  'monthly-top200-ingest',
  '0 0 1-7 * 1',
  $$
  SELECT
    net.http_post(
        url:='https://quvuhzmguvgfcirpauog.supabase.co/functions/v1/weekly-ingest',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dnVoem1ndXZnZmNpcnBhdW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDY1NDcsImV4cCI6MjA3NDEyMjU0N30.K26cnVNBDp6bq0IbPh9WfkTAGnk_TQxeQKlP90IZ47Y"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);