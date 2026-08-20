import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// ─────────────────────────── DATA ─────────────────────────────────────────────

const TOP_PRODUCTS = [
  { id: 1, name: 'Apple MacBook Air M2', cat: 'Laptops', brand: 'Apple', mrp: 114900, price: 91920, discount: 20, rating: 4.9, reviews: 3241, badge: 'Best Seller', badgeColor: 'bg-amber-500' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', cat: 'Smartphones', brand: 'Samsung', mrp: 129999, price: 99999, discount: 23, rating: 4.8, reviews: 2104, badge: 'Top Rated', badgeColor: 'bg-blue-500' },
  { id: 3, name: 'ASUS ROG Zephyrus G14', cat: 'Gaming', brand: 'ASUS', mrp: 149999, price: 119999, discount: 20, rating: 4.7, reviews: 892, badge: 'Gaming Pick', badgeColor: 'bg-red-500' },
  { id: 4, name: 'iPad Pro 12.9" M2', cat: 'Tablets', brand: 'Apple', mrp: 112900, price: 89900, discount: 20, rating: 4.8, reviews: 1567, badge: "Editor's Choice", badgeColor: 'bg-purple-500' },
  { id: 5, name: 'Dell XPS 15 OLED', cat: 'Laptops', brand: 'Dell', mrp: 189999, price: 151999, discount: 20, rating: 4.7, reviews: 724, badge: 'Premium', badgeColor: 'bg-slate-600' },
  { id: 6, name: 'Sony A7 IV Camera', cat: 'Cameras', brand: 'Sony', mrp: 249999, price: 199999, discount: 20, rating: 4.9, reviews: 431, badge: 'Pro Choice', badgeColor: 'bg-orange-500' },
  { id: 7, name: 'Dyson V15 Detect', cat: 'Home', brand: 'Dyson', mrp: 64900, price: 51920, discount: 20, rating: 4.6, reviews: 2109, badge: 'Popular', badgeColor: 'bg-teal-500' },
  { id: 8, name: 'Keychron Q1 Pro Keyboard', cat: 'Accessories', brand: 'Keychron', mrp: 16999, price: 13599, discount: 20, rating: 4.8, reviews: 643, badge: 'Trending', badgeColor: 'bg-pink-500' },
  { id: 9, name: 'Sony WH-1000XM5 Headphones', cat: 'Audio', brand: 'Sony', mrp: 34990, price: 20994, discount: 40, rating: 4.9, reviews: 2841, badge: 'Best Seller', badgeColor: 'bg-amber-500' },
  { id: 10, name: 'LG 27" 4K IPS Monitor', cat: 'Monitors', brand: 'LG', mrp: 42990, price: 25794, discount: 40, rating: 4.7, reviews: 1203, badge: 'Value Pick', badgeColor: 'bg-blue-500' },
  { id: 11, name: 'Logitech MX Master 3S', cat: 'Accessories', brand: 'Logitech', mrp: 8995, price: 5397, discount: 40, rating: 4.8, reviews: 932, badge: 'Ergonomic', badgeColor: 'bg-violet-500' },
  { id: 12, name: 'JBL Flip 6 Speaker', cat: 'Audio', brand: 'JBL', mrp: 11999, price: 7199, discount: 40, rating: 4.6, reviews: 1540, badge: 'Hot Deal', badgeColor: 'bg-red-500' },
  { id: 13, name: 'Samsung T7 1TB SSD', cat: 'Storage', brand: 'Samsung', mrp: 9999, price: 5999, discount: 40, rating: 4.8, reviews: 876, badge: 'Fast Storage', badgeColor: 'bg-emerald-500' },
  { id: 14, name: 'Bose QuietComfort Ultra', cat: 'Audio', brand: 'Bose', mrp: 34990, price: 32191, discount: 8, rating: 4.7, reviews: 987, badge: 'Premium', badgeColor: 'bg-slate-600' },
  { id: 15, name: 'OnePlus 12 5G', cat: 'Smartphones', brand: 'OnePlus', mrp: 69999, price: 59999, discount: 14, rating: 4.6, reviews: 1876, badge: 'Flagship', badgeColor: 'bg-red-500' },
  { id: 16, name: 'Lenovo Legion Pro 7i', cat: 'Laptops', brand: 'Lenovo', mrp: 219999, price: 175999, discount: 20, rating: 4.7, reviews: 543, badge: 'Gaming Laptop', badgeColor: 'bg-red-500' },
];

const CATEGORIES = ['All', 'Laptops', 'Smartphones', 'Audio', 'Gaming', 'Accessories', 'Monitors', 'Tablets', 'Cameras', 'Storage', 'Home'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
];

// ─────────────────────── HELPER COMPONENTS ───────────────────────────────────

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-400 text-xs">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'fill-current' : 'fill-gray-200 text-gray-200'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function ImgPlaceholder({ className = '', icon = '📦' }) {
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 ${className}`}>
      <span className="text-4xl opacity-25">{icon}</span>
    </div>
  );
}

function AddToCartBtn({ small = false }) {
  const [state, setState] = useState('idle');
  const handle = (e) => { e.preventDefault(); e.stopPropagation(); setState('added'); setTimeout(() => setState('idle'), 1500); };
  const base = `font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-1.5 ${small ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'}`;
  if (state === 'added') return <button className={`${base} bg-emerald-500 text-white scale-95`}>✓ Added!</button>;
  return (
    <button onClick={handle} className={`${base} bg-[#FB641B] hover:bg-orange-600 text-white shadow hover:shadow-md active:scale-95`}>
      <svg className={small ? 'w-3.5 h-3.5' : 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {small ? 'Add' : 'Add to Cart'}
    </button>
  );
}

// ─────────────────────── PAGE ────────────────────────────────────────────────

export default function TopSelling() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  const products = useMemo(() => {
    let items = activeCategory === 'All' ? [...TOP_PRODUCTS] : TOP_PRODUCTS.filter(p => p.cat === activeCategory);
    switch (sortBy) {
      case 'rating':     items.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
      case 'price-low':  items.sort((a, b) => a.price - b.price); break;
      case 'price-high': items.sort((a, b) => b.price - a.price); break;
      case 'discount':   items.sort((a, b) => b.discount - a.discount); break;
      default:           items.sort((a, b) => b.reviews - a.reviews);
    }
    return items;
  }, [activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-300">

      {/* ─── HERO ─── */}
      <section className="relative bg-gradient-to-r from-[#1a0533] via-[#3b1070] to-[#7c3aed] text-white overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[20%] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white font-semibold">Top Selling</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1">
              <span className="inline-block text-xs font-bold bg-white/15 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-5">
                🔥 Best Sellers
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3">
                Top Selling <span className="text-[#FB641B]">Products</span>
              </h1>
              <p className="text-white/70 text-base md:text-lg max-w-lg leading-relaxed">
                Discover what everyone's buying. Our most popular products ranked by sales and customer love.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🏆', value: `${TOP_PRODUCTS.length}+`, label: 'Top Products' },
                { icon: '⭐', value: '4.8', label: 'Avg Rating' },
                { icon: '📦', value: '20K+', label: 'Sold' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-center">
                  <span className="text-2xl block mb-1">{s.icon}</span>
                  <p className="text-lg font-extrabold text-white">{s.value}</p>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FILTERS ─── */}
      <section className="bg-white dark:bg-[#14141e] border-b border-gray-100 dark:border-white/10 sticky top-0 z-30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              <p className="text-sm font-bold text-gray-900 dark:text-white hidden sm:block whitespace-nowrap">{products.length} products</p>
              <div className="flex items-center gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                      cat === activeCategory ? 'bg-[#2874F0] text-white shadow' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/15'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="hidden sm:flex items-center bg-gray-100 dark:bg-white/10 rounded-lg p-0.5">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white dark:bg-white/15 shadow text-[#2874F0]' : 'text-gray-400 dark:text-gray-500'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-white/15 shadow text-[#2874F0]' : 'text-gray-400 dark:text-gray-500'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 border-0 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-[#2874F0] cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🏆</span>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">No products in this category</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Try selecting a different category.</p>
            <button onClick={() => setActiveCategory('All')} className="inline-flex items-center gap-2 px-6 py-3 bg-[#2874F0] text-white font-bold rounded-full hover:shadow-lg transition">View All Products →</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group bg-white dark:bg-[#1a1a24] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="relative">
                  <ImgPlaceholder className="h-44 w-full" icon="📦" />
                  <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    #{i + 1} RANK
                  </span>
                  {p.discount > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-[#FB641B] text-white text-[10px] font-extrabold px-2 py-1 rounded-full">-{p.discount}%</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[10px] font-bold text-[#2874F0] uppercase tracking-wide mb-1">{p.brand}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 flex-1">{p.name}</p>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Stars rating={p.rating} />
                    <span className="text-[10px] text-gray-400">({p.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-400 line-through">₹{p.mrp.toLocaleString('en-IN')}</p>
                      <p className="text-base font-extrabold text-gray-900 dark:text-white">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    <AddToCartBtn small />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map((p, i) => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group bg-white dark:bg-[#1a1a24] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-row">
                <div className="relative flex-shrink-0 w-40 md:w-52">
                  <ImgPlaceholder className="h-full min-h-[140px] w-full" icon="📦" />
                  <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    #{i + 1}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#2874F0] uppercase tracking-wide mb-1">{p.brand}</p>
                    <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2">{p.name}</p>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Stars rating={p.rating} />
                      <span className="text-[10px] text-gray-400">({p.reviews.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-extrabold text-gray-900 dark:text-white">₹{p.price.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-gray-400 line-through">₹{p.mrp.toLocaleString('en-IN')}</p>
                      {p.discount > 0 && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{p.discount}% off</span>}
                    </div>
                    <AddToCartBtn />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1a0533] via-[#3b1070] to-[#7c3aed] text-white p-8 md:p-10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 min-h-[180px]">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex-1">
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🏆 Ranked by Sales</span>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2">Updated Daily</h3>
            <p className="text-white/70 text-sm mb-5 max-w-md">Our rankings update every day based on sales, reviews, and customer satisfaction.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-full hover:shadow-lg transition">Browse All Products →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
