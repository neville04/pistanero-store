import { motion } from "framer-motion";
import { Clock, MapPin, Phone } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import Footer from "@/components/Footer";

const Courts = () => {
  const { products, loading } = useProducts();
  const courts = products.filter((p) => p.section === "courts");

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-28 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold mb-2"
          >
            Book a <span className="text-primary">Court</span>
          </motion.h1>
          <p className="text-muted-foreground mb-4">
            World-class tennis courts available for hourly booking.
          </p>

          <div className="flex flex-wrap gap-4 mb-10 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" /> Open 6:00 AM – 10:00 PM Daily
            </span>
            <a
              href="https://maps.apple.com/place?address=Mutungo,%20Ssabagabo,%20Uganda&auid=15265011981223942931&coordinate=0.202020,32.562229&lsp=6489&name=Mutungo&map=explore"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <MapPin className="w-4 h-4 text-primary" /> Mutungo, Ssabagabo, Uganda
            </a>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-primary" /> 0771699039
            </span>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading courts...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {courts.map((court, i) => (
                <motion.div
                  key={court.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card overflow-hidden hover-glow group"
                >
                  <div className="w-full h-56 overflow-hidden">
                    {court.image_urls.length > 0 ? (
                      <img
                        src={court.image_urls[0]}
                        alt={court.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                        <span className="text-muted-foreground font-display uppercase tracking-widest text-sm">Court</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {court.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{court.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-primary font-bold text-xl">
                          {court.price.toLocaleString()} UGX
                        </span>
                        <span className="text-muted-foreground text-sm ml-1">/ hour</span>
                      </div>
                      <a
                        href="/contact"
                        className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors"
                      >
                        Book Now
                      </a>
                    </div>
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

export default Courts;
