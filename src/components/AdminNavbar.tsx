import { NavLink, useNavigate } from "react-router-dom";
import { Home, TrendingUp, Package, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const adminLinks = [
  { to: "/admin", label: "Home", icon: Home },
  { to: "/admin/sales", label: "Sales", icon: TrendingUp },
  { to: "/admin/orders", label: "Orders", icon: Package },
];

const AdminNavbar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin-login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-6">
          <img src={logo} alt="Pistanero Admin" className="h-8 brightness-0 invert" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-display">Admin</span>
        </div>

        <div className="flex items-center gap-1">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
