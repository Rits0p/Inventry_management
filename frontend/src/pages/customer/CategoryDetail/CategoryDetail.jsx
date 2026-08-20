import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

// ─────────────────────────── DATA ─────────────────────────────────────────────

const CATEGORIES = [
  { id: 1, name: 'Laptops & Computers', slug: 'laptops', icon: '💻', count: 342, gradient: 'from-blue-500 to-blue-700', description: 'Powerful laptops, desktops, and workstations for every need.' },
  { id: 2, name: 'Smartphones', slug: 'phones', icon: '📱', count: 218, gradient: 'from-violet-500 to-purple-700', description: 'Latest flagship and budget smartphones from top brands.' },
  { id: 3, name: 'Audio & Headphones', slug: 'audio', icon: '🎧', count: 156, gradient: 'from-pink-500 to-rose-600', description: 'Premium headphones, earbuds, and speakers for immersive sound.' },
  { id: 4, name: 'Monitors & Displays', slug: 'monitors', icon: '🖥️', count: 89, gradient: 'from-amber-500 to-orange-600', description: 'Stunning displays for gaming, productivity, and creative work.' },
  { id: 5, name: 'Networking', slug: 'networking', icon: '🌐', count: 64, gradient: 'from-teal-500 to-cyan-700', description: 'Routers, mesh systems, and networking gear for seamless connectivity.' },
  { id: 6, name: 'Gaming', slug: 'gaming', icon: '🎮', count: 112, gradient: 'from-red-500 to-red-700', description: 'Consoles, gaming PCs, accessories, and peripherals.' },
  { id: 7, name: 'Smart Home', slug: 'smart-home', icon: '🏠', count: 78, gradient: 'from-emerald-500 to-green-700', description: 'Smart speakers, lights, cameras, and home automation devices.' },
  { id: 8, name: 'Accessories', slug: 'accessories', icon: '🖱️', count: 234, gradient: 'from-slate-500 to-gray-700', description: 'Keyboards, mice, adapters, cables, and essential peripherals.' },
];

const PRODUCTS = [
  { id: 1, name: 'Apple MacBook Air M2', cat: 'laptops', brand: 'Apple', mrp: 114900, price: 91920, discount: 20, rating: 4.9, reviews: 3241, badge: 'Best Seller', badgeColor: 'bg-amber-500' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', cat: 'phones', brand: 'Samsung', mrp: 129999, price: 99999, discount: 23, rating: 4.8, reviews: 2104, badge: 'Top Rated', badgeColor: 'bg-blue-500' },
  { id: 3, name: 'ASUS ROG Zephyrus G14', cat: 'gaming', brand: 'ASUS', mrp: 149999, price: 119999, discount: 20, rating: 4.7, reviews: 892, badge: 'Gaming Pick', badgeColor: 'bg-red-500' },
  { id: 4, name: 'iPad Pro 12.9" M2', cat: 'laptops', brand: 'Apple', mrp: 112900, price: 89900, discount: 20, rating: 4.8, reviews: 1567, badge: "Editor's Choice", badgeColor: 'bg-purple-500' },
  { id: 5, name: 'Dell XPS 15 OLED', cat: 'laptops', brand: 'Dell', mrp: 189999, price: 151999, discount: 20, rating: 4.7, reviews: 724, badge: 'Premium', badgeColor: 'bg-slate-600' },
  { id: 6, name: 'Sony WH-1000XM5 Headphones', cat: 'audio', brand: 'Sony', mrp: 34990, price: 20994, discount: 40, rating: 4.9, reviews: 2841, badge: 'Best Seller', badgeColor: 'bg-amber-500' },
  { id: 7, name: 'Sony A7 IV Camera', cat: 'accessories', brand: 'Sony', mrp: 249999, price: 199999, discount: 20, rating: 4.9, reviews: 431, badge: 'Pro Choice', badgeColor: 'bg-orange-500' },
  { id: 8, name: 'Dyson V15 Detect', cat: 'smart-home', brand: 'Dyson', mrp: 64900, price: 51920, discount: 20, rating: 4.6, reviews: 2109, badge: 'Popular', badgeColor: 'bg-teal-500' },
  { id: 9, name: 'Keychron Q1 Pro Keyboard', cat: 'accessories', brand: 'Keychron', mrp: 16999, price: 13599, discount: 20, rating: 4.8, reviews: 643, badge: 'Trending', badgeColor: 'bg-pink-500' },
  { id: 10, name: 'LG 27" 4K IPS Monitor', cat: 'monitors', brand: 'LG', mrp: 42990, price: 25794, discount: 40, rating: 4.7, reviews: 1203, badge: 'Value Pick', badgeColor: 'bg-blue-500' },
  { id: 11, name: 'JBL Flip 6 Speaker', cat: 'audio', brand: 'JBL', mrp: 11999, price: 7199, discount: 40, rating: 4.6, reviews: 1540, badge: 'Hot Deal', badgeColor: 'bg-red-500' },
  { id: 12, name: 'Samsung T7 1TB SSD', cat: 'accessories', brand: 'Samsung', mrp: 9999, price: 5999, discount: 40, rating: 4.8, reviews: 876, badge: 'Fast Storage', badgeColor: 'bg-emerald-500' },
  { id: 13, name: 'Logitech MX Master 3S', cat: 'accessories', brand: 'Logitech', mrp: 8995, price: 5397, discount: 40, rating: 4.8, reviews: 932, badge: 'Ergonomic', badgeColor: 'bg-violet-500' },
  { id: 14, name: 'Xiaomi 14 Ultra 5G', cat: 'phones', brand: 'Xiaomi', mrp: 99999, price: 89999, discount: 10, rating: 4.8, reviews: 1102, badge: 'New', badgeColor: 'bg-blue-500' },
  { id: 15, name: 'ASUS ROG Flow Z13 Gaming Tablet', cat: 'gaming', brand: 'ASUS', mrp: 149999, price: 129999, discount: 13, rating: 4.7, reviews: 456, badge: 'Gaming', badgeColor: 'bg-red-500' },
  { id: 16, name: 'Bose QuietComfort Ultra', cat: 'audio', brand: 'Bose', mrp: 34990, price: 32191, discount: 8, rating: 4.7, reviews: 987, badge: 'Premium', badgeColor: 'bg-slate-600' },
  { id: 17, name: 'Corsair iCUE H170i Elite', cat: 'gaming', brand: 'Corsair', mrp: 22999, price: 20239, discount: 12, rating: 4.6, reviews: 321, badge: 'Cooling', badgeColor: 'bg-cyan-500' },
  { id: 18, name: 'Samsung Neo QLED 8K 75"', cat: 'monitors', brand: 'Samsung', mrp: 549999, price: 467499, discount: 15, rating: 4.8, reviews: 198, badge: 'Premium TV', badgeColor: 'bg-amber-500' },
  { id: 19, name: 'TP-Link Deco Mesh WiFi 6', cat: 'networking', brand: 'TP-Link', mrp: 24999, price: 17499, discount: 30, rating: 4.5, reviews: 1430, badge: 'Whole Home', badgeColor: 'bg-teal-500' },
  { id: 20, name: 'Google Nest Hub Max', cat: 'smart-home', brand: 'Google', mrp: 22999, price: 18399, discount: 20, rating: 4.4, reviews: 876, badge: 'Smart Display', badgeColor: 'bg-green-500' },
  { id: 21, name: 'Lenovo Legion Pro 7i', cat: 'laptops', brand: 'Lenovo', mrp: 219999, price: 175999, discount: 20, rating: 4.7, reviews: 543, badge: 'Gaming Laptop', badgeColor: 'bg-red-500' },
  { id: 22, name: 'OnePlus 12 5G', cat: 'phones', brand: 'OnePlus', mrp: 69999, price: 59999, discount: 14, rating: 4.6, reviews: 1876, badge: 'Flagship', badgeColor: 'bg-red-500' },
  { id: 23, name: 'Apple AirPods Pro 2', cat: 'audio', brand: 'Apple', mrp: 24900, price: 22410, discount: 10, rating: 4.8, reviews: 3456, badge: 'Best Seller', badgeColor: 'bg-amber-500' },
  { id: 24, name: 'Philips Hue Starter Kit', cat: 'smart-home', brand: 'Philips', mrp: 14999, price: 11999, discount: 20, rating: 4.5, reviews: 2100, badge: 'Smart Lighting', badgeColor: 'bg-amber-500' },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
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

export default function CategoryDetail() {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  const category = CATEGORIES.find(c => c.slug === slug);

  const categoryProducts = useMemo(() => {
    let items = PRODUCTS.filter(p => p.cat === slug);

    switch (sortBy) {
      case 'price-low':
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items = [...items].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        items = [...items].sort((a, b) => b.id - a.id);
        break;
      case 'discount':
        items = [...items].sort((a, b) => b.discount - a.discount);
        break;
      default:
        items = [...items].sort((a, b) => b.reviews - a.reviews);
    }

    return items;
  }, [slug, sortBy]);

  const relatedCategories = CATEGORIES.filter(c => c.slug !== slug).slice(0, 4);

  if (!category) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔍</span>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Category Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">The category you're looking for doesn't exist.</p>
          <Link to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2874F0] text-white font-bold rounded-full hover:shadow-lg transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-300">

      {/* ─── CATEGORY HERO BANNER ─── */}
      <section className={`relative bg-gradient-to-r ${category.gradient} text-white overflow-hidden`}>
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[30%] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white/90 font-medium">Shop</span>
            <span>/</span>
            <span className="text-white font-semibold">{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl">{category.icon}</span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{category.name}</h1>
                  <p className="text-white/70 text-sm mt-1">{category.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <span className="bg-white/15 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
                  {categoryProducts.length} Products
                </span>
                <span className="bg-white/15 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
                  Free Shipping ₹2,000+
                </span>
              </div>
            </div>

            {/* Quick stats card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 min-w-[220px]">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Category Highlights</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Total Products</span>
                  <span className="text-sm font-bold text-white">{category.count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Starting from</span>
                  <span className="text-sm font-bold text-[#FB641B]">
                    ₹{Math.min(...categoryProducts.map(p => p.price)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Best Discount</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {Math.max(...categoryProducts.map(p => p.discount))}% OFF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FILTERS & SORT BAR ─── */}
      <section className="bg-white dark:bg-[#1a1a24] border-b border-gray-100 dark:border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold text-gray-900 dark:text-white hidden sm:block">
                {categoryProducts.length} results
              </p>
              <div className="hidden md:flex items-center gap-2">
                {CATEGORIES.slice(0, 5).map(cat => (
                  <Link key={cat.id} to={`/categories/${cat.slug}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      cat.slug === slug
                        ? 'bg-[#2874F0] text-white shadow'
                        : 'bg-gray-100 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                    }`}>
                    {cat.icon} {cat.name.split(' ')[0]}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="hidden sm:flex items-center bg-gray-100 dark:bg-white/10 rounded-lg p-0.5">
                <button onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white dark:bg-white/15 shadow text-[#2874F0]' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-white/15 shadow text-[#2874F0]' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Sort dropdown */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 border-0 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-[#2874F0] cursor-pointer">
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
        {categoryProducts.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">{category.icon}</span>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">No products found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">We're adding new products to this category soon!</p>
            <Link to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2874F0] text-white font-bold rounded-full hover:shadow-lg transition">
              Browse All Products →
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryProducts.map(p => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group bg-white dark:bg-[#1a1a24] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="relative">
                  <ImgPlaceholder className="h-44 w-full" icon={category.icon} />
                  <span className={`absolute top-2.5 left-2.5 ${p.badgeColor} text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow`}>
                    {p.badge}
                  </span>
                  {p.discount > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-[#FB641B] text-white text-[10px] font-extrabold px-2 py-1 rounded-full">
                      -{p.discount}%
                    </span>
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
            {categoryProducts.map(p => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group bg-white dark:bg-[#1a1a24] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-row">
                <div className="relative flex-shrink-0 w-40 md:w-52">
                  <ImgPlaceholder className="h-full min-h-[140px] w-full" icon={category.icon} />
                  <span className={`absolute top-2.5 left-2.5 ${p.badgeColor} text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow`}>
                    {p.badge}
                  </span>
                  {p.discount > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-[#FB641B] text-white text-[10px] font-extrabold px-2 py-1 rounded-full">
                      -{p.discount}%
                    </span>
                  )}
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
                      {p.discount > 0 && (
                        <>
                          <p className="text-sm text-gray-400 line-through">₹{p.mrp.toLocaleString('en-IN')}</p>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
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

      {/* ─── RELATED CATEGORIES ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-[#FB641B] uppercase tracking-widest mb-1">Explore More</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">Related Categories</h2>
          </div>
          <Link to="/" className="text-sm font-semibold text-[#2874F0] hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {relatedCategories.map(cat => (
            <Link key={cat.id} to={`/categories/${cat.slug}`}
              className="group bg-white dark:bg-[#1a1a24] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-5 flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-200 mb-3`}>
                {cat.icon}
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{cat.name}</p>
              <p className="text-xs text-gray-400">{cat.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── BOTTOM CTA BANNER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className={`relative rounded-3xl bg-gradient-to-r ${category.gradient} text-white p-8 overflow-hidden flex items-center justify-between gap-4 min-h-[180px]`}>
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5" />
          <div className="relative z-10">
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">Deal</span>
            <h3 className="text-xl md:text-2xl font-extrabold mb-1">Don't Miss Out on {category.name}</h3>
            <p className="text-white/70 text-sm mb-4">Browse our complete collection and find the best deals.</p>
            <Link to="/shop"
              className="inline-flex items-center gap-1 bg-white text-gray-900 font-bold text-sm px-5 py-2.5 rounded-full hover:shadow-lg transition">
              Shop All Products →
            </Link>
          </div>
          <div className="flex-shrink-0 w-28 h-28 rounded-2xl bg-white/10 flex items-center justify-center text-5xl">
            {category.icon}
          </div>
        </div>
      </section>

    </div>
  );
}
