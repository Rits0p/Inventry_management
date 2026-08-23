import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

// ─────────────────────────── DATA ─────────────────────────────────────────────

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

function TimeBox({ v, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-xl md:text-2xl font-extrabold w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center tabular-nums shadow" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
        {v}
      </div>
      <span className="text-[9px] font-bold uppercase mt-1 tracking-widest" style={{ color: 'var(--text-secondary)' }}>{label}</span>
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

  const [allDeals, setAllDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Countdown — 24h from page load
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const target = Date.now() + 24 * 3600 * 1000;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const d = String(Math.floor(diff / 86400000)).padStart(2, '0');
      const h = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTimeLeft({ d, h, m, s });
    };
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadDeals = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productService.getProducts({ ordering: '-discount', page_size: 24 });
        if (!cancelled) setAllDeals(unwrapList(data));
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load products.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadDeals();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryOptions = ['All', ...new Set(allDeals.map(p => p.category_name).filter(Boolean))];

  const filteredDeals = useMemo(() => {
    let items = activeCategory === 'All'
      ? [...allDeals]
      : allDeals.filter(p => p.category_name === activeCategory);

    switch (sortBy) {
      case 'price-low': items.sort((a, b) => a.price - b.price); break;
      case 'price-high': items.sort((a, b) => b.price - a.price); break;
      case 'rating': items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case 'popular': items.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0)); break;
      default: items.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
    }
    return items;
  }, [allDeals, activeCategory, sortBy]);

  const maxDiscount = filteredDeals.length ? Math.max(...filteredDeals.map(p => p.discount ?? 0)) : 0;
  const minPrice = filteredDeals.length ? Math.min(...filteredDeals.map(p => p.price)) : 0;

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
                  {filteredDeals.length} Deals
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
                {categoryOptions.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${cat === activeCategory
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
        {loading ? (
          <LoadingSpinner label="Loading flash deals..." />
        ) : error ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Could not load deals</h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </div>
        ) : filteredDeals.length === 0 ? (
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
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="h-44 w-full object-cover" />
                  ) : (
                    <ImgPlaceholder className="h-44 w-full" icon="🛒" />
                  )}
                  {p.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
                      {p.badge}
                    </span>
                  )}
                  {p.discount > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-gray-900 text-[#FB641B] text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow">
                      -{p.discount}%
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[10px] font-bold text-[#FB641B] uppercase tracking-wide mb-1">{p.category_name}</p>
                  <p className="text-sm font-bold line-clamp-2 mb-2 flex-1" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Stars rating={p.rating ?? 0} />
                    <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>({(p.review_count ?? 0).toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      {p.original_price > p.price && (
                        <p className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>₹{p.original_price.toLocaleString('en-IN')}</p>
                      )}
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
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full min-h-[140px] w-full object-cover" />
                  ) : (
                    <ImgPlaceholder className="h-full min-h-[140px] w-full" icon="🛒" />
                  )}
                  {p.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
                      {p.badge}
                    </span>
                  )}
                  {p.discount > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-gray-900 text-[#FB641B] text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow">
                      -{p.discount}%
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#FB641B] uppercase tracking-wide mb-1">{p.category_name}</p>
                    <p className="text-sm md:text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Stars rating={p.rating ?? 0} />
                      <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>({(p.review_count ?? 0).toLocaleString()} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>₹{p.price.toLocaleString('en-IN')}</p>
                      {p.discount > 0 && (
                        <>
                          <p className="text-sm line-through" style={{ color: 'var(--text-secondary)' }}>₹{p.original_price.toLocaleString('en-IN')}</p>
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
            <p className="text-3xl font-extrabold text-[#FB641B]">{filteredDeals.length}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Deals</p>
          </div>
        </div>
      </section>

    </div>
  );
}
