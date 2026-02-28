import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, ChevronDown, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const navLinks = [
  {
    to: "/courts",
    label: "Courts",
    children: [
      { to: "/courts/tennis", label: "Tennis" },
      { to: "/courts/basketball", label: "Basketball" },
      { to: "/courts/volleyball", label: "Volleyball" },
      { to: "/courts/badminton", label: "Badminton" },
    ],
  },
  {
    to: "/wellness",
    label: "Wellness & Fitness",
    children: [
      { to: "/wellness/running-club", label: "Running Club Sessions" },
      { to: "/wellness/fitness-classes", label: "Fitness Classes" },
    ],
  },
  {
    to: "/skills",
    label: "Skills Development",
    children: [
      { to: "/skills/coaches", label: "Coaches" },
      { to: "/skills/youth-tennis", label: "Tennis Youth Development" },
    ],
  },
  {
    to: "/apparel",
    label: "Apparel",
    children: [
      { to: "/men", label: "Men" },
      { to: "/women", label: "Women" },
      { to: "/bags", label: "Bags" },
      { to: "/products?category=Rackets", label: "Rackets" },
      { to: "/products?category=Balls", label: "Balls" },
      { to: "/products?category=Accessories", label: "Accessories" },
    ],
  },
  {
    to: "/membership",
    label: "Membership",
    children: [
      { to: "/membership/monthly", label: "Monthly" },
      { to: "/membership/annual", label: "Annual" },
    ],
  },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-user");
      if (error) throw error;
      await signOut();
      toast.success("Account deleted successfully");
      navigate("/");
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="z-10">
          <img src={logo} alt="Pista Nero" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex glass-nav px-6 py-3 gap-6">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.to} className="relative group">
                <button
                  className={`font-body text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                    location.pathname.startsWith(link.to) ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {link.label}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="glass-card p-2 min-w-[200px] flex flex-col gap-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 z-10">
          <Link to="/cart" className="relative p-2 rounded-full transition-colors hover:bg-secondary">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="p-2 rounded-full transition-colors hover:bg-secondary"
              >
                <User className="w-5 h-5 text-foreground" />
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 glass-card p-5 flex flex-col gap-3 z-50"
                  >
                    <p className="font-display text-sm font-semibold text-foreground truncate">
                      {user.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <hr className="border-border" />
                    <Link
                      to="/orders"
                      onClick={() => setAccountOpen(false)}
                      className="text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => { signOut(); setAccountOpen(false); }}
                      className="w-full py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => { setAccountOpen(false); setDeleteOpen(true); }}
                      className="w-full py-2 rounded-full border border-destructive/50 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Account
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
          )}

          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-4 right-4 mt-2 glass-card p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
          >
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.to}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === link.to ? null : link.to)}
                    className={`font-body text-base font-medium flex items-center gap-1 w-full ${
                      location.pathname.startsWith(link.to) ? "text-primary" : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ml-1 ${openDropdown === link.to ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.to && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 flex flex-col gap-2 mt-2"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => setMobileOpen(false)}
                            className="text-foreground/70 text-sm py-1"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body text-base font-medium ${
                    location.pathname === link.to ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone. All your data, orders, and account information will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete My Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};

export default Navbar;
