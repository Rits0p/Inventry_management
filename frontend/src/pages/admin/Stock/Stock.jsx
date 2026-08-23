import { useState, useEffect } from 'react';
import './Stock.css';
import { productService } from '../../../services/productService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const LOW_STOCK_THRESHOLD = 10;

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustType, setAdjustType] = useState('add');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const [adjustError, setAdjustError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productService.getProducts({ page_size: 50 });
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
  }, [reloadKey]);

  const getStockLevel = (p) => {
    if ((p.stock ?? 0) === 0) return 'out';
    if (p.stock <= LOW_STOCK_THRESHOLD) return 'low';
    return 'in';
  };

  let filteredProducts = products.filter(p => {
    const q = search.toLowerCase();
    const matchCategory = category === 'All' || p.category_name === category;
    const matchSearch = (p.name || '').toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q);
    let matchStatus = true;
    const level = getStockLevel(p);
    if (status === 'In Stock') matchStatus = level === 'in';
    else if (status === 'Low Stock') matchStatus = level === 'low';
    else if (status === 'Out of Stock') matchStatus = level === 'out';
    return matchCategory && matchSearch && matchStatus;
  });

  if (sortBy === 'stock-low') filteredProducts = [...filteredProducts].sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
  else if (sortBy === 'stock-high') filteredProducts = [...filteredProducts].sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));
  else filteredProducts = [...filteredProducts].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => getStockLevel(p) === 'low').length;
  const outOfStockCount = products.filter(p => getStockLevel(p) === 'out').length;

  const openAdjust = (product) => {
    setSelectedProduct(product);
    setAdjustType('add');
    setAdjustQty('');
    setAdjustError('');
  };

  const handleAdjust = async () => {
    if (!selectedProduct || adjusting) return;
    setAdjusting(true);
    setAdjustError('');
    try {
      await productService.adjustStock(selectedProduct.id, adjustType, Number(adjustQty));
      setSelectedProduct(null);
      setReloadKey(key => key + 1);
    } catch (err) {
      setAdjustError(getApiErrorMessage(err, 'Failed to adjust stock.'));
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <main className="admin-page dark:bg-[#0e0e14]">
      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="admin-title dark:text-white">Stock Management</h1>
            <p className="admin-subtitle dark:text-gray-400">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stock-stats">
          <div className="stock-stat-card dark:bg-[#1a1a24]">
            <span className="stock-stat-icon">📦</span>
            <div>
              <p className="stock-stat-value dark:text-white">{totalProducts}</p>
              <p className="stock-stat-label dark:text-gray-400">Total Products</p>
            </div>
          </div>
          <div className="stock-stat-card warning dark:bg-[#1a1a24]">
            <span className="stock-stat-icon">⚠️</span>
            <div>
              <p className="stock-stat-value dark:text-white">{lowStockCount}</p>
              <p className="stock-stat-label dark:text-gray-400">Low Stock</p>
            </div>
          </div>
          <div className="stock-stat-card danger dark:bg-[#1a1a24]">
            <span className="stock-stat-icon">🚫</span>
            <div>
              <p className="stock-stat-value dark:text-white">{outOfStockCount}</p>
              <p className="stock-stat-label dark:text-gray-400">Out of Stock</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-filters-card dark:bg-[#1a1a24]">
          <div className="stock-filters">
            <div className="admin-search-box">
              <span className="admin-search-icon">🔍</span>
              <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" />
            </div>
            <div className="stock-filter-pills">
              {['All', 'Electronics', 'Fashion', 'Home & Kitchen'].map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`stock-pill ${category === cat ? 'active' : ''}`}>{cat}</button>
              ))}
            </div>
            <div className="stock-selects">
              <select value={status} onChange={e => setStatus(e.target.value)} className="admin-select">
                <option value="All">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="admin-select">
                <option value="name">Sort: Name</option>
                <option value="stock-low">Sort: Stock Low→High</option>
                <option value="stock-high">Sort: Stock High→Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-card dark:bg-[#1a1a24]">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">
                      <LoadingSpinner label="Loading products..." />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="admin-empty">
                      <span className="admin-empty-icon">⚠️</span>
                      <p>{error}</p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-empty">
                      <span className="admin-empty-icon">📦</span>
                      <p>No products found</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-cell">
                          <span className="admin-product-icon">
                            {product.image ? (
                              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                            ) : (
                              (product.name || '📦').charAt(0)
                            )}
                          </span>
                          <div>
                            <span className="admin-product-name">{product.name}</span>
                            <span className="admin-product-brand">{product.brand || ''}</span>
                          </div>
                        </div>
                      </td>
                      <td className="admin-sku">{product.sku || '—'}</td>
                      <td>{product.category_name || '—'}</td>
                      <td>
                        <span className={`stock-qty ${getStockLevel(product)}`}>{product.stock ?? 0}</span>
                      </td>
                      <td>
                        <span className={`stock-badge ${getStockLevel(product)}`}>
                          {getStockLevel(product) === 'out' ? 'Out of Stock' : getStockLevel(product) === 'low' ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => openAdjust(product)} className="stock-adjust-btn">Adjust</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Adjust Modal */}
        {selectedProduct && (
          <div className="admin-modal-overlay" onClick={() => { if (!adjusting) setSelectedProduct(null); }}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h3 className="admin-modal-title">Adjust Stock</h3>
              <div className="stock-adjust-preview">
                <span className="stock-adjust-preview-icon">
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                  ) : (
                    (selectedProduct.name || '📦').charAt(0)
                  )}
                </span>
                <div>
                  <p className="stock-adjust-preview-name">{selectedProduct.name}</p>
                  <p className="stock-adjust-preview-current">Current stock: <strong>{selectedProduct.stock ?? 0}</strong></p>
                </div>
              </div>
              <div className="stock-adjust-types">
                {['add', 'remove', 'set'].map(type => (
                  <button key={type} onClick={() => setAdjustType(type)} disabled={adjusting} className={`stock-adjust-type ${adjustType === type ? 'active' : ''}`}>
                    {type === 'add' ? '+ Add' : type === 'remove' ? '- Remove' : '= Set'}
                  </button>
                ))}
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Quantity</label>
                <input type="number" min="0" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} placeholder="Enter quantity" className="admin-input" autoFocus />
              </div>
              {adjustError && <p className="admin-modal-text">{adjustError}</p>}
              <div className="admin-modal-actions">
                <button onClick={() => setSelectedProduct(null)} disabled={adjusting} className="admin-modal-btn cancel">Cancel</button>
                <button onClick={handleAdjust} disabled={!adjustQty || Number(adjustQty) < 0 || adjusting} className="admin-modal-btn confirm">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
