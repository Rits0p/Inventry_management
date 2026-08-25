import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

// ─────────────────────────── DATA ─────────────────────────────────────────────

const HERO_SLIDES = [
  {
    id: 1,
    tag: '🔥 Mega Tech Sale — Up to 40% Off',
    title: 'Next-Gen Tech',
    highlight: 'Hardware & Gadgets',
    sub: 'Shop the latest processors, monitors, peripherals and smart home devices.',
    cta: 'Shop Now',
    ctaLink: '/shop',
    bg: 'from-[#0f1e3d] via-[#1a3a6e] to-[#2874F0]',
    accent: '#FB641B',
    badge: '40% OFF',
  },
  {
    id: 2,
    tag: '⚡ Flash Deal — Today Only',
    title: 'Premium Audio &',
    highlight: 'Home Entertainment',
    sub: 'Discover Sony, JBL, and Bose at prices you\'ve never seen before.',
    cta: 'Grab the Deal',
    ctaLink: '/shop',
    bg: 'from-[#1a0533] via-[#3b1070] to-[#7c3aed]',
    accent: '#FB641B',
    badge: '35% OFF',
  },
  {
    id: 3,
    tag: '🆕 New Arrivals — Just Landed',
    title: 'Future-Ready',
    highlight: 'Smart Devices',
    sub: 'Be the first to own the latest in AI-powered smart home and wearable tech.',
    cta: 'Explore New',
    ctaLink: '/shop',
    bg: 'from-[#0d2b1e] via-[#0f5132] to-[#198754]',
    accent: '#FB641B',
    badge: 'NEW',
  },
];

const CATEGORY_GRADIENTS = [
  'from-blue-500 to-blue-700',
  'from-violet-500 to-purple-700',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-600',
  'from-teal-500 to-cyan-700',
  'from-red-500 to-red-700',
  'from-emerald-500 to-green-700',
  'from-slate-500 to-gray-700',
];

const CATEGORY_ICONS = {
  laptops: '💻', computers: '💻', phones: '📱', smartphones: '📱',
  audio: '🎧', headphones: '🎧', monitors: '🖥️', displays: '🖥️',
  networking: '🌐', gaming: '🎮', 'smart-home': '🏠', accessories: '🖱️',
  default: '📦',
};

const PROMO_BANNERS = [
  {
    tag: 'Gaming Week',
    title: 'Level Up Your Setup',
    sub: 'RTX 40 series laptops, gaming chairs & peripherals',
    bg: 'from-[#1a0533] to-[#7c3aed]',
    link: '/categories/gaming',
    icon: '🎮',
  },
  {
    tag: 'Smart Home',
    title: 'Make Your Home Smarter',
    sub: 'Voice assistants, robot vacuums & smart lighting',
    bg: 'from-[#0d2b1e] to-[#198754]',
    link: '/categories/smart-home',
    icon: '🏠',
  },
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

// Placeholder image area — user drops real image here later
function ImgPlaceholder({ className = '', icon = '📦' }) {
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 ${className}`}>
      <span className="text-4xl opacity-25">{icon}</span>
    </div>
  );
}

function TimeBox({ v, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xl md:text-2xl font-extrabold w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center tabular-nums shadow">
        {v}
      </div>
      <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase mt-1 tracking-widest">{label}</span>
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

// ─────────────────────── SECTION: HERO ───────────────────────────────────────

function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [featuredDeal, setFeaturedDeal] = useState(null);

  const next = useCallback(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), []);
  const prev = () => setCurrent(c => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  useEffect(() => {
    let cancelled = false;
    productService
      .getProducts({ ordering: '-discount', page_size: 1 })
      .then((data) => {
        if (!cancelled) setFeaturedDeal(unwrapList(data)[0] ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto py-4">
      <section className={`relative rounded-3xl bg-gradient-to-r ${slide.bg} text-white overflow-hidden transition-all duration-700 shadow-2xl flex items-center`}
        style={{ height: 'calc(100vh - 100px)', minHeight: '480px' }}>
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[30%] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-row items-center justify-between gap-6">
          {/* Text */}
          <div className="flex-1 z-10">
            <span className="inline-block text-xs font-bold bg-white/15 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-5">
              {slide.tag}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-2">
              {slide.title}
            </h1>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5" style={{ color: slide.accent }}>
              {slide.highlight}
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
              {slide.sub}
            </p>

            <div className="flex items-center gap-4 flex-wrap mt-2">
              <Link to={slide.ctaLink}
                className="px-7 py-3.5 bg-white text-[#2874F0] font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm">
                {slide.cta} →
              </Link>
              <span className="text-white/60 text-sm flex items-center gap-1.5">
                <span className="text-green-400 font-bold">✓</span> Free Shipping on orders over ₹2,000
              </span>
            </div>
          </div>

          {/* Right card placeholder */}
          {featuredDeal && (
            <div className="relative z-10 flex-shrink-0 w-[45%] md:w-80">
              <Link to={`/product/${featuredDeal.id}`} className="block">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 hover:bg-white/15 transition-all duration-200">
                  <div className="relative rounded-2xl overflow-hidden mb-4">
                    {featuredDeal.image ? (
                      <img src={featuredDeal.image} alt={featuredDeal.name} loading="lazy" className="h-52 w-full object-cover" />
                    ) : (
                      <ImgPlaceholder className="h-52 w-full" icon="💻" />
                    )}
                    <span className="absolute top-3 right-3 bg-[#FB641B] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                      {slide.badge}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Featured Deal</p>
                  <p className="font-bold text-white text-sm line-clamp-1">{featuredDeal.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-extrabold text-[#FB641B]">₹{featuredDeal.price.toLocaleString('en-IN')}</span>
                    {featuredDeal.original_price > featuredDeal.price && (
                      <span className="text-xs text-white/50 line-through">₹{featuredDeal.original_price.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <button onClick={prev}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition">
            ‹
          </button>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-7 h-2.5 bg-[#FB641B]' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`} />
          ))}
          <button onClick={next}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition">
            ›
          </button>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────── SECTION: CATEGORIES ─────────────────────────────────

function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    categoryService
      .getCategories()
      .then((data) => {
        if (!cancelled) setCategories(unwrapList(data));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-[#FB641B] uppercase tracking-widest mb-1">Browse</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Shop by Category</h2>
        </div>
        <Link to="/categories" className="text-sm font-semibold text-[#2874F0] hover:underline">View All →</Link>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {categories.map((cat, idx) => {
          const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
          const icon = CATEGORY_ICONS[slug] || CATEGORY_ICONS.default;
          const gradient = CATEGORY_GRADIENTS[idx % CATEGORY_GRADIENTS.length];
          return (
            <Link key={cat.id} to={`/categories/${slug}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white dark:hover:bg-white/5 hover:shadow-md dark:hover:shadow-none transition-all duration-200">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                {icon}
              </div>
              <p className="text-xs font-semibold text-[var(--text-primary)] text-center leading-tight">{cat.name}</p>
              <p className="text-[10px] text-[var(--text-secondary)]">{cat.product_count ?? 0} items</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─────────────────────── SECTION: FLASH SALE ─────────────────────────────────

function FlashSaleSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState({ h: '08', m: '00', s: '00' });

  useEffect(() => {
    let cancelled = false;
    productService
      .getProducts({ ordering: '-discount', page_size: 5 })
      .then((data) => {
        if (!cancelled) setProducts(unwrapList(data));
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load products.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const target = Date.now() + 8 * 3600 * 1000; // 8h from now
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTimeLeft({ h, m, s });
    };
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-10 transition-colors duration-300" style={{ backgroundColor: 'var(--page-bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">⚡</span>
                <span className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)]">Flash Sale</span>
                <span className="bg-[#FB641B] text-white text-xs font-bold px-2.5 py-1 rounded-full">UP TO 40% OFF</span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm">Prices drop every day — don't miss out!</p>
            </div>
          </div>
          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-secondary)] text-sm font-medium mr-1">Ends in:</span>
            <TimeBox v={timeLeft.h} label="Hrs" />
            <span className="text-[var(--text-primary)] font-bold text-xl mb-4">:</span>
            <TimeBox v={timeLeft.m} label="Min" />
            <span className="text-[var(--text-primary)] font-bold text-xl mb-4">:</span>
            <TimeBox v={timeLeft.s} label="Sec" />
          </div>
        </div>

        {/* Flash deal cards — horizontal scroll */}
        {loading ? (
          <LoadingSpinner label="Loading flash deals..." />
        ) : error ? (
          <div className="text-center py-10">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Could not load flash deals</h3>
            <p className="text-[var(--text-secondary)]">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <span className="text-6xl mb-4 block">⚡</span>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">No flash deals right now</h3>
            <p className="text-[var(--text-secondary)]">Check back soon — new deals drop every day!</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {products.map(p => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="flex-shrink-0 w-52 bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-200 flex flex-col hover:-translate-y-1">
                <div className="relative">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="h-36 w-full object-cover" />
                  ) : (
                    <ImgPlaceholder className="h-36 w-full" icon="🛒" />
                  )}
                  {p.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-[#FB641B] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                      -{p.discount}%
                    </span>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col bg-[var(--card-bg)] backdrop-blur-xl">
                  <p className="text-[10px] font-bold text-[#FB641B] uppercase mb-1">{p.category_name}</p>
                  <p className="text-xs font-bold text-[var(--text-primary)] line-clamp-2 mb-1 flex-1">{p.name}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Stars rating={p.rating ?? 0} />
                    <span className="text-[10px] text-gray-400">({p.reviews_count ?? 0})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {p.original_price > p.price && (
                        <p className="text-xs text-gray-400 line-through">₹{p.original_price.toLocaleString('en-IN')}</p>
                      )}
                      <p className="text-sm font-extrabold text-[var(--text-primary)]">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    <AddToCartBtn small />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-5 text-center">
          <Link to="/flash-deals" className="inline-flex items-center gap-2 text-sm font-semibold text-[#FB641B] hover:underline">
            View All Flash Deals →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────── SECTION: TOP PRODUCTS ───────────────────────────────

function TopProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    productService
      .getProducts({ ordering: '-rating', page_size: 8 })
      .then((data) => {
        if (!cancelled) setProducts(unwrapList(data));
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load products.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-end justify-between mb-7">
        <div>
          <p className="text-xs font-bold text-[#FB641B] uppercase tracking-widest mb-1">🔥 Best Sellers</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Top Selling Products</h2>
        </div>
        <Link to="/top-selling" className="text-sm font-semibold text-[#2874F0] hover:underline">View Full Ranking →</Link>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading top products..." />
      ) : error ? (
        <div className="text-center py-10">
          <span className="text-6xl mb-4 block">⚠️</span>
          <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Could not load top products</h3>
          <p className="text-[var(--text-secondary)]">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10">
          <span className="text-6xl mb-4 block">📦</span>
          <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">No products found</h3>
          <p className="text-[var(--text-secondary)]">Check back soon — our catalogue is growing!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => (
            <Link key={p.id} to={`/product/${p.id}`}
              className="group bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl border border-[var(--card-border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
              {/* Image */}
              <div className="relative">
                {p.image ? (
                  <img src={p.image} alt={p.name} loading="lazy" className="h-44 w-full object-cover" />
                ) : (
                  <ImgPlaceholder className="h-44 w-full" icon="📦" />
                )}
                {p.badge && (
                  <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
                    {p.badge}
                  </span>
                )}
                {p.discount > 0 && (
                  <span className="absolute top-2.5 right-2.5 bg-[#FB641B] text-white text-[10px] font-extrabold px-2 py-1 rounded-full">
                    -{p.discount}%
                  </span>
                )}
              </div>
              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-[10px] font-bold text-[#2874F0] uppercase tracking-wide mb-1">{p.category_name}</p>
                <p className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 mb-2 flex-1">{p.name}</p>
                <div className="flex items-center gap-1.5 mb-3">
                  <Stars rating={p.rating ?? 0} />
                  <span className="text-[10px] text-gray-400">({(p.reviews_count ?? 0).toLocaleString()})</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    {p.original_price > p.price && (
                      <p className="text-xs text-gray-400 line-through">₹{p.original_price.toLocaleString('en-IN')}</p>
                    )}
                    <p className="text-base font-extrabold text-[var(--text-primary)]">₹{p.price.toLocaleString('en-IN')}</p>
                  </div>
                  <AddToCartBtn small />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────── SECTION: PROMO BANNERS ──────────────────────────────

function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROMO_BANNERS.map((b, i) => (
          <div key={i}
            className={`relative rounded-3xl bg-gradient-to-br ${b.bg} text-white p-8 overflow-hidden flex items-center justify-between gap-4 min-h-[180px]`}>
            <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5" />
            <div className="relative z-10">
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">{b.tag}</span>
              <h3 className="text-xl md:text-2xl font-extrabold mb-1">{b.title}</h3>
              <p className="text-white/70 text-sm mb-4">{b.sub}</p>
              <Link to={b.link}
                className="inline-flex items-center gap-1 bg-white text-gray-900 font-bold text-sm px-5 py-2.5 rounded-full hover:shadow-lg transition">
                Shop Now →
              </Link>
            </div>
            {/* Placeholder image area */}
            <div className="flex-shrink-0 w-28 h-28 rounded-2xl bg-white/10 flex items-center justify-center text-5xl">
              {b.icon}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────── SECTION: NEW ARRIVALS ───────────────────────────────

function NewArrivalsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    productService
      .getProducts({ ordering: '-created_at', page_size: 6 })
      .then((data) => {
        if (!cancelled) setProducts(unwrapList(data));
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load products.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-12 transition-colors duration-300" style={{ background: 'linear-gradient(to bottom, var(--page-bg), var(--page-bg-secondary))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-xs font-bold text-[#2874F0] uppercase tracking-widest mb-1">🆕 Just Landed</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">New Arrivals</h2>
          </div>
          <Link to="/new-arrivals" className="text-sm font-semibold text-[#2874F0] hover:underline">See All New →</Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading new arrivals..." />
        ) : error ? (
          <div className="text-center py-10">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Could not load new arrivals</h3>
            <p className="text-[var(--text-secondary)]">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <span className="text-6xl mb-4 block">✨</span>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">No new arrivals yet</h3>
            <p className="text-[var(--text-secondary)]">Check back soon — fresh products land every week!</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {products.map(p => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group flex-shrink-0 w-48 bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl border border-[var(--card-border)] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden">
                <div className="relative">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="h-36 w-full object-cover" />
                  ) : (
                    <ImgPlaceholder className="h-36 w-full" icon="✨" />
                  )}
                  <span className="absolute top-2 left-2 bg-[#2874F0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                  {p.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-[#FB641B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{p.discount}%</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold text-[#FB641B] uppercase mb-1">{p.category_name}</p>
                  <p className="text-xs font-bold text-[var(--text-primary)] line-clamp-2 mb-2">{p.name}</p>
                  <Stars rating={p.rating ?? 0} />
                  <p className="text-sm font-extrabold text-[var(--text-primary)] mt-1.5">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────── SECTION: BRANDS ─────────────────────────────────────

function BrandsSection() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    let cancelled = false;
    productService
      .getBrands()
      .then((data) => {
        if (!cancelled) setBrands(data);
      })
      .catch(() => {})
      .finally(() => {});
    return () => { cancelled = true; };
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="bg-[var(--card-bg)] backdrop-blur-xl border-y border-[var(--card-border)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Trusted Brands We Carry</p>
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {brands.map(brand => (
            <Link key={brand} to={`/shop?brand=${brand.toLowerCase()}`}
              className="px-6 py-2.5 bg-[rgba(128,128,128,0.06)] border border-[var(--card-border)] rounded-full text-sm font-semibold text-[var(--text-secondary)] hover:bg-[#2874F0] hover:text-white hover:border-[#2874F0] transition-all duration-200">
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}



// ─────────────────────── PAGE ASSEMBLY ───────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-300">
      <HeroSection />
      <CategoriesSection />
      <FlashSaleSection />
      <TopProductsSection />
      <PromoBanners />
      <NewArrivalsSection />
      <BrandsSection />
    </div>
  );
}

