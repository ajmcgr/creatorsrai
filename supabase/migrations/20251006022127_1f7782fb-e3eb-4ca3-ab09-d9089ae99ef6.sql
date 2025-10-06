-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schedule the weekly-data-sync function to run every Monday at 9 AM UTC
SELECT cron.schedule(
  'weekly-creator-data-sync',
  '0 9 * * 1', -- Every Monday at 9 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://quvuhzmguvgfcirpauog.supabase.co/functions/v1/weekly-data-sync',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dnVoem1ndXZnZmNpcnBhdW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDY1NDcsImV4cCI6MjA3NDEyMjU0N30.K26cnVNBDp6bq0IbPh9WfkTAGnk_TQxeQKlP90IZ47Y"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);