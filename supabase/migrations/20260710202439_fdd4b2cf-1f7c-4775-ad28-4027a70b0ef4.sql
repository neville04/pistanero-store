
-- 1. Move SECURITY DEFINER functions out of exposed schema
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

-- Recreate has_role in private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Keep public.has_role as a thin wrapper for existing app/edge-function callers, but revoke public execute
-- Actually simpler: just recreate public.has_role but revoke execute from anon/authenticated.
-- Policies below will reference private.has_role directly.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Rewrite all policies that used public.has_role to use private.has_role
-- contact_submissions
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;
CREATE POLICY "Admins can delete contact submissions" ON public.contact_submissions
  FOR DELETE USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions
  FOR SELECT USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions
  FOR INSERT WITH CHECK (
    name IS NOT NULL AND length(name) BETWEEN 1 AND 200
    AND email IS NOT NULL AND length(email) BETWEEN 3 AND 320
    AND message IS NOT NULL AND length(message) BETWEEN 1 AND 5000
  );

-- court_bookings
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.court_bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.court_bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.court_bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.court_bookings;
CREATE POLICY "Admins can delete bookings" ON public.court_bookings
  FOR DELETE USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update bookings" ON public.court_bookings
  FOR UPDATE USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can view all bookings" ON public.court_bookings
  FOR SELECT USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can create bookings" ON public.court_bookings
  FOR INSERT WITH CHECK (
    customer_name IS NOT NULL AND length(customer_name) BETWEEN 1 AND 200
    AND (customer_email IS NULL OR length(customer_email) BETWEEN 3 AND 320)
    AND court_type IS NOT NULL AND length(court_type) BETWEEN 1 AND 50
    AND dates IS NOT NULL AND length(dates) BETWEEN 1 AND 500
  );

-- events
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can delete events" ON public.events
  FOR DELETE USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can insert events" ON public.events
  FOR INSERT WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update events" ON public.events
  FOR UPDATE USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- orders
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- players
DROP POLICY IF EXISTS "Admins can delete players" ON public.players;
DROP POLICY IF EXISTS "Admins can insert players" ON public.players;
DROP POLICY IF EXISTS "Admins can update players" ON public.players;
CREATE POLICY "Admins can delete players" ON public.players
  FOR DELETE USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can insert players" ON public.players
  FOR INSERT WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update players" ON public.players
  FOR UPDATE USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- products
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- user_roles
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- 2. Storage: restrict email-assets uploads to admins
DROP POLICY IF EXISTS "Authenticated users can upload email assets" ON storage.objects;
CREATE POLICY "Admins can upload email assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'email-assets' AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );
CREATE POLICY "Admins can delete email assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'email-assets' AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- 3. Drop broad SELECT policies on public buckets to prevent listing.
-- Public bucket files remain accessible via public URLs (RLS is bypassed for public bucket public URLs).
DROP POLICY IF EXISTS "Public read access for email assets" ON storage.objects;
DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Player images are publicly accessible" ON storage.objects;
