import AdminNavBar from "@/components/navs/AdminNavBar";

const AdminLayout = ({ children }) => {
  return (
    <>
      <AdminNavBar />
      <div className="bg-gray-200 min-h-[calc(100vh-64px)] py-4">{children}</div>
    </>
  );
};

export default AdminLayout;
