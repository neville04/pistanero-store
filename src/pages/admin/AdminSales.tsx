import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  items: OrderItem[];
  customer_name: string | null;
}

const AdminSales = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/admin-login"); return; }

    const load = async () => {
      const { data: roleData } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!roleData) { navigate("/"); return; }

      const { data } = await supabase
        .from("orders")
        .select("id, created_at, total, items, customer_name")
        .eq("status", "delivered")
        .order("created_at", { ascending: false });

      if (data) setOrders(data.map((o: any) => ({ ...o, items: o.items as OrderItem[] })));
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold mb-2">
        Sales <span className="text-primary">Report</span>
      </h1>
      <p className="text-muted-foreground text-sm mb-8">Completed orders only</p>

      <div className="glass-card p-6 mb-8 inline-block">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Revenue</p>
        <p className="text-3xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">{orders.length} completed orders</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Order</th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Items</th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="p-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                  <td className="p-4">{order.customer_name || "—"}</td>
                  <td className="p-4 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-4">{order.items.length} items</td>
                  <td className="p-4 text-primary font-bold">${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <p className="text-center text-muted-foreground py-12">No completed sales yet.</p>}
      </div>
    </motion.div>
  );
};

export default AdminSales;
