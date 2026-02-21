import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Loader2, Package, DollarSign, Clock, Truck, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }

    const checkAdmin = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!data) { toast.error("Access denied"); navigate("/"); return; }

      setIsAdmin(true);

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersData) {
        setOrders(ordersData.map((o: any) => ({ ...o, items: o.items as OrderItem[] })));
      }
      setLoading(false);
    };

    checkAdmin();
  }, [user, navigate]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const order = orders.find((o) => o.id === orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) { toast.error("Failed to update"); return; }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    // Trigger email notification
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
      } catch {
        // Email sending is best-effort
      }
    }

    toast.success(`Order status updated to ${newStatus}`);
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const processingOrders = orders.filter((o) => o.status === "processing").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="min-h-screen pt-28 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="font-display text-4xl font-bold">
            Admin <span className="text-primary">Dashboard</span>
          </h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="glass-card p-5 text-center">
            <Package className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{totalOrders}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Orders</p>
          </div>
          <div className="glass-card p-5 text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Sales</p>
          </div>
          <div className="glass-card p-5 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold">{pendingOrders}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
          </div>
          <div className="glass-card p-5 text-center">
            <Truck className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold">{processingOrders}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Processing</p>
          </div>
          <div className="glass-card p-5 text-center">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold">{deliveredOrders}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Delivered</p>
          </div>
        </div>

        {/* Orders Table */}
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
                      <td className="p-4 text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
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
          {orders.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
