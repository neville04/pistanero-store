
-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sport TEXT NOT NULL DEFAULT 'Tennis',
  level TEXT NOT NULL DEFAULT 'Beginner',
  experience_years INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view players"
  ON public.players FOR SELECT USING (true);

CREATE POLICY "Admins can insert players"
  ON public.players FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update players"
  ON public.players FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete players"
  ON public.players FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON public.players
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public)
VALUES ('player-images', 'player-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Player images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'player-images');

CREATE POLICY "Admins can upload player images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'player-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete player images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'player-images' AND has_role(auth.uid(), 'admin'::app_role));
