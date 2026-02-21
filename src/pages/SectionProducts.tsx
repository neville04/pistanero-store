import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Footer from "@/components/Footer";

interface SectionProductsProps {
  section: string;
  title: string;
  subtitle: string;
}

const SectionProducts = ({ section, title, subtitle }: SectionProductsProps) => {
  const { addItem } = useCart();
  const { products, loading } = useProducts();

  const filtered = products.filter((p) => p.section === section);

  const handleAdd = (product: { id: string; name: string; price: number; image_urls: string[] }) => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image_urls?.[0] });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-28 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold mb-2"
          >
            {title}
          </motion.h1>
          <p className="text-muted-foreground mb-10">{subtitle}</p>

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading products...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No products available yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6 flex flex-col hover-glow group"
                >
                  <div className="w-full h-44 rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-secondary/30">
                    {product.image_urls.length > 0 ? (
                      <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-muted-foreground text-xs font-display uppercase tracking-widest">
                        {product.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  {product.color && (
                    <p className="text-muted-foreground text-xs mb-1">
                      {product.color}{product.size ? ` · Size ${product.size}` : ""}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs mb-3 flex-1">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">{product.price.toLocaleString()} UGX</span>
                    <button
                      onClick={() => handleAdd(product)}
                      className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SectionProducts;
