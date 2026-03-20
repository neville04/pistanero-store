import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Users, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courtType: string;
}

const BookingFormDialog = ({ open, onOpenChange, courtType }: BookingFormDialogProps) => {
  const [name, setName] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [numberOfTeams, setNumberOfTeams] = useState(1);
  const [dates, setDates] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setName("");
    setTeamSize(1);
    setNumberOfTeams(1);
    setDates("");
    setSubmitted(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(reset, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("court_bookings").insert({
        customer_name: name,
        team_size: teamSize,
        number_of_teams: numberOfTeams,
        dates,
        court_type: courtType,
        status: "pending",
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit booking");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative glass-card w-full max-w-md p-6 z-10"
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">Booking Received!</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  We'll confirm your <span className="text-primary font-medium capitalize">{courtType}</span> court booking shortly. Check back or call us for confirmation.
                </p>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-display text-sm uppercase tracking-widest hover:bg-primary/90 transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold mb-1">
                  Book <span className="text-primary capitalize">{courtType}</span> Court
                </h2>
                <p className="text-muted-foreground text-sm mb-6">Fill in the details below and we'll confirm your slot.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> Team Size
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={teamSize}
                        onChange={(e) => setTeamSize(Number(e.target.value))}
                        required
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> No. of Teams
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={numberOfTeams}
                        onChange={(e) => setNumberOfTeams(Number(e.target.value))}
                        required
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" /> Date(s) &amp; Time Preference
                    </label>
                    <textarea
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                      required
                      rows={3}
                      placeholder="e.g. Monday 23 Jun, 9 AM – 11 AM"
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-primary-foreground font-display text-sm uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all hover-glow disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : "Submit Booking"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingFormDialog;
