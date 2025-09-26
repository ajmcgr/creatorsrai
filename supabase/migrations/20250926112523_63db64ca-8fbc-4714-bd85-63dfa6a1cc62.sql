-- Enable RLS on all tables that have policies but might not have RLS enabled
ALTER TABLE public.avatars_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_template_advertisers ENABLE ROW LEVEL SECURITY;