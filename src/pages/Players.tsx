import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import Footer from "@/components/Footer";

interface Player {
  id: string;
  name: string;
  sport: string;
  level: string;
  image_url?: string | null;
  bio?: string | null;
}

// Placeholder data — swap with a real DB table when ready
const placeholderPlayers: Player[] = [];

const Players = () => {
  const [players] = useState<Player[]>(placeholderPlayers);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-primary font-display mb-2">
              Skills Development
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-primary">Players</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Meet the registered players training and competing at Pistanero. Each profile showcases
              their sport, level, and journey on the court.
            </p>
          </motion.div>

          {/* Grid */}
          {players.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                <User className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-display text-lg text-foreground/70">No players registered yet</p>
              <p className="text-muted-foreground text-sm max-w-sm">
                Player profiles will appear here once they are added to the platform.
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {players.map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-5 flex flex-col items-center text-center group hover:border-primary/40 transition-colors"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-secondary/40 flex items-center justify-center border border-border/40">
                    {player.image_url ? (
                      <img
                        src={player.image_url}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="font-display text-sm font-bold group-hover:text-primary transition-colors mb-1">
                    {player.name}
                  </h3>
                  <span className="text-xs bg-primary/15 text-primary px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide mb-2">
                    {player.sport}
                  </span>
                  <p className="text-xs text-muted-foreground">{player.level}</p>
                  {player.bio && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{player.bio}</p>
                  )}
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

export default Players;
