import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Shop.css';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const SORT_PARAMS = {
  popularity: '',
  'price-low': 'price',
  'price-high': '-price',
  discount: '-discount',
  rating: '-rating',
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'All';
  const sortBy = searchParams.get('sort') || 'popularity';
  const search = searchParams.get('q') || '';
  const activeBrand = searchParams.get('brand') || '';

  const [viewMode, setViewMode] = useState('grid');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (category && category !== 'All') params.category = category;
        if (activeBrand) params.brand = activeBrand;
        if (search) params.search = search;
        const ordering = SORT_PARAMS[sortBy];
        if (ordering) params.ordering = ordering;
        params.page_size = 24;
        const data = await productService.getProducts(params);
        if (!cancelled) setProducts(unwrapList(data));
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
  }, [category, activeBrand, search, sortBy]);

  useEffect(() => {
    let cancelled = false;
    categoryService
      .getCategories()
      .then((data) => {
        if (!cancelled) setCategories(unwrapList(data).map((c) => c.name));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'popularity') params.set(key, value);
    else params.delete(key);
    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (cat) => {
    updateFilter('category', cat);
  };

  const handleSortChange = (sort) => {
    updateFilter('sort', sort);
  };

  return (
    <main className="shop-page">
      <div className="shop-container">
        {/* Page Header */}
        <header className="shop-header">
          <div>
            <h1 className="shop-title">
              {activeBrand ? `${activeBrand} Products` : 'Product Catalogue'}
            </h1>
            <p className="shop-subtitle">
              {!loading && `${products.length} product${products.length !== 1 ? 's' : ''} available`}
              {activeBrand && (
                <button onClick={() => updateFilter('brand', '')} className="shop-clear-brand">
                  Clear filter ×
                </button>
              )}
            </p>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="shop-filters-card">
          <div className="shop-filters-row">
            <div className="shop-category-pills">
              {['All', ...categories].map(cat => (
                <button key={cat} onClick={() => handleCategoryChange(cat)} className={`shop-pill ${category === cat ? 'active' : ''}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="shop-filter-right">
              <div className="shop-view-toggle">
                <button onClick={() => setViewMode('grid')} className={`shop-view-btn ${viewMode === 'grid' ? 'active' : ''}`} title="Grid view">
                  ▦
                </button>
                <button onClick={() => setViewMode('list')} className={`shop-view-btn ${viewMode === 'list' ? 'active' : ''}`} title="List view">
                  ☰
                </button>
              </div>
              <select value={sortBy} onChange={e => handleSortChange(e.target.value)} className="shop-sort-select">
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="discount">Discount</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid / List */}
        {loading ? (
          <LoadingSpinner label="Loading products..." />
        ) : error ? (
          <div className="shop-empty">
            <span className="shop-empty-icon">⚠️</span>
            <h3>Could not load products</h3>
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="shop-empty">
            <span className="shop-empty-icon">🔍</span>
            <h3>No products found</h3>
            <p>Try changing the category or search term</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'shop-grid' : 'shop-list'}>
            {products.map(product => (
              viewMode === 'grid' ? (
                /* ── Grid Card ── */
                <div key={product.id} className="shop-card">
                  <Link to={`/product/${product.id}`} className="shop-card-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} loading="lazy" />
                    ) : (
                      <span className="shop-card-icon">{(product.name || '🛍️').charAt(0)}</span>
                    )}
                    {product.badge && <span className="shop-badge">{product.badge}</span>}
                  </Link>
                  <div className="shop-card-body">
                    <p className="shop-card-brand">{product.brand}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="shop-card-name">{product.name}</h3>
                    </Link>
                    <div className="shop-card-rating">
                      <span className="shop-rating-badge">{Number(product.rating ?? 0).toFixed(1)} ★</span>
                      <span className="shop-rating-count">({(product.review_count ?? 0).toLocaleString()})</span>
                    </div>
                    <div className="shop-card-price">
                      <span className="shop-price-current">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.original_price > product.price && (
                        <>
                          <span className="shop-price-original">₹{product.original_price.toLocaleString('en-IN')}</span>
                          <span className="shop-price-discount">{product.discount}% off</span>
                        </>
                      )}
                    </div>
                    <Link to={`/product/${product.id}`} className="shop-card-btn">View Details</Link>
                  </div>
                </div>
              ) : (
                /* ── List Row ── */
                <div key={product.id} className="shop-list-item">
                  <Link to={`/product/${product.id}`} className="shop-list-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} loading="lazy" />
                    ) : (
                      <span className="shop-card-icon">{(product.name || '🛍️').charAt(0)}</span>
                    )}
                    {product.badge && <span className="shop-badge">{product.badge}</span>}
                  </Link>
                  <div className="shop-list-body">
                    <p className="shop-card-brand">{product.brand}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="shop-card-name">{product.name}</h3>
                    </Link>
                    <div className="shop-card-rating">
                      <span className="shop-rating-badge">{Number(product.rating ?? 0).toFixed(1)} ★</span>
                      <span className="shop-rating-count">({(product.review_count ?? 0).toLocaleString()} reviews)</span>
                    </div>
                    <p className="shop-list-category">{product.category_name || ''}</p>
                  </div>
                  <div className="shop-list-right">
                    <div className="shop-card-price">
                      <span className="shop-price-current">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.original_price > product.price && (
                        <>
                          <span className="shop-price-original">₹{product.original_price.toLocaleString('en-IN')}</span>
                          <span className="shop-price-discount">{product.discount}% off</span>
                        </>
                      )}
                    </div>
                    <Link to={`/product/${product.id}`} className="shop-card-btn">View Details</Link>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
