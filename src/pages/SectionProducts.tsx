import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import SignInPromptDialog from "@/components/SignInPromptDialog";
import ProductImageDialog from "@/components/ProductImageDialog";

interface SectionProductsProps {
  section: string;
  title: string;
  subtitle: string;
  showGenderFilter?: boolean;
}

const GENDER_FILTERS = ["All", "Men", "Women", "Kids"];

const SectionProducts = ({ section, title, subtitle, showGenderFilter = false }: SectionProductsProps) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { products, loading } = useProducts();
  const [signInOpen, setSignInOpen] = useState(false);
  const [genderFilter, setGenderFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageViewer, setImageViewer] = useState<{ open: boolean; images: string[]; name: string }>({
    open: false,
    images: [],
    name: "",
  });

  // Filter by section, then optionally by gender sub-section
  const sectionFiltered = products.filter((p) => p.section === section);
  const filtered = showGenderFilter && genderFilter !== "All"
    ? sectionFiltered.filter((p) => p.category.toLowerCase() === genderFilter.toLowerCase() || p.color?.toLowerCase().includes(genderFilter.toLowerCase()) || p.section === genderFilter.toLowerCase())
    : sectionFiltered;

  // For apparel we filter by the gender stored in section field (men/women/kids)
  const apparelFiltered = showGenderFilter && genderFilter !== "All"
    ? products.filter((p) =>
        ["men", "women", "kids"].includes(p.section) &&
        (genderFilter === "Men" ? p.section === "men" :
         genderFilter === "Women" ? p.section === "women" :
         p.section === "kids")
      )
    : products.filter((p) => ["men", "women", "kids"].includes(p.section));

  const baseProducts = showGenderFilter ? apparelFiltered : filtered;
  const q = searchQuery.trim().toLowerCase();
  const displayProducts = q
    ? baseProducts.filter((p) =>
        [p.name, p.description, p.category, p.section, p.color, p.size]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    : baseProducts;

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
            {title}
          </motion.h1>
          <p className="text-muted-foreground mb-8">{subtitle}</p>

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Gender Filter — apparel only */}
          {showGenderFilter && (
            <div className="flex gap-2 mb-8 flex-wrap">
              {GENDER_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setGenderFilter(f)}
                  className={`px-5 py-2 rounded-full text-sm font-display font-semibold uppercase tracking-widest transition-all ${
                    genderFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading products...</p>
          ) : displayProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No products available yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product, i) => (
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

export default SectionProducts;
