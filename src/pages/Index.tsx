import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

interface EventItem {
  id: string;
  title: string;
  excerpt: string | null;
  tag: string;
  date_label: string;
  image_url: string | null;
}

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

/* ── Hero overlay event card mini-carousel ── */
const HeroEventCards = ({ events }: { events: EventItem[] }) => {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  if (events.length === 0) return null;

  const total = Math.min(events.length, 3);
  const visible = events.slice(0, total);

  const prev = () => {
    setDirection(-1);
    setIdx((i) => (i - 1 + total) % total);
  };
  const next = () => {
    setDirection(1);
    setIdx((i) => (i + 1) % total);
  };

  const ev = visible[idx];

  // Card is tall: image top half + text bottom half, reaching ~up to "Own" level
  return (
    <div
      className="absolute z-20"
      style={{ left: 28, bottom: 28 }}
    >
      {/* Arrow row — sits just above the card, aligned to its right edge */}
      <div className="flex justify-end gap-1.5 mb-2 pr-0.5">
        <button
          onClick={prev}
          className="flex items-center justify-center w-7 h-7 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm text-white hover:bg-primary hover:border-primary transition-all text-sm font-semibold"
          aria-label="Previous event"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="flex items-center justify-center w-7 h-7 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm text-white hover:bg-primary hover:border-primary transition-all text-sm font-semibold"
          aria-label="Next event"
        >
          ›
        </button>
      </div>

      {/* Card stack — taller card with image top half, text bottom half */}
      <div className="relative w-[260px]" style={{ height: 320 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={ev.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -18 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(10, 10, 15, 0.55)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.13)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {/* Top half — image */}
            <div className="h-[160px] w-full overflow-hidden flex-shrink-0 bg-black/30">
              {ev.image_url ? (
                <img
                  src={ev.image_url}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/20 text-xs uppercase tracking-widest font-semibold">{ev.tag}</span>
                </div>
              )}
            </div>

            {/* Bottom half — text */}
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                  {ev.tag}
                </span>
                <span className="text-[10px] text-white/50">{ev.date_label}</span>
                {total > 1 && (
                  <span className="ml-auto text-[10px] text-white/40">{idx + 1}/{total}</span>
                )}
              </div>
              <h3 className="text-white font-bold leading-snug line-clamp-2 mb-1.5" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.03em" }}>
                {ev.title}
              </h3>
              {ev.excerpt && (
                <p className="text-white/60 text-xs line-clamp-3 flex-1">{ev.excerpt}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const Index = () => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { products: featured, loading } = useProducts(true);
  const [signInOpen, setSignInOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    supabase.from("events").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setEvents(data as unknown as EventItem[]);
    });
  }, []);

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

        {/* Tagline — centered */}
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
                fontSize: "clamp(3rem, 8.5vw, 7.8rem)",
                letterSpacing: "0.05em",
              }}
            >
              <motion.span
                className="text-white block drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                OWN THE
              </motion.span>
              <motion.span
                className="text-primary block mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                style={{ letterSpacing: "0.12em" }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                COURT
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

        {/* Event cards — bottom-left overlay */}
        <HeroEventCards events={events} />
      </div>

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
