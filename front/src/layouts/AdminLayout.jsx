import AdminNavBar from "@/components/navs/AdminNavBar";
import { useAuth } from "@/hooks/useAuth";

const AdminLayout = ({ children }) => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });
  return (
    <>
      <AdminNavBar />
      <div className="relative bg-gray-200 min-h-[calc(100vh-64px)] py-4">{children}</div>
    </>
  );
};

export default AdminLayout;
