import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  user_id: string;
  items: OrderItem[];
  transaction_id: string | null;
  delivery_method: string;
  customer_name: string | null;
  customer_email: string | null;
  phone: string | null;
}

const statuses = ["pending", "processing", "delivered"];

const statusBadge: Record<string, { color: string; label: string }> = {
  pending: { color: "bg-yellow-400/20 text-yellow-400", label: "Pending" },
  processing: { color: "bg-blue-400/20 text-blue-400", label: "Processing" },
  delivered: { color: "bg-green-400/20 text-green-400", label: "Delivered" },
};

const AdminOrders = () => {
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
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setOrders(data.map((o: any) => ({ ...o, items: o.items as OrderItem[] })));
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const order = orders.find((o) => o.id === orderId);
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) { toast.error("Failed to update"); return; }

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

    if (order?.customer_email) {
      try {
        await supabase.functions.invoke("send-order-email", {
          body: {
            email: order.customer_email,
            name: order.customer_name || "Customer",
            orderId: orderId.slice(0, 8),
            status: newStatus,
            total: order.total,
          },
        });
      } catch { /* best-effort */ }
    }

    toast.success(`Order status updated to ${newStatus}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold mb-8">
        Order <span className="text-primary">Management</span>
      </h1>

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
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">TxID</th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Delivery</th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const badge = statusBadge[order.status] || statusBadge.pending;
                return (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="p-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                    <td className="p-4">
                      <p className="text-sm font-medium">{order.customer_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_email || ""}</p>
                      {order.phone && <p className="text-xs text-muted-foreground">{order.phone}</p>}
                    </td>
                    <td className="p-4 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-4">{order.items.length} items</td>
                    <td className="p-4 text-primary font-bold">${order.total.toFixed(2)}</td>
                    <td className="p-4 font-mono text-xs">{order.transaction_id || "—"}</td>
                    <td className="p-4 capitalize text-xs">{order.delivery_method}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 border-0 font-medium ${badge.color}`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s} className="bg-background text-foreground">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <p className="text-center text-muted-foreground py-12">No orders yet.</p>}
      </div>
    </motion.div>
  );
};

export default AdminOrders;
