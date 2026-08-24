import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useCart } from '../../../context/CartContext';

// ─────────────────────── PRESENTATION HELPERS ────────────────────────────────

const ORDERING_PARAMS = {
  popular: '',
  'price-low': 'price',
  'price-high': '-price',
  rating: '-rating',
  newest: '-created_at',
  discount: '-discount',
};

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
  laptops: '💻',
  phones: '📱',
  audio: '🎧',
  monitors: '🖥️',
  networking: '🌐',
  gaming: '🎮',
  'smart-home': '🏠',
  accessories: '🖱️',
};

const categoryIcon = (cat) => {
  const haystack = `${cat?.slug ?? ''} ${cat?.name ?? ''}`.toLowerCase();
  const match = Object.keys(CATEGORY_ICONS).find(
    (key) => haystack.includes(key) || haystack.includes(key.replace(/-/g, ' '))
  );
  return match ? CATEGORY_ICONS[match] : '🛍️';
};

const PRODUCT_BADGE_CLASS = 'bg-amber-500';

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
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'fill-current' : 'fill-[rgba(128,128,128,0.35)] text-[rgba(128,128,128,0.35)]'}`} viewBox="0 0 20 20">
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

function AddToCartBtn({ product, small = false }) {
  const { addToCart } = useCart();
  const [state, setState] = useState('idle');
  const soldOut = (product?.stock ?? 0) === 0;
  const handle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut || state === 'added') return;
    addToCart(product, 1);
    setState('added');
    setTimeout(() => setState('idle'), 1500);
  };
  const base = `font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-1.5 ${small ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'}`;
  if (soldOut) {
    return (
      <button onClick={handle} disabled className={`${base} bg-[rgba(128,128,128,0.12)] text-[var(--text-secondary)] cursor-not-allowed`}>
        Sold Out
      </button>
    );
  }
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

  const [category, setCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadCategory = async () => {
      setCategoryLoading(true);
      setCategoryError('');
      setNotFound(false);
      try {
        const data = await categoryService.getCategory(slug);
        if (!cancelled) setCategory(data);
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) setNotFound(true);
          else setCategoryError(getApiErrorMessage(err, 'Failed to load category.'));
        }
      } finally {
        if (!cancelled) setCategoryLoading(false);
      }
    };
    loadCategory();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    categoryService
      .getCategories()
      .then((data) => {
        if (!cancelled) setCategories(unwrapList(data));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError('');
      try {
        const params = { category: slug };
        const ordering = ORDERING_PARAMS[sortBy];
        if (ordering) params.ordering = ordering;
        params.page_size = 24;
        const data = await productService.getProducts(params);
        if (!cancelled) setProducts(unwrapList(data));
      } catch (err) {
        if (!cancelled) setProductsError(getApiErrorMessage(err, 'Failed to load products.'));
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    };
    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [slug, sortBy]);

  const relatedCategories = categories.filter(c => c.slug !== slug).slice(0, 4);

  const prices = products.map(p => p.price ?? 0);
  const discounts = products.map(p => p.discount ?? 0);
  const startingPrice = products.length > 0 ? Math.min(...prices) : null;
  const bestDiscount = products.length > 0 ? Math.max(0, ...discounts) : null;

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-300">
        <LoadingSpinner label="Loading..." />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔍</span>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">Category Not Found</h1>
          <p className="text-[var(--text-secondary)] mb-6">The category you're looking for doesn't exist.</p>
          <Link to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2874F0] text-white font-bold rounded-full hover:shadow-lg transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <span className="text-6xl mb-4 block">⚠️</span>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">Could not load category</h1>
          <p className="text-[var(--text-secondary)] mb-6">{categoryError}</p>
          <Link to="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2874F0] text-white font-bold rounded-full hover:shadow-lg transition">
            ← All Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-300">

      {/* ─── CATEGORY HERO BANNER ─── */}
      <section className={`relative bg-gradient-to-r ${CATEGORY_GRADIENTS[categories.findIndex(c => c.slug === slug) % CATEGORY_GRADIENTS.length] || 'from-[#2874F0] to-[#0f1e3d]'} text-white overflow-hidden`}>
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
                {category.image ? (
                  <img src={category.image} alt={category.name} loading="lazy" className="w-12 h-12 object-cover rounded-xl shadow-md" />
                ) : (
                  <span className="text-5xl">{categoryIcon(category)}</span>
                )}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{category.name}</h1>
                  <p className="text-white/70 text-sm mt-1">{category.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <span className="bg-white/15 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
                  {products.length} Products
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
                  <span className="text-sm font-bold text-white">{category.product_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Starting from</span>
                  <span className="text-sm font-bold text-[#FB641B]">
                    {startingPrice !== null ? `₹${startingPrice.toLocaleString('en-IN')}` : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Best Discount</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {bestDiscount !== null ? `${bestDiscount}% OFF` : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FILTERS & SORT BAR ─── */}
      <section className="bg-[var(--card-bg)] backdrop-blur-xl border-b border-[var(--card-border)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold text-[var(--text-primary)] hidden sm:block">
                {products.length} results
              </p>
              <div className="hidden md:flex items-center gap-2">
                {categories.slice(0, 5).map(cat => (
                  <Link key={cat.id} to={`/categories/${cat.slug}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${cat.slug === slug
                        ? 'bg-[#2874F0] text-white shadow'
                        : 'bg-[rgba(128,128,128,0.08)] text-[var(--text-secondary)] hover:bg-[rgba(128,128,128,0.16)]'
                      }`}>
                    {categoryIcon(cat)} {cat.name.split(' ')[0]}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="hidden sm:flex items-center bg-[rgba(128,128,128,0.08)] rounded-lg p-0.5">
                <button onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white dark:bg-white/15 shadow text-[#2874F0]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-white/15 shadow text-[#2874F0]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Sort dropdown */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-sm font-medium text-[var(--text-primary)] bg-[rgba(128,128,128,0.08)] border-0 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-[#2874F0] cursor-pointer">
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
        {productsLoading ? (
          <LoadingSpinner label="Loading..." />
        ) : productsError ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Could not load products</h2>
            <p className="text-[var(--text-secondary)] mb-6">{productsError}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">{categoryIcon(category)}</span>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">No products found</h2>
            <p className="text-[var(--text-secondary)] mb-6">We're adding new products to this category soon!</p>
            <Link to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2874F0] text-white font-bold rounded-full hover:shadow-lg transition">
              Browse All Products →
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl border border-[var(--card-border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="relative">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="h-44 w-full object-cover" />
                  ) : (
                    <ImgPlaceholder className="h-44 w-full" icon={categoryIcon(category)} />
                  )}
                  {p.badge && (
                    <span className={`absolute top-2.5 left-2.5 ${PRODUCT_BADGE_CLASS} text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow`}>
                      {p.badge}
                    </span>
                  )}
                  {p.discount > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-[#FB641B] text-white text-[10px] font-extrabold px-2 py-1 rounded-full">
                      -{p.discount}%
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[10px] font-bold text-[#2874F0] uppercase tracking-wide mb-1">{p.brand}</p>
                  <p className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 mb-2 flex-1">{p.name}</p>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Stars rating={p.rating} />
                    <span className="text-[10px] text-[var(--text-secondary)]">({(p.reviews_count ?? 0).toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      {p.original_price > p.price && (
                        <p className="text-xs text-[var(--text-secondary)] line-through">₹{p.original_price.toLocaleString('en-IN')}</p>
                      )}
                      <p className="text-base font-extrabold text-[var(--text-primary)]">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    <AddToCartBtn product={p} small />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map(p => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl border border-[var(--card-border)] shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-row">
                <div className="relative flex-shrink-0 w-40 md:w-52">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full min-h-[140px] w-full object-cover" />
                  ) : (
                    <ImgPlaceholder className="h-full min-h-[140px] w-full" icon={categoryIcon(category)} />
                  )}
                  {p.badge && (
                    <span className={`absolute top-2.5 left-2.5 ${PRODUCT_BADGE_CLASS} text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow`}>
                      {p.badge}
                    </span>
                  )}
                  {p.discount > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-[#FB641B] text-white text-[10px] font-extrabold px-2 py-1 rounded-full">
                      -{p.discount}%
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#2874F0] uppercase tracking-wide mb-1">{p.brand}</p>
                    <p className="text-sm md:text-base font-bold text-[var(--text-primary)] mb-2">{p.name}</p>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Stars rating={p.rating} />
                      <span className="text-[10px] text-[var(--text-secondary)]">({(p.reviews_count ?? 0).toLocaleString()} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-extrabold text-[var(--text-primary)]">₹{p.price.toLocaleString('en-IN')}</p>
                      {p.discount > 0 && p.original_price > p.price && (
                        <>
                          <p className="text-sm text-[var(--text-secondary)] line-through">₹{p.original_price.toLocaleString('en-IN')}</p>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            {p.discount}% off
                          </span>
                        </>
                      )}
                    </div>
                    <AddToCartBtn product={p} />
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
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Related Categories</h2>
          </div>
          <Link to="/" className="text-sm font-semibold text-[#2874F0] hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {relatedCategories.map((cat, idx) => (
            <Link key={cat.id} to={`/categories/${cat.slug}`}
              className="group bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl border border-[var(--card-border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-5 flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br ${CATEGORY_GRADIENTS[idx % CATEGORY_GRADIENTS.length]} flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-200 mb-3`}>
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  categoryIcon(cat)
                )}
              </div>
              <p className="text-sm font-bold text-[var(--text-primary)] mb-1">{cat.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{cat.product_count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── BOTTOM CTA BANNER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className={`relative rounded-3xl bg-gradient-to-r ${CATEGORY_GRADIENTS[categories.findIndex(c => c.slug === slug) % CATEGORY_GRADIENTS.length] || 'from-[#2874F0] to-[#0f1e3d]'} text-white p-8 overflow-hidden flex items-center justify-between gap-4 min-h-[180px]`}>
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
            {categoryIcon(category)}
          </div>
        </div>
      </section>

    </div>
  );
}

