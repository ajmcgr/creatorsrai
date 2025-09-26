-- Create email templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create advertisers table
CREATE TABLE public.advertisers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  paid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email template advertisers junction table
CREATE TABLE public.email_template_advertisers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_template_id UUID NOT NULL REFERENCES public.email_templates(id) ON DELETE CASCADE,
  advertiser_id UUID NOT NULL REFERENCES public.advertisers(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  ad_content TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email_template_id, advertiser_id)
);

-- Enable Row Level Security
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_template_advertisers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for edge functions)
CREATE POLICY "Allow public read access to email_templates" 
ON public.email_templates 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to advertisers" 
ON public.advertisers 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to email_template_advertisers" 
ON public.email_template_advertisers 
FOR SELECT 
USING (true);

-- Create policies for full access (for admin management)
CREATE POLICY "Allow public full access to email_templates" 
ON public.email_templates 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public full access to advertisers" 
ON public.advertisers 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public full access to email_template_advertisers" 
ON public.email_template_advertisers 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advertisers_updated_at
BEFORE UPDATE ON public.advertisers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();