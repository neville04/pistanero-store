import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  section: string;
  description: string | null;
  color: string | null;
  size: string | null;
  image_urls: string[];
  is_featured: boolean;
}

export const useProducts = (featuredOnly = false) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (featuredOnly) query = query.eq("is_featured", true);
      const { data } = await query;
      if (data) setProducts(data as unknown as Product[]);
      setLoading(false);
    };
    fetch();
  }, [featuredOnly]);

  return { products, loading };
};
