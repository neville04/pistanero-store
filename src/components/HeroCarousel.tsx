import { motion } from "framer-motion";
import heroImage from "@/assets/hero-slide-1.png";

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Pistanero – The Home of Sports"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Hero Text */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-foreground leading-tight tracking-tight">
            The Home
            <br />
            <span className="text-foreground/90">of </span>
            <span className="text-primary">Sp</span>
            <span className="text-foreground/90">orts</span>
          </h1>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
