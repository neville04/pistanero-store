import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import heroImage from "@/assets/hero-slide-1.jpg";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const featured = products.slice(0, 4);

const Index = () => {
  const { addItem } = useCart();

  const handleAdd = (product: (typeof products)[0]) => {
    addItem({ id: product.id, name: product.name, price: product.price });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen">
      {/* Full-screen Hero */}
      <div className="relative w-full h-screen overflow-hidden">
        <img
          src={heroImage}
          alt="Pistanero – The Home of Sports"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="absolute inset-0 z-10 px-4 pt-20 md:pt-24 lg:pt-28 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            {/* Decorative line */}
            <motion.div
              className="w-12 h-[2px] bg-primary mx-auto mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />


            <h1
              className="uppercase font-black leading-none"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3.5rem, 10vw, 9rem)",
                letterSpacing: "0.05em",
              }}
            >
              <motion.span
                className="text-foreground block"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                THE HOME
              </motion.span>
              <motion.span
                className="text-primary block mt-1"
                style={{ letterSpacing: "0.12em" }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                OF SPORTS
              </motion.span>
            </h1>

            {/* Decorative line */}
            <motion.div
              className="w-12 h-[2px] bg-primary mx-auto mt-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="-mt-32 relative z-10 pt-4 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">
            Featured <span className="text-primary">Products</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Top picks for every athlete.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex flex-col hover-glow group"
              >
                <div className="w-full h-40 bg-secondary/50 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs font-display uppercase tracking-widest">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-display text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-xs mb-3 flex-1">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">${product.price}</span>
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
