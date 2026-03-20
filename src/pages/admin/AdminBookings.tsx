import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Booking {
  id: string;
  customer_name: string;
  team_size: number;
  number_of_teams: number;
  dates: string;
  court_type: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  confirmed: "text-green-400 bg-green-400/10 border-green-400/30",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/30",
};

const AdminBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/admin-login"); return; }

    const load = async () => {
      const { data: roleData } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!roleData) { navigate("/"); return; }

      const { data, error } = await supabase
        .from("court_bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) { toast.error(error.message); }
      if (data) setBookings(data as Booking[]);
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("court_bookings").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    toast.success("Booking status updated");
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase.from("court_bookings").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setBookings((prev) => prev.filter((b) => b.id !== id));
    toast.success("Booking removed");
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold mb-2">
        Court <span className="text-primary">Bookings</span>
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        {bookings.length} booking{bookings.length !== 1 ? "s" : ""} submitted
      </p>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Customer", "Court", "Team Size", "Teams", "Date(s)", "Submitted", "Status", ""].map((h) => (
                  <th key={h} className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="p-4 font-medium">{b.customer_name}</td>
                  <td className="p-4 capitalize">{b.court_type}</td>
                  <td className="p-4 text-center">{b.team_size}</td>
                  <td className="p-4 text-center">{b.number_of_teams}</td>
                  <td className="p-4 text-muted-foreground max-w-[180px]">{b.dates}</td>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border bg-transparent font-medium cursor-pointer ${statusColors[b.status] || statusColors.pending}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {bookings.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No bookings yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default AdminBookings;
