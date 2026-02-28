import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, ChevronDown, Trash2, Settings, LogIn, LogOut } from "lucide-react";
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
    label: "Fitness",
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
    to: "#",
    label: "More",
    children: [
      { to: "/apparel", label: "Apparel" },
      { to: "/membership", label: "Membership" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="z-10 shrink-0">
          <img src={logo} alt="Pista Nero" className="h-9 w-auto" />
        </Link>

        {/* Desktop Nav — always visible, wraps on smaller screens */}
        <div className="hidden md:flex glass-nav px-4 py-2.5 gap-1 flex-wrap justify-center">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.to} className="relative group">
                <button
                  className={`font-body text-xs font-medium transition-colors hover:text-primary flex items-center gap-0.5 px-3 py-1.5 rounded-md hover:bg-secondary/40 ${
                    location.pathname.startsWith(link.to) ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {link.label}
                  <ChevronDown className="w-3 h-3 shrink-0" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="glass-card p-2 min-w-[180px] flex flex-col gap-0.5">
                    {link.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="px-3 py-2 text-xs font-medium text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
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
                className={`font-body text-xs font-medium transition-colors hover:text-primary px-3 py-1.5 rounded-md hover:bg-secondary/40 ${
                  location.pathname === link.to ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 z-10 shrink-0">
          {/* Cart */}
          <Link to="/cart" className="relative p-2 rounded-full transition-colors hover:bg-secondary">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger — opens profile/settings/auth menu */}
          <button
            className="p-2 rounded-full transition-colors hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav (small screens only) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-4 mt-2 w-72 glass-card p-4 flex flex-col gap-1 z-50"
          >
            {/* User info if logged in */}
            {user && (
              <div className="px-3 py-3 border-b border-border/40 mb-2">
                <p className="font-display text-sm font-semibold text-foreground truncate">
                  {user.user_metadata?.full_name || "Account"}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
              </div>
            )}

            {/* Mobile nav links (hidden on md+) */}
            <div className="md:hidden flex flex-col gap-1 pb-3 border-b border-border/40 mb-2">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.to}>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.to ? null : link.to)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === link.to ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.to && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-4 flex flex-col gap-0.5"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.to}
                              to={child.to}
                              onClick={() => setMobileOpen(false)}
                              className="px-3 py-2 text-xs text-foreground/70 hover:text-primary hover:bg-secondary/40 rounded-md transition-colors"
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
                    className={`px-3 py-2 text-sm font-medium hover:text-primary hover:bg-secondary/50 rounded-md transition-colors ${
                      location.pathname === link.to ? "text-primary" : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Profile & Settings */}
            {user && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
                >
                  <User className="w-4 h-4 shrink-0" />
                  My Profile & Orders
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  Settings
                </Link>
              </>
            )}

            {/* Auth actions */}
            {user ? (
              <div className="mt-1 flex flex-col gap-1 pt-2 border-t border-border/40">
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-md transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Log Out
                </button>
                <button
                  onClick={() => { setMobileOpen(false); setDeleteOpen(true); }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors w-full text-left"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="mt-1 pt-2 border-t border-border/40">
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <LogIn className="w-4 h-4 shrink-0" />
                  Log In / Sign Up
                </Link>
              </div>
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
