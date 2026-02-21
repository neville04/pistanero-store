import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Filter } from "lucide-react";
import { products, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addItem } = useCart();

  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAdd = (product: Product) => {
    addItem({ id: product.id, name: product.name, price: product.price });
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
            Our <span className="text-primary">Products</span>
          </motion.h1>
          <p className="text-muted-foreground mb-8">Premium sports equipment for every athlete.</p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Filter className="w-5 h-5 text-muted-foreground mt-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 flex flex-col hover-glow group"
              >
                <div className="w-full h-44 bg-secondary/50 rounded-lg mb-4 flex items-center justify-center">
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
      </div>
      <Footer />
    </div>
  );
};

export default Products;
