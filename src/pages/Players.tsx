import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Player {
  id: string;
  name: string;
  sport: string;
  level: string;
  experience_years: number;
  image_urls: string[];
  bio?: string | null;
}

const Players = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPlayers(data as unknown as Player[]);
        setLoading(false);
      });
  }, []);

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

          {loading ? (
            <p className="text-center text-muted-foreground py-24">Loading players...</p>
          ) : players.length === 0 ? (
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
                  className="glass-card overflow-hidden flex flex-col group hover:border-primary/40 transition-colors"
                >
                  {/* Photo area */}
                  <div className="w-full aspect-square overflow-hidden bg-secondary/40 flex items-center justify-center">
                    {player.image_urls.length > 0 ? (
                      <img
                        src={player.image_urls[0]}
                        alt={player.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info area */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display text-sm font-bold group-hover:text-primary transition-colors mb-1">
                      {player.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs bg-primary/15 text-primary px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                        {player.sport}
                      </span>
                      <span className="text-xs text-muted-foreground">{player.level}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {player.experience_years} yr{player.experience_years !== 1 ? "s" : ""} experience
                    </p>
                    {player.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-3 flex-1">{player.bio}</p>
                    )}
                    {/* Extra photos */}
                    {player.image_urls.length > 1 && (
                      <div className="flex gap-1.5 mt-3">
                        {player.image_urls.slice(1).map((url, j) => (
                          <img
                            key={j}
                            src={url}
                            alt=""
                            className="w-9 h-9 rounded-md object-cover border border-border/40"
                          />
                        ))}
                      </div>
                    )}
                  </div>
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
