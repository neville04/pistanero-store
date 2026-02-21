import { motion } from "framer-motion";
import heroImage from "@/assets/hero-slide-1.png";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Full-screen Hero */}
      <div className="relative w-full h-screen overflow-hidden">
        <img
          src={heroImage}
          alt="Pistanero – The Home of Sports"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Hero Text */}
        <div className="absolute inset-0 flex items-end justify-center z-10 pb-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight tracking-tight">
              The Home
              <br />
              <span className="text-foreground/90">of </span>
              <span className="text-primary">Sports</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
              Premium sports equipment for athletes who demand the best.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
