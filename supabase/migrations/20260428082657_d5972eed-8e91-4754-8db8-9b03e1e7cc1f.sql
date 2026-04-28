-- Enum de roles
CREATE TYPE public.app_role AS ENUM ('trabajador', 'cliente');

-- Tabla profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  cif TEXT,
  address TEXT,
  zone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla user_roles
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Función has_role (security definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Trigger de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Handle new user: crea profile + rol cliente por defecto
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, phone, company_name, cif)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email,
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'company_name',
    NEW.raw_user_meta_data ->> 'cif'
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'cliente');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tabla pickup_requests
CREATE TABLE public.pickup_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company TEXT NOT NULL,
  cif TEXT,
  contact TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  zone TEXT NOT NULL,
  address TEXT NOT NULL,
  packages INTEGER DEFAULT 1,
  weight NUMERIC,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla quote_requests
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  service TEXT NOT NULL,
  packages INTEGER,
  weight NUMERIC,
  volume NUMERIC,
  out_of_pallet BOOLEAN DEFAULT FALSE,
  flower_size TEXT,
  flower_boxes INTEGER,
  estimated_total NUMERIC,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla shipments (envíos programados)
CREATE TABLE public.shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name TEXT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  packages INTEGER DEFAULT 1,
  price NUMERIC,
  status TEXT NOT NULL DEFAULT 'programado',
  scheduled_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Triggers updated_at
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_pickup_updated_at BEFORE UPDATE ON public.pickup_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_quote_updated_at BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_shipments_updated_at BEFORE UPDATE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Policies: profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Trabajadores view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'trabajador'));
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies: user_roles
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Trabajadores view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'trabajador'));
CREATE POLICY "Trabajadores manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'trabajador'))
  WITH CHECK (public.has_role(auth.uid(), 'trabajador'));

-- Policies: pickup_requests
CREATE POLICY "Anyone can create pickup" ON public.pickup_requests
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own pickups" ON public.pickup_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Trabajadores view all pickups" ON public.pickup_requests
  FOR SELECT USING (public.has_role(auth.uid(), 'trabajador'));
CREATE POLICY "Trabajadores manage pickups" ON public.pickup_requests
  FOR UPDATE USING (public.has_role(auth.uid(), 'trabajador'));
CREATE POLICY "Trabajadores delete pickups" ON public.pickup_requests
  FOR DELETE USING (public.has_role(auth.uid(), 'trabajador'));

-- Policies: quote_requests
CREATE POLICY "Anyone can create quote" ON public.quote_requests
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own quotes" ON public.quote_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Trabajadores view all quotes" ON public.quote_requests
  FOR SELECT USING (public.has_role(auth.uid(), 'trabajador'));
CREATE POLICY "Trabajadores manage quotes" ON public.quote_requests
  FOR UPDATE USING (public.has_role(auth.uid(), 'trabajador'));
CREATE POLICY "Trabajadores delete quotes" ON public.quote_requests
  FOR DELETE USING (public.has_role(auth.uid(), 'trabajador'));

-- Policies: shipments
CREATE POLICY "Clients view own shipments" ON public.shipments
  FOR SELECT USING (auth.uid() = client_user_id);
CREATE POLICY "Trabajadores view all shipments" ON public.shipments
  FOR SELECT USING (public.has_role(auth.uid(), 'trabajador'));
CREATE POLICY "Trabajadores insert shipments" ON public.shipments
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'trabajador'));
CREATE POLICY "Trabajadores update shipments" ON public.shipments
  FOR UPDATE USING (public.has_role(auth.uid(), 'trabajador'));
CREATE POLICY "Trabajadores delete shipments" ON public.shipments
  FOR DELETE USING (public.has_role(auth.uid(), 'trabajador'));

-- Envío de prueba
INSERT INTO public.shipments (origin, destination, packages, price, status, client_name, notes)
VALUES ('Tenerife', 'La Palma', 1, 9.18, 'programado', 'Cliente de prueba', 'Envío de prueba inicial');