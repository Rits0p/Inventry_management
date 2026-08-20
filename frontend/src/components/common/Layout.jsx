import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ role = 'Customer' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Remove constraints for home page and category pages so sections can go full width
  const isHome = location.pathname === '/';
  const isCategoryPage = /^\/categories/.test(location.pathname);
  const isFlashDeals = location.pathname === '/flash-deals';
  const isTopSelling = location.pathname === '/top-selling';
  const isNewArrivals = location.pathname === '/new-arrivals';
  const fullWidth = isHome || isCategoryPage || isFlashDeals || isTopSelling || isNewArrivals;

  return (
    <div className="min-h-screen bg-[var(--page-bg)] flex flex-col transition-colors duration-300">
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
        <main className={`flex-1 overflow-y-auto flex flex-col ${fullWidth ? '' : 'p-4 md:p-6 lg:p-8'}`}>
          <div className={fullWidth ? 'flex-1' : 'w-full max-w-7xl mx-auto flex-1'}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
