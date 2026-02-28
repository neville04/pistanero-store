import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/Footer";

const sections = {
  coaches: {
    title: "Our Coaches",
    subtitle: "Experienced coaches available for tennis, basketball, and other sports.",
    details: [
      "One-on-one and group coaching sessions",
      "Tennis coach: 20,000 UGX / hour",
      "Basketball coach: 35,000 UGX / hour",
      "Personalised training plans available",
      "All skill levels welcome — beginner to advanced",
    ],
  },
  "youth-tennis": {
    title: "Tennis Youth Development Programme",
    subtitle: "Nurturing the next generation of tennis talent in Uganda.",
    details: [
      "Open to players aged 6–18",
      "Weekly structured training sessions",
      "Focus on technique, fitness, and match play",
      "Delivered by certified tennis coaches",
      "Affordable group rates available",
    ],
  },
};

const Skills = () => {
  const { type } = useParams<{ type?: string }>();
  const section = type && sections[type as keyof typeof sections];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-28 px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {section ? (
              <Link to="/skills" className="text-sm text-muted-foreground hover:text-primary transition-colors mb-3 inline-block">
                ← Skills Development
              </Link>
            ) : null}
            <h1 className="font-display text-4xl font-bold mb-2">
              Skills <span className="text-primary">Development</span>
            </h1>
            <p className="text-muted-foreground mb-10">
              {section ? section.subtitle : "Grow your game with expert coaching and structured development programmes."}
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
                  <Link to={`/skills/${key}`} className="group glass-card p-8 hover-glow flex flex-col h-full block">
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
                <h2 className="font-display text-xl font-bold">Get in Touch</h2>
                <p className="text-sm text-muted-foreground">
                  Reach out to book a coaching session or enrol in our youth programme.
                </p>
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

export default Skills;
