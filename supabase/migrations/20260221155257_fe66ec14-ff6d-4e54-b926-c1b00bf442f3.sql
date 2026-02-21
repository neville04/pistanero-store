
-- Enable realtime for orders table so customers see live status updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
