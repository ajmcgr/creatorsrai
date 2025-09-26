-- Fix RLS policies for subscribers table to allow public newsletter signups
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert access to subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Allow public read access to subscribers" ON public.subscribers;

-- Create policy to allow anyone to subscribe to newsletter (for beehiiv sync)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading subscriptions (needed for sync function)
CREATE POLICY "Public can view subscriptions" 
ON public.subscribers 
FOR SELECT 
USING (true);