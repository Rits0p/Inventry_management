import React, { useState } from 'react';
import './Stock.css';

const allProducts = [
  { id: 1, name: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', sku: 'WH-1000XM5', category: 'Electronics', stock: 12, lowStockThreshold: 15, icon: '🎧' },
  { id: 2, name: 'Apple Watch Series 9 GPS 45mm', brand: 'Apple', sku: 'AW-S9-45', category: 'Electronics', stock: 4, lowStockThreshold: 10, icon: '⌚' },
  { id: 3, name: 'Nike Air Force 1 Low White', brand: 'Nike', sku: 'NK-AF1-WHT', category: 'Fashion', stock: 0, lowStockThreshold: 8, icon: '👟' },
  { id: 4, name: 'Logitech MX Master 3S Mouse', brand: 'Logitech', sku: 'LG-MX3S', category: 'Electronics', stock: 28, lowStockThreshold: 12, icon: '🖱️' },
  { id: 5, name: 'Instant Pot Duo 7-in-1 Cooker', brand: 'Instant Pot', sku: 'IP-DUO-6L', category: 'Home & Kitchen', stock: 7, lowStockThreshold: 10, icon: '🍲' },
  { id: 6, name: 'Samsung 25W PD Power Adapter', brand: 'Samsung', sku: 'SS-25W-PD', category: 'Electronics', stock: 45, lowStockThreshold: 20, icon: '🔌' },
  { id: 7, name: 'Cotton Crew Neck T-Shirt Pack', brand: 'Roadster', sku: 'RD-TS-3PK', category: 'Fashion', stock: 2, lowStockThreshold: 15, icon: '👕' },
  { id: 8, name: 'Milton Thermosteel Bottle 1L', brand: 'Milton', sku: 'ML-TS-1L', category: 'Home & Kitchen', stock: 63, lowStockThreshold: 25, icon: '🍶' },
];

export default function Stock() {
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustType, setAdjustType] = useState('add');
  const [adjustQty, setAdjustQty] = useState('');

  let products = allProducts.filter(p => {
    const matchCategory = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    let matchStatus = true;
    if (status === 'In Stock') matchStatus = p.stock > p.lowStockThreshold;
    else if (status === 'Low Stock') matchStatus = p.stock > 0 && p.stock <= p.lowStockThreshold;
    else if (status === 'Out of Stock') matchStatus = p.stock === 0;
    return matchCategory && matchSearch && matchStatus;
  });

  if (sortBy === 'stock-low') products = [...products].sort((a, b) => a.stock - b.stock);
  else if (sortBy === 'stock-high') products = [...products].sort((a, b) => b.stock - a.stock);
  else products = [...products].sort((a, b) => a.name.localeCompare(b.name));

  const totalProducts = allProducts.length;
  const lowStockCount = allProducts.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = allProducts.filter(p => p.stock === 0).length;

  const getStockLevel = (p) => {
    if (p.stock === 0) return 'out';
    if (p.stock <= p.lowStockThreshold) return 'low';
    return 'in';
  };

  const openAdjust = (product) => {
    setSelectedProduct(product);
    setAdjustType('add');
    setAdjustQty('');
  };

  const handleAdjust = () => {
    console.log({ productId: selectedProduct.id, type: adjustType, quantity: Number(adjustQty) });
    setSelectedProduct(null);
  };

  return (
    <main className="admin-page dark:bg-[#0e0e14]">
      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="admin-title dark:text-white">Stock Management</h1>
            <p className="admin-subtitle dark:text-gray-400">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
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
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-empty">
                      <span className="admin-empty-icon">📦</span>
                      <p>No products found</p>
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-cell">
                          <span className="admin-product-icon">{product.icon}</span>
                          <div>
                            <span className="admin-product-name">{product.name}</span>
                            <span className="admin-product-brand">{product.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="admin-sku">{product.sku}</td>
                      <td>{product.category}</td>
                      <td>
                        <span className={`stock-qty ${getStockLevel(product)}`}>{product.stock}</span>
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
          <div className="admin-modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h3 className="admin-modal-title">Adjust Stock</h3>
              <div className="stock-adjust-preview">
                <span className="stock-adjust-preview-icon">{selectedProduct.icon}</span>
                <div>
                  <p className="stock-adjust-preview-name">{selectedProduct.name}</p>
                  <p className="stock-adjust-preview-current">Current stock: <strong>{selectedProduct.stock}</strong></p>
                </div>
              </div>
              <div className="stock-adjust-types">
                {['add', 'remove', 'set'].map(type => (
                  <button key={type} onClick={() => setAdjustType(type)} className={`stock-adjust-type ${adjustType === type ? 'active' : ''}`}>
                    {type === 'add' ? '+ Add' : type === 'remove' ? '- Remove' : '= Set'}
                  </button>
                ))}
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Quantity</label>
                <input type="number" min="0" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} placeholder="Enter quantity" className="admin-input" autoFocus />
              </div>
              <div className="admin-modal-actions">
                <button onClick={() => setSelectedProduct(null)} className="admin-modal-btn cancel">Cancel</button>
                <button onClick={handleAdjust} disabled={!adjustQty || Number(adjustQty) < 0} className="admin-modal-btn confirm">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
