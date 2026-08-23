import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

// ─────────────────────────── DATA ─────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
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

export default function NewArrivals() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productService.getProducts({ ordering: '-created_at', page_size: 24 });
        if (!cancelled) setAllProducts(unwrapList(data));
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load products.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryOptions = ['All', ...new Set(allProducts.map(p => p.category_name).filter(Boolean))];

  const products = useMemo(() => {
    let items = activeCategory === 'All'
      ? [...allProducts]
      : allProducts.filter(p => p.category_name === activeCategory);
    switch (sortBy) {
      case 'price-low': items.sort((a, b) => a.price - b.price); break;
      case 'price-high': items.sort((a, b) => b.price - a.price); break;
      case 'rating': items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case 'discount': items.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0)); break;
      default: items.sort((a, b) => b.id - a.id);
    }
    return items;
  }, [allProducts, activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-300">

      {/* ─── HERO ─── */}
      <section className="relative bg-gradient-to-r from-[#0d2b1e] via-[#0f5132] to-[#198754] text-white overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[20%] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white font-semibold">New Arrivals</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1">
              <span className="inline-block text-xs font-bold bg-white/15 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-5">
                🆕 Just Landed
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3">
                New <span className="text-[#FB641B]">Arrivals</span>
              </h1>
              <p className="text-white/70 text-base md:text-lg max-w-lg leading-relaxed">
                Be the first to own the latest tech. Fresh products added daily.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🆕', value: `${products.length}+`, label: 'New Items' },
                { icon: '🏷️', value: '30%', label: 'Max Discount' },
                { icon: '⭐', value: '4.7', label: 'Avg Rating' },
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
                {categoryOptions.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${cat === activeCategory ? 'bg-[#198754] text-white shadow' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/15'
                      }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="hidden sm:flex items-center bg-gray-100 dark:bg-white/10 rounded-lg p-0.5">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white dark:bg-white/15 shadow text-[#198754]' : 'text-gray-400 dark:text-gray-500'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-white/15 shadow text-[#198754]' : 'text-gray-400 dark:text-gray-500'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 border-0 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-[#198754] cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <LoadingSpinner label="Loading new arrivals..." />
        ) : error ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Could not load new arrivals</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🆕</span>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">No new arrivals in this category</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Check back soon — new products land every week!</p>
            <button onClick={() => setActiveCategory('All')} className="inline-flex items-center gap-2 px-6 py-3 bg-[#198754] text-white font-bold rounded-full hover:shadow-lg transition">View All New →</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group bg-white dark:bg-[#1a1a24] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="relative">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="h-44 w-full object-cover" />
                  ) : (
                    <ImgPlaceholder className="h-44 w-full" icon="✨" />
                  )}
                  <span className="absolute top-2.5 left-2.5 bg-[#2874F0] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">NEW</span>
                  {p.discount > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-[#FB641B] text-white text-[10px] font-extrabold px-2 py-1 rounded-full">-{p.discount}%</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[10px] font-bold text-[#FB641B] uppercase tracking-wide mb-1">{p.category_name}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 flex-1">{p.name}</p>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Stars rating={p.rating ?? 0} />
                    <span className="text-[10px] text-gray-400">({(p.review_count ?? 0).toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      {p.original_price > p.price && (
                        <p className="text-xs text-gray-400 line-through">₹{p.original_price.toLocaleString('en-IN')}</p>
                      )}
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
            {products.map(p => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group bg-white dark:bg-[#1a1a24] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-row">
                <div className="relative flex-shrink-0 w-40 md:w-52">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full min-h-[140px] w-full object-cover" />
                  ) : (
                    <ImgPlaceholder className="h-full min-h-[140px] w-full" icon="✨" />
                  )}
                  <span className="absolute top-2.5 left-2.5 bg-[#2874F0] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">NEW</span>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#FB641B] uppercase tracking-wide mb-1">{p.category_name}</p>
                    <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2">{p.name}</p>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Stars rating={p.rating ?? 0} />
                      <span className="text-[10px] text-gray-400">({(p.review_count ?? 0).toLocaleString()} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-extrabold text-gray-900 dark:text-white">₹{p.price.toLocaleString('en-IN')}</p>
                      {p.discount > 0 && (
                        <>
                          <p className="text-sm text-gray-400 line-through">₹{p.original_price.toLocaleString('en-IN')}</p>
                          <span className="text-xs font-bold text-[#198754] bg-green-50 px-2 py-0.5 rounded-full">{p.discount}% off</span>
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

      {/* ─── BOTTOM CTA ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0d2b1e] via-[#0f5132] to-[#198754] text-white p-8 md:p-10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 min-h-[180px]">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex-1">
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🆕 Fresh Stock</span>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2">New Products Added Weekly</h3>
            <p className="text-white/70 text-sm mb-5 max-w-md">We're always adding the latest tech. Check back often or follow us for updates.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-full hover:shadow-lg transition">Shop All Products →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
