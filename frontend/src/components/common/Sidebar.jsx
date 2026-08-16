import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ role, isOpen, onClose }) {
  // Different menus based on role
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/products', label: 'Products', icon: '📦' },
    { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
    { to: '/admin/stock', label: 'Stock / Inventory', icon: '📉' },
    { to: '/admin/orders', label: 'Orders', icon: '🛒' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
  ];

  const customerLinks = [
    { to: '/', label: 'Shop', icon: '🛍️' },
    { to: '/dashboard', label: 'My Dashboard', icon: '📊' },
    { to: '/orders', label: 'My Orders', icon: '📦' },
    { to: '/cart', label: 'Cart', icon: '🛒' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ];

  const links = role === 'Admin' ? adminLinks : customerLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Sidebar Header (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-gray-100">
          <span className="font-bold text-lg text-[#2874F0]">Menu</span>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#2874F0]/10 text-[#2874F0]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            InventoryPro v1.0
          </div>
        </div>
      </aside>
    </>
  );
}
