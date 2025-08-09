import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';
import CustomerSidebar from './CustomerSidebar';

const CustomerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <CustomerSidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <CustomerHeader toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;