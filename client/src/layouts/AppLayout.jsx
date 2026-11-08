import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import TopNav from '../components/layout/TopNav.jsx';
import MobileBottomNav from '../components/layout/MobileBottomNav.jsx';
import MobileDrawer from '../components/layout/MobileDrawer.jsx';

const AppLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-white">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Top Header (hidden on desktop) */}
        <TopNav />
        
        {/* Scrollable Main Content */}
        {/* Add bottom padding on mobile to account for the MobileBottomNav */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 relative scroll-smooth">
          <Outlet />
        </main>
        
        {/* Mobile Bottom Navigation (hidden on desktop) */}
        <MobileBottomNav onOpenMenu={() => setDrawerOpen(true)} />
      </div>

      {/* Mobile Drawer Overlay */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

export default AppLayout;
