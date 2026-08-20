import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// ─────────────────────────── DATA ─────────────────────────────────────────────

const FLASH_DEALS = [
  { id: 1, name: 'Sony WH-1000XM5 Headphones', cat: 'Audio', mrp: 34990, price: 20994, discount: 40, rating: 4.9, reviews: 2841, badge: 'Best Seller', badgeColor: 'bg-amber-500' },
  { id: 2, name: 'LG 27" 4K IPS Monitor', cat: 'Monitors', mrp: 42990, price: 25794, discount: 40, rating: 4.7, reviews: 1203, badge: 'Top Rated', badgeColor: 'bg-blue-500' },
  { id: 3, name: 'Logitech MX Master 3S', cat: 'Accessories', mrp: 8995, price: 5397, discount: 40, rating: 4.8, reviews: 932, badge: 'Ergonomic', badgeColor: 'bg-violet-500' },
  { id: 4, name: 'JBL Flip 6 Speaker', cat: 'Audio', mrp: 11999, price: 7199, discount: 40, rating: 4.6, reviews: 1540, badge: 'Hot Deal', badgeColor: 'bg-red-500' },
  { id: 5, name: 'Samsung T7 1TB SSD', cat: 'Storage', mrp: 9999, price: 5999, discount: 40, rating: 4.8, reviews: 876, badge: 'Fast Storage', badgeColor: 'bg-emerald-500' },
  { id: 6, name: 'Apple MacBook Air M2', cat: 'Laptops', mrp: 114900, price: 91920, discount: 20, rating: 4.9, reviews: 3241, badge: 'Best Seller', badgeColor: 'bg-amber-500' },
  { id: 7, name: 'Samsung Galaxy S24 Ultra', cat: 'Smartphones', mrp: 129999, price: 99999, discount: 23, rating: 4.8, reviews: 2104, badge: 'Top Rated', badgeColor: 'bg-blue-500' },
  { id: 8, name: 'ASUS ROG Zephyrus G14', cat: 'Gaming', mrp: 149999, price: 119999, discount: 20, rating: 4.7, reviews: 892, badge: 'Gaming Pick', badgeColor: 'bg-red-500' },
  { id: 9, name: 'iPad Pro 12.9" M2', cat: 'Tablets', mrp: 112900, price: 89900, discount: 20, rating: 4.8, reviews: 1567, badge: "Editor's Choice", badgeColor: 'bg-purple-500' },
  { id: 10, name: 'Dell XPS 15 OLED', cat: 'Laptops', mrp: 189999, price: 151999, discount: 20, rating: 4.7, reviews: 724, badge: 'Premium', badgeColor: 'bg-slate-600' },
  { id: 11, name: 'Sony A7 IV Camera', cat: 'Cameras', mrp: 249999, price: 199999, discount: 20, rating: 4.9, reviews: 431, badge: 'Pro Choice', badgeColor: 'bg-orange-500' },
  { id: 12, name: 'Dyson V15 Detect', cat: 'Home', mrp: 64900, price: 51920, discount: 20, rating: 4.6, reviews: 2109, badge: 'Popular', badgeColor: 'bg-teal-500' },
  { id: 13, name: 'Keychron Q1 Pro Keyboard', cat: 'Accessories', mrp: 16999, price: 13599, discount: 20, rating: 4.8, reviews: 643, badge: 'Trending', badgeColor: 'bg-pink-500' },
  { id: 14, name: 'Bose QuietComfort Ultra', cat: 'Audio', mrp: 34990, price: 32191, discount: 8, rating: 4.7, reviews: 987, badge: 'Premium', badgeColor: 'bg-slate-600' },
  { id: 15, name: 'Corsair iCUE H170i Elite', cat: 'PC Components', mrp: 22999, price: 20239, discount: 12, rating: 4.6, reviews: 321, badge: 'Cooling', badgeColor: 'bg-cyan-500' },
  { id: 16, name: 'Samsung Neo QLED 8K 75"', cat: 'TVs', mrp: 549999, price: 467499, discount: 15, rating: 4.8, reviews: 198, badge: 'Premium TV', badgeColor: 'bg-amber-500' },
  { id: 17, name: 'TP-Link Deco Mesh WiFi 6', cat: 'Networking', mrp: 24999, price: 17499, discount: 30, rating: 4.5, reviews: 1430, badge: 'Whole Home', badgeColor: 'bg-teal-500' },
  { id: 18, name: 'Google Nest Hub Max', cat: 'Smart Home', mrp: 22999, price: 18399, discount: 20, rating: 4.4, reviews: 876, badge: 'Smart Display', badgeColor: 'bg-green-500' },
  { id: 19, name: 'OnePlus 12 5G', cat: 'Smartphones', mrp: 69999, price: 59999, discount: 14, rating: 4.6, reviews: 1876, badge: 'Flagship', badgeColor: 'bg-red-500' },
  { id: 20, name: 'Apple AirPods Pro 2', cat: 'Audio', mrp: 24900, price: 22410, discount: 10, rating: 4.8, reviews: 3456, badge: 'Best Seller', badgeColor: 'bg-amber-500' },
  { id: 21, name: 'Lenovo Legion Pro 7i', cat: 'Laptops', mrp: 219999, price: 175999, discount: 20, rating: 4.7, reviews: 543, badge: 'Gaming Laptop', badgeColor: 'bg-red-500' },
  { id: 22, name: 'Xiaomi 14 Ultra 5G', cat: 'Smartphones', mrp: 99999, price: 89999, discount: 10, rating: 4.8, reviews: 1102, badge: 'New', badgeColor: 'bg-blue-500' },
  { id: 23, name: 'Philips Hue Starter Kit', cat: 'Smart Home', mrp: 14999, price: 11999, discount: 20, rating: 4.5, reviews: 2100, badge: 'Smart Lighting', badgeColor: 'bg-amber-500' },
  { id: 24, name: 'ASUS ROG Flow Z13', cat: 'Gaming', mrp: 149999, price: 129999, discount: 13, rating: 4.7, reviews: 456, badge: 'Gaming', badgeColor: 'bg-red-500' },
];

const CATEGORIES = ['All', 'Audio', 'Monitors', 'Accessories', 'Laptops', 'Smartphones', 'Gaming', 'Storage', 'TVs', 'Networking', 'Smart Home', 'PC Components', 'Cameras', 'Home', 'Tablets'];

const SORT_OPTIONS = [
  { value: 'discount', label: 'Biggest Discount' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

// ─────────────────────── HELPER COMPONENTS ───────────────────────────────────

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-400 text-xs">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'fill-current' : 'fill-gray-600 text-gray-600'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function ImgPlaceholder({ className = '', icon = '📦' }) {
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 ${className}`}>
      <span className="text-4xl opacity-25">{icon}</span>
    </div>
  );
}

function AddToCartBtn({ small = false }) {
  const [state, setState] = useState('idle');
  const handle = () => {
    setState('added');
    setTimeout(() => setState('idle'), 1500);
  };
  const base = `font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-1.5 ${small ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'}`;
  if (state === 'added') return <button className={`${base} bg-emerald-500 text-white scale-95`}>✓ Added!</button>;
  return (
    <button onClick={handle} className={`${base} bg-[#FB641B] hover:bg-orange-600 text-white shadow hover:shadow-md active:scale-95`}>
      <svg className={small ? 'w-3.5 h-3.5' : 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {small ? 'Add' : 'Add to Cart'}
    </button>
  );
}

// ─────────────────────── PAGE ────────────────────────────────────────────────

export default function FlashDeals() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('discount');
  const [viewMode, setViewMode] = useState('grid');

  // Countdown — 24h from page load
  const TARGET = useMemo(() => Date.now() + 24 * 3600 * 1000, []);
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET - Date.now());
      const d = String(Math.floor(diff / 86400000)).padStart(2, '0');
      const h = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTimeLeft({ d, h, m, s });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [TARGET]);

  const filteredDeals = useMemo(() => {
    let items = activeCategory === 'All'
      ? [...FLASH_DEALS]
      : FLASH_DEALS.filter(p => p.cat === activeCategory);

    switch (sortBy) {
      case 'price-low':  items.sort((a, b) => a.price - b.price); break;
      case 'price-high': items.sort((a, b) => b.price - a.price); break;
      case 'rating':     items.sort((a, b) => b.rating - a.rating); break;
      case 'popular':    items.sort((a, b) => b.reviews - a.reviews); break;
      default:           items.sort((a, b) => b.discount - a.discount);
    }
    return items;
  }, [activeCategory, sortBy]);

  const maxDiscount = Math.max(...FLASH_DEALS.map(p => p.discount));
  const minPrice = Math.min(...FLASH_DEALS.map(p => p.price));

  const TimeBox = ({ v, label }) => (
    <div className="flex flex-col items-center">
      <div className="text-xl md:text-2xl font-extrabold w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center tabular-nums shadow" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
        {v}
      </div>
      <span className="text-[9px] font-bold uppercase mt-1 tracking-widest" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-300">

      {/* ─── HERO BANNER (Dark Flash Sale Theme) ─── */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-[#FB641B]/10 pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[20%] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-[30%] left-[-40px] w-40 h-40 rounded-full bg-[#FB641B]/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white font-semibold">Flash Deals</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">⚡</span>
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    Flash <span className="text-[#FB641B]">Deals</span>
                  </h1>
                </div>
              </div>
              <p className="text-gray-400 text-base md:text-lg max-w-lg leading-relaxed mb-6">
                Prices drop every day — grab these limited-time deals before they're gone!
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <span className="bg-[#FB641B] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                  UP TO {maxDiscount}% OFF
                </span>
                <span className="bg-white/10 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full border border-white/10">
                  Starting from ₹{minPrice.toLocaleString('en-IN')}
                </span>
                <span className="bg-white/10 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full border border-white/10">
                  {FLASH_DEALS.length} Deals
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 min-w-[300px]">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">Sale Ends In</p>
              <div className="flex items-center justify-center gap-2">
                <TimeBox v={timeLeft.d} label="Days" />
                <span className="text-white font-bold text-xl mb-4">:</span>
                <TimeBox v={timeLeft.h} label="Hrs" />
                <span className="text-white font-bold text-xl mb-4">:</span>
                <TimeBox v={timeLeft.m} label="Min" />
                <span className="text-white font-bold text-xl mb-4">:</span>
                <TimeBox v={timeLeft.s} label="Sec" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FILTER BAR ─── */}
      <section className="border-b sticky top-0 z-30" style={{ background: 'var(--page-bg)', borderColor: 'var(--card-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              <p className="text-sm font-bold hidden sm:block whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                {filteredDeals.length} deals
              </p>
              <div className="flex items-center gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                      cat === activeCategory
                        ? 'bg-[#FB641B] text-white shadow'
                        : 'hover:opacity-80'
                    }`}
                    style={cat !== activeCategory ? { background: 'var(--card-bg)', color: 'var(--text-secondary)' } : {}}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {/* View mode */}
              <div className="hidden sm:flex items-center rounded-lg p-0.5" style={{ background: 'var(--card-bg)' }}>
                <button onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'shadow text-[#FB641B]' : 'hover:opacity-80'}`}
                  style={viewMode !== 'grid' ? { color: 'var(--text-secondary)' } : { background: 'var(--page-bg)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'shadow text-[#FB641B]' : 'hover:opacity-80'}`}
                  style={viewMode !== 'list' ? { color: 'var(--text-secondary)' } : { background: 'var(--page-bg)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-sm font-medium border-0 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-[#FB641B] cursor-pointer"
                style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">⚡</span>
            <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>No deals in this category</h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Check back soon — new deals drop every day!</p>
            <button onClick={() => setActiveCategory('All')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FB641B] text-white font-bold rounded-full hover:shadow-lg transition">
              View All Deals →
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDeals.map(p => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <div className="relative">
                  <ImgPlaceholder className="h-44 w-full" icon="🛒" />
                  <span className={`absolute top-2.5 left-2.5 ${p.badgeColor} text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow`}>
                    {p.badge}
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-gray-900 text-[#FB641B] text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow">
                    -{p.discount}%
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[10px] font-bold text-[#FB641B] uppercase tracking-wide mb-1">{p.cat}</p>
                  <p className="text-sm font-bold line-clamp-2 mb-2 flex-1" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Stars rating={p.rating} />
                    <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>({p.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>₹{p.mrp.toLocaleString('en-IN')}</p>
                      <p className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    <AddToCartBtn small />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredDeals.map(p => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-row" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <div className="relative flex-shrink-0 w-40 md:w-52">
                  <ImgPlaceholder className="h-full min-h-[140px] w-full" icon="🛒" />
                  <span className={`absolute top-2.5 left-2.5 ${p.badgeColor} text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow`}>
                    {p.badge}
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-gray-900 text-[#FB641B] text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow">
                    -{p.discount}%
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#FB641B] uppercase tracking-wide mb-1">{p.cat}</p>
                    <p className="text-sm md:text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Stars rating={p.rating} />
                      <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>({p.reviews.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>₹{p.price.toLocaleString('en-IN')}</p>
                      {p.discount > 0 && (
                        <>
                          <p className="text-sm line-through" style={{ color: 'var(--text-secondary)' }}>₹{p.mrp.toLocaleString('en-IN')}</p>
                          <span className="text-xs font-bold text-[#FB641B] px-2 py-0.5 rounded-full" style={{ background: 'var(--card-bg)' }}>
                            {p.discount}% off
                          </span>
                        </>
                      )}
                    </div>
                    <AddToCartBtn />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── BOTTOM CTA BANNER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 md:p-10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 min-h-[200px]">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-[#FB641B]/10 pointer-events-none" />
          <div className="absolute bottom-[-30px] left-[20%] w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 flex-1">
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">⚡ Don't Miss Out</span>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2">New Deals Drop Every Day</h3>
            <p className="text-gray-400 text-sm mb-5 max-w-md">
              Check back daily for fresh flash deals. Subscribe to get notified when new deals go live!
            </p>
            <Link to="/shop"
              className="inline-flex items-center gap-2 bg-[#FB641B] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-orange-600 hover:shadow-lg transition">
              Browse All Products →
            </Link>
          </div>

          <div className="flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
            <span className="text-4xl block mb-2">🔥</span>
            <p className="text-3xl font-extrabold text-[#FB641B]">{FLASH_DEALS.length}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Deals</p>
          </div>
        </div>
      </section>

    </div>
  );
}
