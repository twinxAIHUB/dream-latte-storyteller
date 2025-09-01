-- Create visitor tracking table
CREATE TABLE public.website_visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_agent TEXT,
  page_visited TEXT NOT NULL,
  visit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  referrer TEXT
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coffee tasting event configuration table
CREATE TABLE public.coffee_tasting_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Coffee Tasting Session',
  description TEXT NOT NULL DEFAULT 'Join us for an exclusive coffee tasting experience',
  event_date TEXT NOT NULL DEFAULT 'September 2024',
  start_time TEXT NOT NULL DEFAULT '10:00 AM',
  end_time TEXT NOT NULL DEFAULT '12:00 PM',
  max_participants INTEGER NOT NULL DEFAULT 6,
  min_participants INTEGER NOT NULL DEFAULT 4,
  price_per_person DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
  down_payment_percentage INTEGER NOT NULL DEFAULT 50,
  featured_coffees TEXT,
  additional_info TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create terms and agreements table
CREATE TABLE public.terms_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.website_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_tasting_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_agreements ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for data collection
CREATE POLICY "Allow public visitor tracking" 
ON public.website_visitors 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public feedback submission" 
ON public.feedback 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public to view active terms" 
ON public.terms_agreements 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow public to view active coffee config" 
ON public.coffee_tasting_config 
FOR SELECT 
USING (is_active = true);

-- Create triggers for timestamp updates
CREATE TRIGGER update_coffee_tasting_config_updated_at
BEFORE UPDATE ON public.coffee_tasting_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_terms_agreements_updated_at
BEFORE UPDATE ON public.terms_agreements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default coffee tasting configuration
INSERT INTO public.coffee_tasting_config (
  title,
  description,
  event_date,
  start_time,
  end_time,
  max_participants,
  min_participants,
  price_per_person,
  down_payment_percentage,
  featured_coffees,
  additional_info
) VALUES (
  'Coffee Tasting Session',
  'Join us for an exclusive coffee tasting experience',
  'September 2024',
  '10:00 AM',
  '12:00 PM',
  6,
  4,
  1000.00,
  50,
  'Premium coffees from our curated collection',
  '50% down payment required to secure your spot.'
);

-- Insert default terms and agreements
INSERT INTO public.terms_agreements (
  title,
  content,
  version
) VALUES (
  'Data Collection and Privacy Policy',
  'By using this website and registering for our events, you agree to the following data collection practices:

1. INFORMATION WE COLLECT
We collect the following information when you visit our website or register for events:
- Personal information (name, email, phone number)
- Payment information and screenshots for event registration
- Website usage data (pages visited, time spent, IP address)
- Feedback and ratings you provide

2. HOW WE USE YOUR INFORMATION
We use your information to:
- Process event registrations and manage participants
- Improve our website and services
- Send you event updates and confirmations
- Analyze website traffic and user behavior
- Respond to your feedback and inquiries

3. DATA STORAGE AND SECURITY
- Your data is stored securely using industry-standard encryption
- Payment screenshots are stored in secure cloud storage
- We do not share your personal information with third parties without consent
- Your data is retained only as long as necessary for business purposes

4. YOUR RIGHTS
You have the right to:
- Access your personal data
- Request correction of inaccurate data
- Request deletion of your data
- Withdraw consent for data processing

5. COOKIES AND TRACKING
We use cookies and similar technologies to:
- Track website usage and improve user experience
- Remember your preferences
- Analyze traffic patterns

6. CONTACT US
For questions about this privacy policy or your data, contact us at info@dreamlattecafe.com

By continuing to use our website or services, you acknowledge that you have read and understood this privacy policy.',
  '1.0'
);