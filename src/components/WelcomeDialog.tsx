import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShoppingBag, ClipboardList } from "lucide-react";

const WELCOME_KEY = "pistanero_welcomed";

const WelcomeDialog = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && !localStorage.getItem(WELCOME_KEY)) {
      // Small delay so the page loads first
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, [user]);

  const handleClose = () => {
    localStorage.setItem(WELCOME_KEY, "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Welcome to <span className="text-primary">Pistanero</span>! 🎉
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Your account is all set. Here's what you can do now:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold">Order Products</p>
              <p className="text-xs text-muted-foreground">
                Add items to your cart and place orders with Mobile Money payment.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold">Track Your Orders</p>
              <p className="text-xs text-muted-foreground">
                Check order status anytime via the <strong>Orders</strong> tab in your account menu.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="w-full mt-6 py-3 bg-primary text-primary-foreground font-display text-sm uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all"
        >
          Start Shopping
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
