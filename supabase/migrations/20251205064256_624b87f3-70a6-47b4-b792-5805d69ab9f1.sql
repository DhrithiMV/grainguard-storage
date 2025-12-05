-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create facilities table for cold storage locations
CREATE TABLE public.facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  capacity_kg INTEGER NOT NULL DEFAULT 0,
  available_capacity_kg INTEGER NOT NULL DEFAULT 0,
  min_temperature DECIMAL(4, 1) NOT NULL DEFAULT -5,
  max_temperature DECIMAL(4, 1) NOT NULL DEFAULT 25,
  price_per_kg_month DECIMAL(10, 2) NOT NULL DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0,
  supported_grains TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  contact_phone TEXT,
  contact_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  grains TEXT[] NOT NULL DEFAULT '{}',
  quantity_kg INTEGER NOT NULL,
  target_temperature DECIMAL(4, 1),
  temperature_mode TEXT DEFAULT 'auto',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Facilities policies (public read, admin write - for now public read only)
CREATE POLICY "Anyone can view active facilities" ON public.facilities
  FOR SELECT USING (is_active = true);

-- Reservations policies
CREATE POLICY "Users can view their own reservations" ON public.reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reservations" ON public.reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations" ON public.reservations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reservations" ON public.reservations
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample facilities data
INSERT INTO public.facilities (name, address, latitude, longitude, capacity_kg, available_capacity_kg, min_temperature, max_temperature, price_per_kg_month, rating, supported_grains, images, contact_phone) VALUES
('Kisan Cold Storage', '123 Agricultural Zone, Bangalore', 12.9716, 77.5946, 50000, 35000, -5, 25, 2.50, 4.5, ARRAY['wheat', 'rice', 'maize', 'pulses'], ARRAY['/placeholder.svg'], '+91 98765 43210'),
('Green Valley Storage', '456 Farm Road, Mysore', 12.2958, 76.6394, 75000, 60000, -10, 20, 3.00, 4.8, ARRAY['wheat', 'rice', 'vegetables'], ARRAY['/placeholder.svg'], '+91 98765 43211'),
('Farmers Hub Storage', '789 Market Area, Hubli', 15.3647, 75.1240, 40000, 25000, 0, 15, 2.00, 4.2, ARRAY['rice', 'pulses', 'spices'], ARRAY['/placeholder.svg'], '+91 98765 43212'),
('AgriCool Storage', '321 Industrial Estate, Belgaum', 15.8497, 74.4977, 100000, 80000, -15, 30, 2.75, 4.6, ARRAY['wheat', 'maize', 'seeds'], ARRAY['/placeholder.svg'], '+91 98765 43213'),
('Fresh Harvest Cold', '654 Highway Junction, Shimoga', 13.9299, 75.5681, 30000, 20000, -5, 18, 2.25, 4.3, ARRAY['rice', 'vegetables', 'fruits'], ARRAY['/placeholder.svg'], '+91 98765 43214');