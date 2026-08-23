import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Home, Grid3X3, ShoppingCart, Sun, Moon, LogIn, UserPlus, Menu, X,
  Search, ChevronDown, LayoutDashboard, Package, User, LogOut
} from 'lucide-react';

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const { cartCount } = useCart();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileMenuOpen(false);
  }

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const displayName = user?.fullName || (role === 'Admin' ? 'Admin User' : 'Guest');
  const displayEmail = user?.email || '';
  const isAdmin = role === 'Admin';
  const isDark = theme === 'dark';

  const navLinks = [
    { to: isAdmin ? '/admin/dashboard' : '/', label: 'Home', icon: Home },
    ...(!isAdmin ? [{ to: '/shop', label: 'Catalogue', icon: Grid3X3 }] : []),
  ];

  return (
    <>
      <header className="bg-white dark:bg-[#111118] border-b border-gray-200 dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* ── LEFT: Logo ── */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-600 dark:text-gray-300"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link
                to={isAdmin ? '/admin/dashboard' : '/'}
                className="flex items-center gap-2.5 flex-shrink-0"
              >
                {/* Logo icon */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF4444] flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="font-extrabold text-[16px] text-white tracking-tight">
                    RPD<span className="text-[#FF6B35]">.</span>
                  </span>
                  <span className="text-[9px] font-bold text-[#FF6B35] tracking-[0.2em] uppercase">
                    {isAdmin ? 'Admin' : 'Store'}
                  </span>
                </div>
              </Link>
            </div>

            {/* ── CENTER: Nav Links (Desktop) ── */}
            <nav className="hidden md:flex items-center gap-1 mx-4">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${active
                        ? 'bg-orange-50 dark:bg-white/10 text-[#FF6B35] border border-orange-100 dark:border-white/10'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}

              {isAdmin && (
                <span className="ml-2 px-3 py-1.5 bg-amber-500/15 text-amber-400 text-xs font-bold rounded-full tracking-widest uppercase border border-amber-500/20">
                  Admin Panel
                </span>
              )}
            </nav>

            {/* ── Search Bar (always visible) ── */}
            {!isAdmin && (
              <form onSubmit={handleSearch} className="flex items-center w-64 ml-auto mr-4">
                <div className="flex items-center w-full border border-gray-200 dark:border-white/10 rounded-full bg-gray-100 dark:bg-white/5 focus-within:border-[#FF6B35]/50 focus-within:bg-gray-50 dark:focus-within:bg-white/[0.07] transition-all duration-200">
                  <span className="pl-3 text-gray-400 dark:text-gray-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 px-2 py-2 text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </form>
            )}

            {/* ── RIGHT: Theme, Cart, Auth ── */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

              {/* Theme toggle pill */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-sm font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-white/15"
              >
                {isDark ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden sm:inline text-blue-400 text-xs font-semibold">Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline text-amber-400 text-xs font-semibold">Light</span>
                  </>
                )}
              </button>

              {/* Cart */}
              {!isAdmin && (
                <Link
                  to="/cart"
                  className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs font-medium text-gray-600 dark:text-gray-300">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FF4444] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-lg shadow-red-500/30">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth section */}
              {!user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition px-2 py-1.5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 bg-[#FF4444] hover:bg-[#E63939] text-white rounded-full transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                /* User dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF4444] flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-orange-500/20">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[90px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1a24] rounded-2xl shadow-2xl z-50 border border-gray-200 dark:border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{displayEmail}</p>
                      </div>
                      <div className="py-1">
                        {!isAdmin && (
                          <>
                            <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition">
                              <LayoutDashboard className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              My Dashboard
                            </Link>
                            <Link to="/orders" onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition">
                              <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              My Orders
                            </Link>
                            <Link to="/profile" onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition">
                              <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              Profile
                            </Link>
                          </>
                        )}
                        {isAdmin && (
                          <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition">
                            <LayoutDashboard className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            Dashboard
                          </Link>
                        )}
                        <hr className="my-1 border-gray-100 dark:border-white/10" />
                        <button onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FF6B35]/40 dark:via-[#FF6B35]/40 to-transparent" />
      </header>

      {/* ── Mobile slide-out menu ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#111118] border-r border-gray-200 dark:border-white/10 shadow-2xl flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/10">
              <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF4444] flex items-center justify-center shadow">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-extrabold text-[15px] text-gray-900 dark:text-white">RPD<span className="text-[#FF6B35]">.</span></span>
                  <span className="text-[8px] font-bold text-[#FF6B35] tracking-[0.2em] uppercase">Store</span>
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-500 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            {!isAdmin && (
              <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="px-4 py-3">
                <div className="flex border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 pl-4 pr-2 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                  />
                  <button type="submit" className="px-3 py-2.5 text-[#FF6B35]">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Nav links */}
            <nav className="flex-1 px-3 py-2 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${active
                        ? 'bg-orange-50 dark:bg-white/10 text-[#FF6B35]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {label}
                  </Link>
                );
              })}

              {!isAdmin && (
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto bg-[#FF4444] text-white text-[10px] font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
            </nav>

            {/* Bottom auth */}
            <div className="px-3 py-4 border-t border-gray-200 dark:border-white/10 space-y-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#FF4444] hover:bg-[#E63939] text-white transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
