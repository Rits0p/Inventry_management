import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function Sidebar({ role, isOpen, onClose }) {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard',        icon: '📊' },
    { to: '/admin/products',  label: 'Products',         icon: '📦' },
    { to: '/admin/categories',label: 'Categories',       icon: '🗂️'  },
    { to: '/admin/stock',     label: 'Stock / Inventory',icon: '📉' },
    { to: '/admin/orders',    label: 'Orders',           icon: '🛒' },
    { to: '/admin/users',     label: 'Users',            icon: '👥' },
  ];

  const customerLinks = [
    { to: '/',          label: 'Shop',         icon: '🛍️' },
    { to: '/dashboard', label: 'My Dashboard', icon: '📊' },
    { to: '/orders',    label: 'My Orders',    icon: '📦' },
    { to: '/cart',      label: 'Cart',         icon: '🛒' },
    { to: '/profile',   label: 'Profile',      icon: '👤' },
  ];

  const links = role === 'Admin' ? adminLinks : customerLinks;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[var(--card-bg)] backdrop-blur-xl border-r border-[var(--card-border)]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-[var(--card-border)]">
          <span className="font-bold text-lg text-[#2874F0]">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info strip (visible inside sidebar) */}
        {user && (
          <div className="px-4 py-3 border-b border-[var(--card-border)] bg-[rgba(128,128,128,0.06)] lg:block">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#2874F0] text-white flex items-center justify-center font-bold flex-shrink-0">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.fullName}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-0.5 px-3">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#2874F0]/10 text-[#2874F0] font-semibold'
                        : 'text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-white/5'
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

        {/* Bottom: Logout */}
        <div className="p-3 border-t border-[var(--card-border)] space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          >
            🚪 Logout
          </button>
          <p className="text-xs text-[var(--text-secondary)] text-center pb-1">InventoryPro v1.0</p>
        </div>
      </aside>
    </>
  );
}
