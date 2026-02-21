import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-28 px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold mb-2"
          >
            Get In <span className="text-primary">Touch</span>
          </motion.h1>
          <p className="text-muted-foreground mb-10">We'd love to hear from you.</p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Mail, label: "Email", value: "pistanero@outlook.com" },
              { icon: Phone, label: "Phone", value: "0771699039" },
              { icon: MapPin, label: "Location", value: "Sabagabo, Uganda" },
            ].map((item) => (
              <div key={item.label} className="glass-card p-6 text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="font-medium text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <textarea
              rows={5}
              placeholder="Your message..."
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <button className="w-full py-3 bg-primary text-primary-foreground font-display text-sm uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all hover-glow">
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
