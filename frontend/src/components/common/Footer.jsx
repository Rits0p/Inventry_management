import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Send, ChevronRight, Package } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home Page', to: '/' },
  { label: 'Product Catalogue', to: '/shop' },
  { label: 'Shopping Cart', to: '/cart' },
];

const CATEGORIES = [
  { name: 'Electronics & Computers', slug: 'electronics' },
  { name: 'Networking & Storage', slug: 'networking' },
  { name: 'Office Supplies', slug: 'office' },
  { name: 'Peripherals & Accessories', slug: 'accessories' },
  { name: 'Smart Home & Gadgets', slug: 'smart-home' },
];

const ACCOUNT_LINKS = [
  { label: 'Sign In', to: '/login' },
  { label: 'Create Account', to: '/register' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#151515] text-gray-400" role="contentinfo">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 pb-10">
        {/* ── 4-Column Grid ── */}
        <div className="footer-grid grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-12">

          {/* ── Column 1: Brand + Subscribe + Contact ── */}
          <div className="flex flex-col gap-6">
            <div>
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FB641B] to-[#e55a1a] flex items-center justify-center shadow-lg shadow-[#FB641B]/20">
                  <Package className="w-5 h-5 text-white" strokeWidth={2.2} />
                </div>
                <div className="leading-none">
                  <span className="font-bold text-white tracking-tight text-xl font-[var(--font-display)]">
                    RPD<span className="text-[#FB641B]">.</span>
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mt-0.5">
                    Store
                  </span>
                </div>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-gray-500 max-w-[260px]">
                RPD Store is an inventory management and retail storefront system with
                instant transactional ordering and stock tracking.
              </p>
            </div>

            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FB641B]" />
                Subscribe for Deals
              </h4>
              <form onSubmit={handleSubscribe} className="flex items-center gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  aria-label="Email address for newsletter"
                  className="flex-1 min-w-0 bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#FB641B]/60 transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="w-10 h-10 flex-shrink-0 rounded-full bg-[#FB641B] hover:bg-[#e55a1a] text-white transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#FB641B] flex-shrink-0" />
                Tech Hub, India
              </a>
              <a
                href="mailto:support@rpdstore.com"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-[#FB641B] flex-shrink-0" />
                support@rpdstore.com
              </a>
            </div>
          </div>

          {/* ── Column 2: Navigation ── */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-5">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Live Categories ── */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-5">
              Live Categories
            </h4>
            <ul className="flex flex-col gap-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-200 inline-flex items-center justify-between w-full group/cat"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-4 h-4 text-[#FB641B] opacity-40 group-hover/cat:opacity-100 group-hover/cat:translate-x-1 transition-all duration-200 flex-shrink-0 ml-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Account Access ── */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-5">
              Account Access
            </h4>
            <ul className="flex flex-col gap-3">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
