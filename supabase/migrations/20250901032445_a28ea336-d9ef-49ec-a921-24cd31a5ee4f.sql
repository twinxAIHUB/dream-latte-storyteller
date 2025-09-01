-- Create table for coffee tasting event registrations
CREATE TABLE public.coffee_tasting_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience TEXT NOT NULL,
  payment_screenshot_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.coffee_tasting_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert registrations (public event)
CREATE POLICY "Anyone can register for coffee tasting" 
ON public.coffee_tasting_registrations 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to view all registrations (for admin purposes)
CREATE POLICY "Anyone can view coffee tasting registrations" 
ON public.coffee_tasting_registrations 
FOR SELECT 
USING (true);

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-screenshots', 'payment-screenshots', false);

-- Create storage policies for payment screenshots
CREATE POLICY "Anyone can upload payment screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-screenshots');

CREATE POLICY "Anyone can view payment screenshots" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-screenshots');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_coffee_tasting_registrations_updated_at
BEFORE UPDATE ON public.coffee_tasting_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();