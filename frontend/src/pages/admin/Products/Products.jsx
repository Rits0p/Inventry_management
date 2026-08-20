import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Products.css';

const initialProducts = [
  { id: 1, name: 'Sony WH-1000XM5 Wireless Headphones', sku: 'SNY-WH1000XM5', category: 'Electronics', price: 29990, stock: 48, status: 'Active', icon: '🎧' },
  { id: 2, name: 'Apple Watch Series 9 GPS 45mm', sku: 'APL-WATCH-S9', category: 'Electronics', price: 41900, stock: 15, status: 'Active', icon: '⌚' },
  { id: 3, name: 'Nike Air Force 1 Low White', sku: 'NK-AF1-WHT', category: 'Fashion', price: 7495, stock: 0, status: 'Inactive', icon: '👟' },
  { id: 4, name: 'Instant Pot Duo 7-in-1 Pressure Cooker', sku: 'IP-DUO-7IN1', category: 'Home & Kitchen', price: 8999, stock: 32, status: 'Active', icon: '🍲' },
  { id: 5, name: 'Logitech MX Master 3S Wireless Mouse', sku: 'LOG-MX3S', category: 'Electronics', price: 8995, stock: 7, status: 'Active', icon: '🖱️' },
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    const matchStatus = status === 'All' || p.status === status;
    return matchSearch && matchCategory && matchStatus;
  });

  const handleDelete = () => {
    setProducts(products.filter(p => p.id !== showDeleteModal));
    setShowDeleteModal(null);
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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="admin-empty">
                      <span className="admin-empty-icon">📦</span>
                      <p>No products found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-cell">
                          <span className="admin-product-icon">{product.icon}</span>
                          <span className="admin-product-name">{product.name}</span>
                        </div>
                      </td>
                      <td className="admin-sku">{product.sku}</td>
                      <td>{product.category}</td>
                      <td className="admin-price">₹{product.price.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`admin-stock ${product.stock === 0 ? 'out' : product.stock <= 10 ? 'low' : 'in'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-status ${product.status.toLowerCase()}`}>{product.status}</span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link to={`/admin/products/edit/${product.id}`} className="admin-action-btn edit">Edit</Link>
                          <button onClick={() => setShowDeleteModal(product.id)} className="admin-action-btn delete">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(null)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h3 className="admin-modal-title">Delete Product</h3>
              <p className="admin-modal-text">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="admin-modal-actions">
                <button onClick={() => setShowDeleteModal(null)} className="admin-modal-btn cancel">Cancel</button>
                <button onClick={handleDelete} className="admin-modal-btn delete">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
