-- Remove monthly ingest cron job that calls deleted weekly-ingest function
SELECT cron.unschedule('monthly-top200-ingest');