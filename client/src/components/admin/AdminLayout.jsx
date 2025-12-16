import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="lg:flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;