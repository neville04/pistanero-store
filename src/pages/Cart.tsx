import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total: totalPrice,
        status: "pending",
      });

      if (error) throw error;

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 px-4 flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground" />
        <h2 className="font-display text-2xl font-bold">Your cart is empty</h2>
        <Link
          to="/products"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-display text-sm uppercase tracking-widest"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-4 pb-16">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-bold mb-8"
        >
          Your <span className="text-primary">Cart</span>
        </motion.h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="glass-card p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-lg flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-semibold truncate">{item.name}</h3>
                <p className="text-primary font-bold">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 rounded-full bg-secondary hover:bg-secondary/80"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-full bg-secondary hover:bg-secondary/80"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between mb-4">
            <span className="text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-bold text-primary">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full py-3 bg-primary text-primary-foreground font-display text-sm uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all hover-glow"
          >
            {user ? "Place Order" : "Sign In to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
