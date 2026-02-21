import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import AdminLayout from "@/components/AdminLayout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import SectionProducts from "./pages/SectionProducts";
import Courts from "./pages/Courts";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import AdminHome from "./pages/admin/AdminHome";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminSales from "./pages/admin/AdminSales";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import WelcomeDialog from "./components/WelcomeDialog";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <WelcomeDialog />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/men" element={<SectionProducts section="men" title="Men's Collection" subtitle="Performance gear built for the modern athlete." />} />
        <Route path="/women" element={<SectionProducts section="women" title="Women's Collection" subtitle="Stylish and functional sportswear for every game." />} />
        <Route path="/bags" element={<SectionProducts section="bags" title="Bags & Carriers" subtitle="Carry your gear in style – from court to street." />} />
        <Route path="/courts" element={<Courts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
