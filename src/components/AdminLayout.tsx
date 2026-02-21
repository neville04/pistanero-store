import { Outlet } from "react-router-dom";
import AdminNavbar from "@/components/AdminNavbar";

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen pt-20 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
