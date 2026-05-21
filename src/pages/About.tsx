import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-28 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-primary">Pista Nero</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              The Home of Sports — where passion meets performance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 hover-glow"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h2
                  className="text-2xl font-bold uppercase tracking-wide"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Our Mission
                </h2>
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed">
                Our mission is to build a stronger healthier community by
                providing inclusive, high-quality sports facilities and programs
                that inspire people of all ages and abilities to move, compete
                and connect.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 hover-glow"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <h2
                  className="text-2xl font-bold uppercase tracking-wide"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Our Vision
                </h2>
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed">
                To be the leading facility in Uganda driving sports excellence
                and inspiring a nation of active citizens by creating an
                energetic, welcoming space where members can play, train, and
                improve their wellbeing while building lasting friendships.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
