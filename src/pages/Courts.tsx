import { motion } from "framer-motion";
import { Clock, MapPin, Phone, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import tennisCourt1 from "@/assets/court-tennis-1.jpg";
import tennisCourt2 from "@/assets/court-tennis-2.jpg";
import tennisCourt3 from "@/assets/court-tennis-3.jpg";
import tennisCourt4 from "@/assets/court-tennis-4.jpg";
import basketball1 from "@/assets/court-basketball-1.jpg";
import basketball2 from "@/assets/court-basketball-2.jpg";

const MAP_URL = "https://maps.apple.com/place?address=Mutungo,%20Ssabagabo,%20Uganda&auid=15265011981223942931&coordinate=0.202020,32.562229&lsp=6489&name=Mutungo&map=explore";

const courtSections = {
  tennis: {
    title: "Tennis Courts",
    subtitle: "Clay courts open daily for individual play, coaching, and competitions.",
    images: [tennisCourt1, tennisCourt2, tennisCourt3, tennisCourt4],
    pricing: [
      { label: "Court per hour", price: "10,000" },
      { label: "Coach per hour", price: "20,000" },
      { label: "Playing with a Partner (Club-provided)", price: "10,000" },
      { label: "Lights on (after 7 PM)", price: "20,000" },
      { label: "Equipment (Racket & Balls)", price: "10,000" },
    ],
    note: "Clients are encouraged to bring their own rackets or purchase/hire one at the Club.",
  },
  basketball: {
    title: "Basketball Court",
    subtitle: "Full-size outdoor court for individual sessions, team play, and coaching.",
    images: [basketball1, basketball2],
    pricing: [
      { label: "Individual per hour", price: "5,000" },
      { label: "Basketball team per hour", price: "30,000" },
      { label: "Coach per hour", price: "35,000" },
      { label: "Individual monthly membership", price: "60,000" },
      { label: "Family monthly membership", price: "240,000" },
    ],
    note: null,
  },
  volleyball: {
    title: "Volleyball Court",
    subtitle: "Book the court for recreational or competitive volleyball sessions.",
    images: [basketball1],
    pricing: [
      { label: "Court per hour", price: "10,000" },
    ],
    note: "Contact us for group booking rates.",
  },
  badminton: {
    title: "Badminton Court",
    subtitle: "Indoor-friendly badminton available with equipment hire on-site.",
    images: [tennisCourt3],
    pricing: [
      { label: "Court per hour", price: "10,000" },
      { label: "Rackets for rent", price: "5,000" },
      { label: "Shuttles for rent", price: "5,000" },
    ],
    note: "Clients are encouraged to bring their own rackets and shuttles.",
  },
};

const allCourts = [
  { slug: "tennis", label: "Tennis", image: tennisCourt1, tagline: "Clay courts · Coaching available" },
  { slug: "basketball", label: "Basketball", image: basketball1, tagline: "Full-size court · Team & individual" },
  { slug: "volleyball", label: "Volleyball", image: basketball2, tagline: "Recreational & competitive" },
  { slug: "badminton", label: "Badminton", image: tennisCourt4, tagline: "Equipment hire available" },
];

const Courts = () => {
  const { sport } = useParams<{ sport?: string }>();
  const section = sport && courtSections[sport as keyof typeof courtSections];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-28 px-4 pb-16">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            {sport && section ? (
              <>
                <Link to="/courts" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-3">
                  ← All Courts
                </Link>
                <h1 className="font-display text-4xl font-bold mb-2">
                  {section.title.split(" ")[0]} <span className="text-primary">{section.title.split(" ").slice(1).join(" ")}</span>
                </h1>
                <p className="text-muted-foreground">{section.subtitle}</p>
              </>
            ) : (
              <>
                <h1 className="font-display text-4xl font-bold mb-2">
                  Our <span className="text-primary">Courts</span>
                </h1>
                <p className="text-muted-foreground mb-2">
                  World-class sports courts available for hourly booking.
                </p>
              </>
            )}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" /> Open 6:00 AM – 10:00 PM Daily
              </span>
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <MapPin className="w-4 h-4 text-primary" /> Mutungo, Ssabagabo, Uganda
              </a>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-primary" /> 0771699039
              </span>
            </div>
          </motion.div>

          {/* Court overview grid */}
          {!sport && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {allCourts.map((court, i) => (
                <motion.div
                  key={court.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/courts/${court.slug}`} className="group block glass-card overflow-hidden hover-glow">
                    <div className="h-48 overflow-hidden">
                      <img src={court.image} alt={court.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">{court.label}</h3>
                      <p className="text-muted-foreground text-xs mt-1 mb-3">{court.tagline}</p>
                      <span className="flex items-center gap-1 text-primary text-sm font-medium">
                        View & Book <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Specific court detail */}
          {sport && section && (
            <div className="mt-6 grid lg:grid-cols-2 gap-10">
              {/* Photos */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="rounded-xl overflow-hidden h-72">
                  <img src={section.images[0]} alt={section.title} className="w-full h-full object-cover" />
                </div>
                {section.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-3">
                    {section.images.slice(1, 4).map((img, i) => (
                      <div key={i} className="rounded-lg overflow-hidden h-24">
                        <img src={img} alt={`${section.title} ${i + 2}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Pricing + Book */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="glass-card p-6">
                  <h2 className="font-display text-xl font-bold mb-4">Pricing</h2>
                  <div className="space-y-3">
                    {section.pricing.map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                        <span className="text-sm text-foreground/80">{item.label}</span>
                        <span className="text-primary font-bold text-sm">{item.price} UGX</span>
                      </div>
                    ))}
                  </div>
                  {section.note && (
                    <p className="text-xs text-muted-foreground mt-4 italic">{section.note}</p>
                  )}
                </div>

                <div className="glass-card p-6 space-y-3">
                  <h2 className="font-display text-xl font-bold">Book This Court</h2>
                  <p className="text-sm text-muted-foreground">
                    Call or WhatsApp us to reserve your slot. Walk-ins welcome, subject to availability.
                  </p>
                  <a
                    href="tel:0771699039"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/80 transition-colors w-fit"
                  >
                    <Phone className="w-4 h-4" /> Call 0771699039
                  </a>
                  <Link
                    to="/contact"
                    className="flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-full font-medium text-sm hover:bg-primary/10 transition-colors w-fit"
                  >
                    Send a Message
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Courts;
