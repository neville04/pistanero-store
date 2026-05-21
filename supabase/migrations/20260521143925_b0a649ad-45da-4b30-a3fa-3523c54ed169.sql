UPDATE public.events
SET image_url = 'https://knulhygeseazoappsedy.supabase.co/storage/v1/object/public/product-images/events/courts-open-landscape.png',
    image_urls = ARRAY['https://knulhygeseazoappsedy.supabase.co/storage/v1/object/public/product-images/events/courts-open-landscape.png']
WHERE id = 'c1475238-80a3-4134-8c15-c8af5a8da1fc';
DELETE FROM public.events WHERE false;