-- Add missing columns to top_snapshots table
ALTER TABLE public.top_snapshots 
ADD COLUMN IF NOT EXISTS limit_size int NOT NULL DEFAULT 100,
ADD COLUMN IF NOT EXISTS fetched_at timestamptz NOT NULL DEFAULT now();

-- Update any existing records to have proper values
UPDATE public.top_snapshots 
SET fetched_at = created_at 
WHERE fetched_at IS NULL;