import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage1 from "@/assets/hero-slide-1.jpg";
import heroImage2 from "@/assets/hero-slide-2.jpg";
import heroImage3 from "@/assets/hero-slide-3.jpg";
import heroImage4 from "@/assets/hero-slide-4.jpg";
import heroImage5 from "@/assets/hero-slide-5.jpg";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import SignInPromptDialog from "@/components/SignInPromptDialog";

const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5];

const HeroCarouselInner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {heroImages.map((src, i) => (
        <motion.img
          key={i}
          src={src}
          alt="Pista Nero – The Home of Sports"
          className="absolute inset-0 w-full h-full object-cover"
          animate={{
            opacity: i === current ? 1 : 0,
            scale: i === current ? 1.05 : 1,
          }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${i === current ? "bg-primary w-6" : "bg-foreground/40"}`}
          />
        ))}
      </div>
    </>
  );
};

const Index = () => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { products: featured, loading } = useProducts(true);
  const [signInOpen, setSignInOpen] = useState(false);

  const handleAdd = (product: { id: string; name: string; price: number; image_urls: string[] }) => {
    if (!user) { setSignInOpen(true); return; }
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image_urls?.[0] });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen">
      {/* Full-screen Hero */}
      <div className="relative w-full h-screen overflow-hidden">
        <HeroCarouselInner />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 z-10 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
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
                className="text-white block drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                BUILT FOR
              </motion.span>
              <motion.span
                className="text-primary block mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                style={{ letterSpacing: "0.12em" }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                THE COURT
              </motion.span>
            </h1>

            <motion.div
              className="w-12 h-[2px] bg-primary mx-auto mt-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            />

            <motion.a
              href="/products"
              className="inline-block mt-8 px-8 py-3 bg-primary text-primary-foreground font-display text-sm uppercase tracking-widest rounded hover:bg-primary/80 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              Shop Now
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Events & More */}
      <section className="py-20 px-4 bg-secondary/20 border-y border-border/40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Events &amp; <span className="text-primary">More</span>
            </h2>
            <p className="text-muted-foreground">News, events, and stories from Pista Nero.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { tag: "Announcement", title: "Basketball Court Now Open", date: "Feb 2026", excerpt: "We're excited to announce the opening of our full-size outdoor basketball court — now available for individual and team bookings." },
              { tag: "Programme", title: "Youth Tennis Development Launches", date: "Feb 2026", excerpt: "Our certified coaches are now enrolling young players aged 6–18 in our Tennis Youth Development Programme. Limited spots available." },
              { tag: "Community", title: "Saturday Running Club", date: "Ongoing", excerpt: "Join our growing community of runners every Saturday morning. All paces welcome — come for the run, stay for the good vibes." },
            ].map((post, i) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex flex-col hover-glow group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">{post.tag}</span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h3 className="font-display text-base font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-muted-foreground text-sm flex-1">{post.excerpt}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">
            Featured <span className="text-primary">Products</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Top picks for every athlete.
          </p>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 flex flex-col hover-glow group will-change-transform"
                >
                  <div className="w-full h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-secondary/30">
                    {product.image_urls.length > 0 ? (
                      <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-contain" loading="lazy" />
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
      </section>



      <SignInPromptDialog open={signInOpen} onOpenChange={setSignInOpen} />
      <Footer />
    </div>
  );
};

export default Index;
