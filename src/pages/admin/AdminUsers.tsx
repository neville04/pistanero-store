import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Users, ChevronRight, ArrowLeft, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AppUser {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

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
  items: OrderItem[];
  delivery_method: string;
}

const statusBadge: Record<string, { color: string; label: string }> = {
  pending: { color: "bg-yellow-500/20 text-yellow-400", label: "Pending" },
  processing: { color: "bg-blue-500/20 text-blue-400", label: "Processing" },
  delivered: { color: "bg-green-500/20 text-green-400", label: "Delivered" },
};

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

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

      const { data, error } = await supabase.functions.invoke("list-users");
      if (!error && data) setUsers(data);
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  const selectUser = async (u: AppUser) => {
    setSelectedUser(u);
    setOrdersLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", u.id)
      .order("created_at", { ascending: false });

    if (data) {
      setOrders(
        data.map((o) => ({
          ...o,
          items: Array.isArray(o.items) ? (o.items as unknown as OrderItem[]) : [],
        }))
      );
    }
    setOrdersLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <AnimatePresence mode="wait">
        {selectedUser ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button
              onClick={() => { setSelectedUser(null); setOrders([]); }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Users
            </button>

            <div className="glass-card p-6 mb-6">
              <h2 className="font-display text-xl font-bold mb-1">
                {selectedUser.full_name || "Unnamed User"}
              </h2>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              {selectedUser.phone && (
                <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
              )}
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="font-display text-lg font-bold text-primary">{orders.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="font-display text-lg font-bold text-primary">
                    {totalSpent.toLocaleString()} UGX
                  </p>
                </div>
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const badge = statusBadge[order.status] || statusBadge.pending;
                  return (
                    <div key={order.id} className="glass-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="font-display font-bold text-primary">
                          {order.total.toLocaleString()} UGX
                        </p>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>
                              {item.name}{" "}
                              <span className="text-muted-foreground">×{item.quantity}</span>
                            </span>
                            <span>{(item.price * item.quantity).toLocaleString()} UGX</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-primary" />
              <h1 className="font-display text-2xl font-bold">
                Users <span className="text-muted-foreground font-normal text-lg">({users.length})</span>
              </h1>
            </div>

            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No users found.</p>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => selectUser(u)}
                    className="w-full glass-card p-4 flex items-center justify-between hover:border-primary/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-sm font-semibold truncate">
                          {u.full_name || "Unnamed User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        Joined {new Date(u.created_at).toLocaleDateString()}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
