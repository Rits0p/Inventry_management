import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ role, onMenuClick }) {
  const navigate = useNavigate();

  // Temporary – replace with real auth context later
  const user = {
    name: role === 'Admin' ? 'Admin User' : 'John Doe',
    email: role === 'Admin' ? 'admin@inventory.com' : 'john@example.com',
  };

  const handleLogout = () => {
    // TODO: clear token + redirect
    navigate('/login');
  };

  return (
    <header className="bg-[#2874F0] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-blue-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link to={role === 'Admin' ? '/admin/dashboard' : '/'} className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              <span className="font-bold text-xl tracking-tight hidden sm:block">
                Inventory<span className="text-yellow-300">Pro</span>
              </span>
            </Link>
          </div>

          {/* Center: Search (optional – show only for Customer) */}
          {role === 'Customer' && (
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full py-2.5 pl-4 pr-12 rounded-sm text-gray-800 text-sm focus:outline-none"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-[#FB641B] hover:bg-orange-600 rounded-r-sm transition">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart – only for Customer */}
            {role === 'Customer' && (
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 px-3 py-2 rounded hover:bg-blue-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:inline text-sm font-medium">Cart</span>
                {/* Badge example */}
                <span className="absolute -top-1 -right-1 bg-[#FB641B] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  2
                </span>
              </Link>
            )}

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-600 transition">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                  {user.name}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-1 w-56 bg-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  {role === 'Customer' && (
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      My Orders
                    </Link>
                  )}
                  <Link
                    to={role === 'Admin' ? '/admin/dashboard' : '/dashboard'}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
