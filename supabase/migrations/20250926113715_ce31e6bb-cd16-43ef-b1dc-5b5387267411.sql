-- Fix RLS policies to allow service role inserts
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.subscribers;
DROP POLICY IF EXISTS "Public can view subscriptions" ON public.subscribers;

-- Create policy that allows service role and public inserts
CREATE POLICY "Allow newsletter subscriptions" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (true);

-- Allow reading subscriptions  
CREATE POLICY "Allow reading subscriptions" 
ON public.subscribers 
FOR SELECT 
USING (true);