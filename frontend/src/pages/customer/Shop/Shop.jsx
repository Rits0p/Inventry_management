import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Shop.css';

const allProducts = [
  { id: 1, name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', brand: 'Sony', price: 29990, originalPrice: 34990, discount: 14, rating: 4.7, reviews: 2841, category: 'Electronics', badge: 'Best Seller', icon: '🎧' },
  { id: 2, name: 'Apple Watch Series 9 GPS 45mm Midnight Aluminium', brand: 'Apple', price: 41900, originalPrice: 44900, discount: 7, rating: 4.8, reviews: 1520, category: 'Electronics', badge: null, icon: '⌚' },
  { id: 3, name: 'Nike Air Force 1 Low White Sneakers', brand: 'Nike', price: 7495, originalPrice: 7995, discount: 6, rating: 4.5, reviews: 932, category: 'Fashion', badge: null, icon: '👟' },
  { id: 4, name: 'Logitech MX Master 3S Wireless Mouse', brand: 'Logitech', price: 8995, originalPrice: 10995, discount: 18, rating: 4.6, reviews: 2103, category: 'Electronics', badge: 'Top Rated', icon: '🖱️' },
  { id: 5, name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker 6L', brand: 'Instant Pot', price: 8999, originalPrice: 12999, discount: 31, rating: 4.4, reviews: 1876, category: 'Home & Kitchen', badge: null, icon: '🍲' },
  { id: 6, name: 'Samsung 25W PD Power Adapter Type-C', brand: 'Samsung', price: 1499, originalPrice: 1999, discount: 25, rating: 4.3, reviews: 5402, category: 'Electronics', badge: null, icon: '🔌' },
  { id: 7, name: 'Cotton Crew Neck T-Shirt (Pack of 3)', brand: 'Roadster', price: 899, originalPrice: 1499, discount: 40, rating: 4.2, reviews: 3201, category: 'Fashion', badge: 'Deal of the Day', icon: '👕' },
  { id: 8, name: 'Milton Thermosteel Water Bottle 1 Litre', brand: 'Milton', price: 599, originalPrice: 799, discount: 25, rating: 4.5, reviews: 8900, category: 'Home & Kitchen', badge: null, icon: '🍶' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const initialBrand = searchParams.get('brand') || '';
  const initialSort = searchParams.get('sort') || 'popularity';
  const initialQ = searchParams.get('q') || '';

  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [search, setSearch] = useState(initialQ);
  const [activeBrand, setActiveBrand] = useState(initialBrand);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    setCategory(searchParams.get('category') || 'All');
    setActiveBrand(searchParams.get('brand') || '');
    setSortBy(searchParams.get('sort') || 'popularity');
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'popularity') params.set(key, value);
    else params.delete(key);
    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    updateFilter('category', cat);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    updateFilter('sort', sort);
  };

  let products = allProducts.filter(p => {
    const matchCategory = category === 'All' || p.category === category;
    const matchBrand = !activeBrand || p.brand.toLowerCase() === activeBrand.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchBrand && matchSearch;
  });

  if (sortBy === 'price-low') products = [...products].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') products = [...products].sort((a, b) => b.price - a.price);
  else if (sortBy === 'discount') products = [...products].sort((a, b) => b.discount - a.discount);
  else if (sortBy === 'rating') products = [...products].sort((a, b) => b.rating - a.rating);

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen'];

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
              {products.length} product{products.length !== 1 ? 's' : ''} available
              {activeBrand && (
                <button onClick={() => { setActiveBrand(''); updateFilter('brand', ''); }} className="shop-clear-brand">
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
              {categories.map(cat => (
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
        {products.length === 0 ? (
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
                    <span className="shop-card-icon">{product.icon}</span>
                    {product.badge && <span className="shop-badge">{product.badge}</span>}
                  </Link>
                  <div className="shop-card-body">
                    <p className="shop-card-brand">{product.brand}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="shop-card-name">{product.name}</h3>
                    </Link>
                    <div className="shop-card-rating">
                      <span className="shop-rating-badge">{product.rating} ★</span>
                      <span className="shop-rating-count">({product.reviews.toLocaleString()})</span>
                    </div>
                    <div className="shop-card-price">
                      <span className="shop-price-current">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="shop-price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      <span className="shop-price-discount">{product.discount}% off</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="shop-card-btn">View Details</Link>
                  </div>
                </div>
              ) : (
                /* ── List Row ── */
                <div key={product.id} className="shop-list-item">
                  <Link to={`/product/${product.id}`} className="shop-list-image">
                    <span className="shop-card-icon">{product.icon}</span>
                    {product.badge && <span className="shop-badge">{product.badge}</span>}
                  </Link>
                  <div className="shop-list-body">
                    <p className="shop-card-brand">{product.brand}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="shop-card-name">{product.name}</h3>
                    </Link>
                    <div className="shop-card-rating">
                      <span className="shop-rating-badge">{product.rating} ★</span>
                      <span className="shop-rating-count">({product.reviews.toLocaleString()} reviews)</span>
                    </div>
                    <p className="shop-list-category">{product.category}</p>
                  </div>
                  <div className="shop-list-right">
                    <div className="shop-card-price">
                      <span className="shop-price-current">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="shop-price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      <span className="shop-price-discount">{product.discount}% off</span>
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
