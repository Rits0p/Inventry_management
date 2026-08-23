import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Products.css';
import { productService } from '../../../services/productService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productService.getProducts({ page_size: 100 });
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

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = (p.name || '').toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q);
    const matchCategory = category === 'All' || p.category_name === category;
    const matchStatus = status === 'All' || p.is_active === (status === 'Active');
    return matchSearch && matchCategory && matchStatus;
  });

  const handleDelete = async () => {
    if (!showDeleteModal || deleting) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await productService.deleteProduct(showDeleteModal);
      setShowDeleteModal(null);
      setReloadKey(key => key + 1);
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, 'Failed to delete product.'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="admin-page dark:bg-[#0e0e14]">
      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="admin-title dark:text-white">Products</h1>
            <p className="admin-subtitle dark:text-gray-400">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          <Link to="/admin/products/add" className="admin-add-btn">
            <span>+</span> Add Product
          </Link>
        </header>

        {/* Filters */}
        <div className="admin-filters-card dark:bg-[#1a1a24]">
          <div className="admin-filters-row">
            <div className="admin-search-box">
              <span className="admin-search-icon">🔍</span>
              <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="admin-select">
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
            </select>
            <select value={status} onChange={e => setStatus(e.target.value)} className="admin-select">
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7">
                      <LoadingSpinner label="Loading products..." />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="admin-empty">
                      <span className="admin-empty-icon">⚠️</span>
                      <p>{error}</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="admin-empty">
                      <span className="admin-empty-icon">📦</span>
                      <p>No products found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(product => {
                    const statusLabel = product.is_active ? 'Active' : 'Inactive';
                    return (
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
                            <span className="admin-product-name">{product.name}</span>
                          </div>
                        </td>
                        <td className="admin-sku">{product.sku || '—'}</td>
                        <td>{product.category_name || '—'}</td>
                        <td className="admin-price">₹{Number(product.price ?? 0).toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`admin-stock ${product.stock === 0 ? 'out' : product.stock <= 10 ? 'low' : 'in'}`}>
                            {product.stock ?? 0}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-status ${statusLabel.toLowerCase()}`}>{statusLabel}</span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <Link to={`/admin/products/edit/${product.id}`} className="admin-action-btn edit">Edit</Link>
                            <button onClick={() => { setDeleteError(''); setShowDeleteModal(product.id); }} className="admin-action-btn delete">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="admin-modal-overlay" onClick={() => { if (!deleting) setShowDeleteModal(null); }}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h3 className="admin-modal-title">Delete Product</h3>
              <p className="admin-modal-text">Are you sure you want to delete this product? This action cannot be undone.</p>
              {deleteError && <p className="admin-modal-text">{deleteError}</p>}
              <div className="admin-modal-actions">
                <button onClick={() => setShowDeleteModal(null)} disabled={deleting} className="admin-modal-btn cancel">Cancel</button>
                <button onClick={handleDelete} disabled={deleting} className="admin-modal-btn delete">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
