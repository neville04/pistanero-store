import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Loader2, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from("contact_submissions").insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      if (error) throw error;

      // Notify admin
      await supabase.functions.invoke("send-contact-notification", {
        body: { name: name.trim(), email: email.trim(), message: message.trim() },
      });

      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-10 text-center"
            >
              <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-muted-foreground text-sm">
                Thanks, <span className="text-foreground font-medium">{name}</span>. We'll get back to you at <span className="text-foreground">{email}</span> shortly.
              </p>
              <button
                onClick={() => { setSubmitted(false); setName(""); setEmail(""); setMessage(""); }}
                className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-full font-display text-sm uppercase tracking-widest hover:bg-primary/90 transition-all"
              >
                Send Another
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <textarea
                rows={5}
                placeholder="Your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground font-display text-sm uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all hover-glow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : "Send Message"}
              </button>
            </motion.form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
