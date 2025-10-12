-- Remove weekly cron job that calls Social Blade
SELECT cron.unschedule('weekly-creator-data-sync');