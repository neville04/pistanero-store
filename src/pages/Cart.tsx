import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, Smartphone, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const PAYMENT_INFO = {
  mtn: { name: "MTN MOMO", code: "0771699039", color: "#FFCC00" },
  airtel: { name: "Airtel Money", code: "0771699039", color: "#ED1C24" },
};

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [transactionId, setTransactionId] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [submitting, setSubmitting] = useState(false);

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return;
    }
    setStep("checkout");
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    if (!transactionId.trim()) {
      toast.error("Please enter your payment transaction ID");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total: totalPrice,
        status: "pending",
        transaction_id: transactionId.trim(),
        delivery_method: deliveryMethod,
        customer_name: user.user_metadata?.full_name || "",
        customer_email: user.email || "",
        phone: user.user_metadata?.phone || "",
      });

      if (error) throw error;

      clearCart();
      setStep("cart");
      setTransactionId("");
      toast.success("Order placed! We'll verify your payment shortly.");
      navigate("/orders");
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && step === "cart") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 pt-28 px-4 flex flex-col items-center justify-center gap-4">
          <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          <h2 className="font-display text-2xl font-bold">Your cart is empty</h2>
          <Link
            to="/products"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-display text-sm uppercase tracking-widest"
          >
            Shop Now
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-28 px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold mb-8"
          >
            {step === "cart" ? (
              <>Your <span className="text-primary">Cart</span></>
            ) : (
              <>
                <span className="text-primary">Checkout</span>
              </>
            )}
          </motion.h1>

          {step === "cart" ? (
            <>
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/50 rounded-lg flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-sm font-semibold truncate">{item.name}</h3>
                        <p className="text-primary font-bold">${item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
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
                    </div>
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
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 bg-primary text-primary-foreground font-display text-sm uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all hover-glow"
                >
                  {user ? "Proceed to Checkout" : "Sign In to Checkout"}
                </button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Order Summary */}
              <div className="glass-card p-6">
                <h3 className="font-display text-lg font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-display font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="glass-card p-6">
                <h3 className="font-display text-lg font-semibold mb-3">Delivery Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      deliveryMethod === "pickup"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-display text-sm font-semibold block">Pickup</span>
                    <span className="text-xs text-muted-foreground">Collect from our store</span>
                  </button>
                  <button
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      deliveryMethod === "delivery"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-display text-sm font-semibold block">Delivery</span>
                    <span className="text-xs text-muted-foreground">We deliver to you</span>
                  </button>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="glass-card p-6">
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Payment via Mobile Money
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send <span className="text-primary font-bold">${totalPrice.toFixed(2)}</span> to one of the numbers below, then enter your transaction ID.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="p-4 rounded-lg border border-border bg-secondary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PAYMENT_INFO.mtn.color }} />
                      <span className="font-display text-sm font-semibold">{PAYMENT_INFO.mtn.name}</span>
                    </div>
                    <p className="text-lg font-bold font-mono">{PAYMENT_INFO.mtn.code}</p>
                    <p className="text-xs text-muted-foreground mt-1">Business Name: Pistanero</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-secondary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PAYMENT_INFO.airtel.color }} />
                      <span className="font-display text-sm font-semibold">{PAYMENT_INFO.airtel.name}</span>
                    </div>
                    <p className="text-lg font-bold font-mono">{PAYMENT_INFO.airtel.code}</p>
                    <p className="text-xs text-muted-foreground mt-1">Business Name: Pistanero</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. MP24XXXXXXX"
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    You'll receive this ID in your Mobile Money confirmation SMS.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStep("cart")}
                  className="flex-1 py-3 border border-border rounded-full font-display text-sm uppercase tracking-widest hover:bg-secondary transition-all"
                >
                  Back to Cart
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || !transactionId.trim()}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-display text-sm uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all hover-glow disabled:opacity-50"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
