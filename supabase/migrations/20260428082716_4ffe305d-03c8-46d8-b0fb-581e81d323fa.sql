-- Restringir SECURITY DEFINER functions: revocar al anon
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Reemplazar INSERT policies públicas con check mínimo (no "always true")
DROP POLICY "Anyone can create pickup" ON public.pickup_requests;
CREATE POLICY "Anyone can create pickup" ON public.pickup_requests
  FOR INSERT WITH CHECK (
    length(company) > 0 AND length(contact) > 0 AND length(phone) > 0
    AND length(zone) > 0 AND length(address) > 0
  );

DROP POLICY "Anyone can create quote" ON public.quote_requests;
CREATE POLICY "Anyone can create quote" ON public.quote_requests
  FOR INSERT WITH CHECK (
    length(origin) > 0 AND length(destination) > 0 AND length(service) > 0
  );