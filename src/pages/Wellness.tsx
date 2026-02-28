import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/Footer";

const sections = {
  "running-club": {
    title: "Running Club Sessions",
    subtitle: "Join our community of runners for guided sessions through Mutungo and beyond.",
    details: [
      "Group runs every Saturday & Sunday morning",
      "Guided by experienced pacers",
      "All fitness levels welcome",
      "Post-run refreshments at the club",
    ],
    pricing: [{ label: "Per session", price: "Contact us" }],
  },
  "fitness-classes": {
    title: "Fitness Classes",
    subtitle: "Structured training sessions for strength, conditioning, and general fitness.",
    details: [
      "Weekly group fitness sessions",
      "Expert-led workouts",
      "Warm-up, conditioning & cool-down",
      "Open to members and non-members",
    ],
    pricing: [{ label: "Per class", price: "Contact us" }],
  },
};

const Wellness = () => {
  const { type } = useParams<{ type?: string }>();
  const section = type && sections[type as keyof typeof sections];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-28 px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {section ? (
              <Link to="/wellness" className="text-sm text-muted-foreground hover:text-primary transition-colors mb-3 inline-block">
                ← Wellness & Fitness
              </Link>
            ) : null}
            <h1 className="font-display text-4xl font-bold mb-2">
              Wellness &amp; <span className="text-primary">Fitness</span>
            </h1>
            <p className="text-muted-foreground mb-10">
              {section ? section.subtitle : "Active programmes to keep you moving and thriving."}
            </p>
          </motion.div>

          {!type && (
            <div className="grid sm:grid-cols-2 gap-8">
              {Object.entries(sections).map(([key, s], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <Link to={`/wellness/${key}`} className="group glass-card p-8 hover-glow flex flex-col h-full block">
                    <h2 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">{s.title}</h2>
                    <p className="text-muted-foreground text-sm mb-6 flex-1">{s.subtitle}</p>
                    <span className="text-primary text-sm font-medium">Learn more →</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {type && section && (
            <div className="grid lg:grid-cols-2 gap-10">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
                <h2 className="font-display text-xl font-bold mb-4">{section.title}</h2>
                <ul className="space-y-3">
                  {section.details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="text-primary mt-1">•</span> {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 space-y-4">
                <h2 className="font-display text-xl font-bold">Book a Session</h2>
                <p className="text-sm text-muted-foreground">Get in touch to reserve your spot or find out the next session schedule.</p>
                <a href="tel:0771699039" className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/80 transition-colors w-fit">
                  <Phone className="w-4 h-4" /> Call 0771699039
                </a>
                <Link to="/contact" className="flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-full font-medium text-sm hover:bg-primary/10 transition-colors w-fit">
                  Send a Message
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wellness;
