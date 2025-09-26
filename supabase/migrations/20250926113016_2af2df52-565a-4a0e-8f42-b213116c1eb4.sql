-- Ensure email uniqueness to support upsert
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_email_unique ON public.subscribers (email);