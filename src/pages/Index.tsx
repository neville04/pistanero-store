import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Star } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import { products } from "@/data/products";

const features = [
  { icon: ShieldCheck, title: "Premium Quality", desc: "Tournament-grade equipment for every athlete." },
  { icon: Truck, title: "Fast Delivery", desc: "Free shipping on orders over $100." },
  { icon: Star, title: "Top Brands", desc: "Curated selection from the world's best." },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroCarousel />

      {/* Brand Intro */}
      <section className="relative -mt-32 z-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            THE HOME OF <span className="text-primary">SPORTS</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8"
          >
            Pistanero delivers premium sports equipment to athletes who demand the best. 
            From rackets to apparel, gear up with confidence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/products"
              className="px-8 py-3 bg-primary text-primary-foreground font-display text-sm uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all hover-glow flex items-center gap-2"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/auth"
              className="px-8 py-3 border border-foreground/20 text-foreground font-display text-sm uppercase tracking-widest rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 text-center hover-glow"
            >
              <f.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Featured <span className="text-primary">Equipment</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 group hover-glow"
              >
                <div className="w-full h-40 bg-secondary/50 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm font-display">{product.category}</span>
                </div>
                <h3 className="font-display text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-primary font-bold">${product.price}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-primary font-display text-sm uppercase tracking-widest hover:underline"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-display text-xl font-bold mb-2">
            <span className="text-primary">PISTA</span>NERO
          </p>
          <p className="text-muted-foreground text-sm">
            © 2026 Pistanero. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
