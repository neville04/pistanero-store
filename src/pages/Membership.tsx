import { motion } from "framer-motion";
import { Check, Phone } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/Footer";

const plans = {
  monthly: {
    label: "Monthly Membership",
    tagline: "Flexible month-to-month access to all Pista Nero facilities.",
    individual: { price: "60,000", period: "/ month" },
    family: { price: "240,000", period: "/ month" },
    perks: [
      "Access to all sports courts for one hour each",
      "Access to upstairs facilities",
      "Use of the kitchen",
      "Priority booking",
      "Member discounts on equipment hire",
    ],
  },
  annual: {
    label: "Annual Membership",
    tagline: "Best value — enjoy a full year of sport and recreation.",
    individual: { price: "600,000", period: "/ year" },
    family: { price: "2,400,000", period: "/ year" },
    perks: [
      "Everything in Monthly",
      "2 months FREE (vs monthly pricing)",
      "Access to all sports courts for one hour each",
      "Access to upstairs facilities",
      "Use of the kitchen",
      "Priority booking year-round",
      "Member discounts on apparel & equipment",
    ],
  },
};

const Membership = () => {
  const { type } = useParams<{ type?: string }>();
  const plan = type && plans[type as keyof typeof plans];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-28 px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {plan ? (
              <Link to="/membership" className="text-sm text-muted-foreground hover:text-primary transition-colors mb-3 inline-block">
                ← All Plans
              </Link>
            ) : null}
            <h1 className="font-display text-4xl font-bold mb-2">
              {plan ? plan.label.split(" ")[0] : "Join"} <span className="text-primary">{plan ? plan.label.split(" ").slice(1).join(" ") : "Pista Nero"}</span>
            </h1>
            <p className="text-muted-foreground mb-10">
              {plan ? plan.tagline : "Choose a membership plan that fits your lifestyle."}
            </p>
          </motion.div>

          {/* Plan picker */}
          {!type && (
            <div className="grid sm:grid-cols-2 gap-8">
              {Object.entries(plans).map(([key, p], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className={`glass-card p-8 hover-glow flex flex-col ${key === "annual" ? "border border-primary/40" : ""}`}
                >
                  {key === "annual" && (
                    <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full w-fit mb-4 font-medium uppercase tracking-wider">
                      Best Value
                    </span>
                  )}
                  <h2 className="font-display text-2xl font-bold mb-1">{p.label}</h2>
                  <p className="text-muted-foreground text-sm mb-6">{p.tagline}</p>
                  <div className="mb-6 space-y-2">
                    <div>
                      <span className="text-primary font-bold text-3xl">{p.individual.price} UGX</span>
                      <span className="text-muted-foreground text-sm ml-1">{p.individual.period} · Individual</span>
                    </div>
                    <div>
                      <span className="text-primary font-bold text-2xl">{p.family.price} UGX</span>
                      <span className="text-muted-foreground text-sm ml-1">{p.family.period} · Family</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-8 flex-1">
                    {p.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/membership/${key}`}
                    className="w-full py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium text-center hover:bg-primary/80 transition-colors"
                  >
                    Get {p.label.split(" ")[0]} Plan
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Single plan detail */}
          {type && plan && (
            <div className="grid lg:grid-cols-2 gap-10">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
                <h2 className="font-display text-2xl font-bold mb-6">What's Included</h2>
                <ul className="space-y-3">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="glass-card p-8">
                  <h2 className="font-display text-2xl font-bold mb-4">Pricing</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Individual</p>
                      <span className="text-primary font-bold text-3xl">{plan.individual.price} UGX</span>
                      <span className="text-muted-foreground text-sm ml-1">{plan.individual.period}</span>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Family</p>
                      <span className="text-primary font-bold text-3xl">{plan.family.price} UGX</span>
                      <span className="text-muted-foreground text-sm ml-1">{plan.family.period}</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 space-y-4">
                  <h2 className="font-display text-xl font-bold">Sign Up Today</h2>
                  <p className="text-sm text-muted-foreground">
                    Call or WhatsApp us to get started with your membership.
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

export default Membership;
