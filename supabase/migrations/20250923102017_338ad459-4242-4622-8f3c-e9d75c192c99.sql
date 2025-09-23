-- Allow edge functions to write to top_cache for caching
CREATE POLICY "Allow public upsert access to top_cache" 
ON public.top_cache 
FOR ALL 
USING (true) 
WITH CHECK (true);