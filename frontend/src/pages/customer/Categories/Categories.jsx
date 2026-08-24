import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../../services/categoryService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

// ─────────────────────── PRESENTATION HELPERS ────────────────────────────────

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

// ─────────────────────── PAGE ────────────────────────────────────────────────

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await categoryService.getCategories();
        if (!cancelled) setCategories(unwrapList(data));
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load categories.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalProducts = categories.reduce((sum, c) => sum + (c.product_count ?? 0), 0);

  const stats = [
    { label: 'Categories', value: String(categories.length), icon: '📂' },
    { label: 'Products', value: totalProducts.toLocaleString('en-IN'), icon: '📦' },
    { label: 'Free Delivery', value: '₹500+', icon: '🚚' },
    { label: 'Secure Payments', value: 'UPI · Cards', icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-300">

      {/* ─── HERO BANNER ─── */}
      <section className="relative bg-gradient-to-r from-[#0f1e3d] via-[#1a3a6e] to-[#2874F0] text-white overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[30%] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-[40%] left-[-40px] w-40 h-40 rounded-full bg-[#FB641B]/10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white font-semibold">All Categories</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1">
              <span className="inline-block text-xs font-bold bg-white/15 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-5">
                🛒 Browse Our Collection
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3">
                All <span className="text-[#FB641B]">Categories</span>
              </h1>
              <p className="text-white/70 text-base md:text-lg max-w-lg leading-relaxed">
                Explore our wide range of tech products organized by category. Find exactly what you're looking for.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 min-w-[120px]">
                  <span className="text-2xl block mb-1">{s.icon}</span>
                  <p className="text-xl font-extrabold text-white">{s.value}</p>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[#FB641B] uppercase tracking-widest mb-1">Browse</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Shop by Category</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">{categories.length} categories available</p>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading..." />
        ) : error ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Could not load categories</h2>
            <p className="text-[var(--text-secondary)]">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">📂</span>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">No categories found</h2>
            <p className="text-[var(--text-secondary)]">Check back soon — new categories are on the way!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, idx) => (
              <Link key={cat.id} to={`/categories/${cat.slug}`}
                className="group relative bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl border border-[var(--card-border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                {/* Gradient header */}
                <div className={`relative bg-gradient-to-br ${CATEGORY_GRADIENTS[idx % CATEGORY_GRADIENTS.length]} p-6 text-white overflow-hidden`}>
                  <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
                  <div className="absolute bottom-[-20px] left-[40%] w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} loading="lazy" className="w-12 h-12 object-cover rounded-xl shadow-md" />
                    ) : (
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{categoryIcon(cat)}</span>
                    )}
                    <span className="bg-white/20 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full">
                      {cat.product_count} items
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-extrabold text-[var(--text-primary)] mb-1.5 group-hover:text-[#2874F0] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 flex-1">
                    {cat.description}
                  </p>

                  {/* Featured products tags */}
                  {Array.isArray(cat.featured) && cat.featured.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cat.featured.map((item, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-[rgba(128,128,128,0.1)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--card-border)]">
                    <span className="text-xs font-bold text-[#2874F0] group-hover:underline">
                      Shop Now →
                    </span>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${CATEGORY_GRADIENTS[idx % CATEGORY_GRADIENTS.length]} flex items-center justify-center text-white text-sm shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── PROMO BANNER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1a0533] via-[#3b1070] to-[#7c3aed] text-white p-8 md:p-10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 min-h-[200px]">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-[-30px] left-[20%] w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 flex-1">
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🔥 Limited Time</span>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2">Mega Tech Sale — Up to 40% Off</h3>
            <p className="text-white/70 text-sm mb-5 max-w-md">
              Don't miss out on incredible deals across all categories. Hurry, sale ends soon!
            </p>
            <Link to="/shop"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-full hover:shadow-lg transition">
              Shop All Deals →
            </Link>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl">🎧</div>
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl">💻</div>
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl">📱</div>
          </div>
        </div>
      </section>

      {/* ─── TRUST SECTION ─── */}
      <section className="bg-[var(--card-bg)] backdrop-blur-xl border-y border-[var(--card-border)] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'Free Shipping', sub: 'On orders over ₹2,000' },
              { icon: '🔒', title: 'Secure Payment', sub: '100% secure checkout' },
              { icon: '🔄', title: 'Easy Returns', sub: '30-day return policy' },
              { icon: '💬', title: '24/7 Support', sub: 'Dedicated help center' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[rgba(128,128,128,0.08)] flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
