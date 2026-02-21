import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import heroImage from "@/assets/hero-slide-1.jpg";
import logo from "@/assets/logo.png";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const featured = products.slice(0, 4);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        <div className="absolute inset-0 z-10 px-4 pt-24 md:pt-28 lg:pt-32 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ scaleX: 0.8, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-block mb-3"
            >
              <span
                className="text-muted-foreground/60 uppercase tracking-[0.4em] text-xs md:text-sm font-medium"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Welcome to
              </span>
            </motion.div>
            <h1
              className="leading-[0.88] uppercase font-black"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(4.5rem, 12vw, 11rem)",
                letterSpacing: "0.04em",
              }}
            >
              <span className="text-foreground block">THE</span>
              <span
                className="text-foreground block relative"
                style={{ fontSize: "115%", letterSpacing: "-0.01em" }}
              >
                H
                <span className="relative inline-block">
                  <span>O</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-[3px] bg-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  />
                </span>
                ME
              </span>
              <motion.span
                className="text-primary block"
                style={{ fontSize: "105%", letterSpacing: "0.08em" }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="text-foreground/80" style={{ fontSize: "65%", letterSpacing: "0.15em", verticalAlign: "middle" }}>OF </span>
                SPORTS
              </motion.span>
            </h1>
            <motion.div
              className="mt-4 h-[2px] w-16 md:w-24 bg-primary/60 mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ duration: 0.6, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-20 px-4">
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

      {/* Footer */}
      <footer className="border-t border-border bg-card/40 backdrop-blur-xl py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img src={logo} alt="Pistanero" className="h-10 brightness-0 invert mb-4" />
            <p className="text-muted-foreground text-sm">
              Premium sports equipment for athletes who demand the best.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                0771699039
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                pistanero@outlook.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Sabagabo, Uganda
              </li>
            </ul>
          </div>

          {/* Social / WhatsApp */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Get in Touch</h4>
            <a
              href="https://wa.me/256771699039"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-medium text-sm hover:bg-[#1da851] transition-colors"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Pistanero. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
