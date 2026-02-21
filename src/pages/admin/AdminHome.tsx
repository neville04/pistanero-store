import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Package, DollarSign, Clock, Truck, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, sales: 0, pending: 0, processing: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/admin-login"); return; }

    const load = async () => {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) { navigate("/"); return; }

      const { data: orders } = await supabase.from("orders").select("total, status");
      if (orders) {
        setStats({
          total: orders.length,
          sales: orders.reduce((s, o) => s + o.total, 0),
          pending: orders.filter((o) => o.status === "pending").length,
          processing: orders.filter((o) => o.status === "processing").length,
          delivered: orders.filter((o) => o.status === "delivered").length,
        });
      }
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    { icon: Package, label: "Total Orders", value: stats.total, color: "text-primary" },
    { icon: DollarSign, label: "Total Sales", value: `$${stats.sales.toFixed(2)}`, color: "text-green-400" },
    { icon: Clock, label: "Pending", value: stats.pending, color: "text-yellow-400" },
    { icon: Truck, label: "Processing", value: stats.processing, color: "text-blue-400" },
    { icon: CheckCircle2, label: "Delivered", value: stats.delivered, color: "text-green-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold mb-8">
        Dashboard <span className="text-primary">Overview</span>
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass-card p-5 text-center">
            <c.icon className={`w-6 h-6 mx-auto mb-2 ${c.color}`} />
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminHome;
