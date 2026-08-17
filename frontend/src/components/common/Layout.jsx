import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ role = 'Customer' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Remove constraints for home page so sections can go full width
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
      {/* Navbar */}
      <Navbar
        role={role}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          role={role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto flex flex-col ${isHome ? '' : 'p-4 md:p-6 lg:p-8'}`}>
          <div className={isHome ? 'flex-1' : 'w-full max-w-7xl mx-auto flex-1'}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
