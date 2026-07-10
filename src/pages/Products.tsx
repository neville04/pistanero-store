import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Filter, Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import SignInPromptDialog from "@/components/SignInPromptDialog";
import ProductImageDialog from "@/components/ProductImageDialog";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [signInOpen, setSignInOpen] = useState(false);
  const [imageViewer, setImageViewer] = useState<{ open: boolean; images: string[]; name: string }>({
    open: false,
    images: [],
    name: "",
  });
  const { addItem } = useCart();
  const { user } = useAuth();
  const { products, loading } = useProducts();

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const byCategory =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? byCategory.filter((p) =>
        [p.name, p.description, p.category, p.section, p.color, p.size]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    : byCategory;

  const handleAdd = (product: { id: string; name: string; price: number; image_urls: string[] }) => {
    if (!user) { setSignInOpen(true); return; }
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
            Our <span className="text-primary">Products</span>
          </motion.h1>
          <p className="text-muted-foreground mb-8">Premium sports equipment for every athlete.</p>

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products (e.g. rackets, shoes)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

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

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading products...</p>
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
                  <button
                    type="button"
                    onClick={() => product.image_urls.length > 0 && setImageViewer({ open: true, images: product.image_urls, name: product.name })}
                    className="w-full h-44 rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-secondary/30 disabled:cursor-default"
                    disabled={product.image_urls.length === 0}
                    aria-label={`Open ${product.name} image gallery`}
                  >
                    {product.image_urls.length > 0 ? (
                      <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-muted-foreground text-xs font-display uppercase tracking-widest">
                        {product.category}
                      </span>
                    )}
                  </button>
                  <h3 className="font-display text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  {product.color && (
                    <p className="text-muted-foreground text-xs mb-1">{product.color}{product.size ? ` · Size ${product.size}` : ""}</p>
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
      <SignInPromptDialog open={signInOpen} onOpenChange={setSignInOpen} />
      <ProductImageDialog
        open={imageViewer.open}
        onOpenChange={(open) => setImageViewer((viewer) => ({ ...viewer, open }))}
        images={imageViewer.images}
        productName={imageViewer.name}
      />
      <Footer />
    </div>
  );
};

export default Products;
