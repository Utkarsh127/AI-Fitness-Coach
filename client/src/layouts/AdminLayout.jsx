import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar.jsx';
import AdminTopNav from '../components/layout/AdminTopNav.jsx';
import AdminMobileDrawer from '../components/layout/AdminMobileDrawer.jsx';

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-white">
      {/* Desktop Sidebar (hidden on mobile) */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-surface">
        {/* Mobile Top Header (hidden on desktop) */}
        <AdminTopNav onOpenMenu={() => setDrawerOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative scroll-smooth bg-surface-border/5">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      <AdminMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

export default AdminLayout;
