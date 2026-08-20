import React, { useState } from 'react';
import './Categories.css';

const initialCategories = [
  { id: 1, name: 'Electronics', slug: 'electronics', products: 342, status: 'Active', color: '#3b82f6', icon: '💻' },
  { id: 2, name: 'Fashion', slug: 'fashion', products: 218, status: 'Active', color: '#8b5cf6', icon: '👗' },
  { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen', products: 156, status: 'Active', color: '#f59e0b', icon: '🏠' },
  { id: 4, name: 'Books', slug: 'books', products: 89, status: 'Active', color: '#10b981', icon: '📚' },
  { id: 5, name: 'Sports & Fitness', slug: 'sports-fitness', products: 64, status: 'Inactive', color: '#ef4444', icon: '⚽' },
  { id: 6, name: 'Beauty & Personal Care', slug: 'beauty', products: 112, status: 'Active', color: '#ec4899', icon: '💄' },
];

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', status: 'Active' });

  const filtered = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', status: 'Active' });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, status: category.status });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id ? { ...cat, name: formData.name, status: formData.status } : cat
      ));
    } else {
      const newCategory = {
        id: Date.now(),
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        products: 0,
        status: formData.status,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
        icon: '📁',
      };
      setCategories([newCategory, ...categories]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setCategories(categories.filter(cat => cat.id !== showDeleteModal));
    setShowDeleteModal(null);
  };

  return (
    <main className="admin-page dark:bg-[#0e0e14]">
      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="admin-title dark:text-white">Categories</h1>
            <p className="admin-subtitle dark:text-gray-400">{filtered.length} categor{filtered.length !== 1 ? 'ies' : 'y'} found</p>
          </div>
          <button onClick={openAddModal} className="admin-add-btn">
            <span>+</span> Add Category
          </button>
        </header>

        {/* Search */}
        <div className="admin-filters-card dark:bg-[#1a1a24]">
          <div className="admin-filters-row">
            <div className="admin-search-box">
              <span className="admin-search-icon">🔍</span>
              <input type="text" placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="categories-grid">
          {filtered.length === 0 ? (
            <div className="admin-empty-card">
              <span className="admin-empty-icon">📂</span>
              <p>No categories found</p>
            </div>
          ) : (
            filtered.map(cat => (
              <div key={cat.id} className="category-card" style={{ '--cat-color': cat.color }}>
                <div className="category-card-header">
                  <span className="category-icon">{cat.icon}</span>
                  <span className={`category-status ${cat.status.toLowerCase()}`}>{cat.status}</span>
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-slug">/{cat.slug}</p>
                <p className="category-count">{cat.products} products</p>
                <div className="category-actions">
                  <button onClick={() => openEditModal(cat)} className="cat-action-btn edit">Edit</button>
                  <button onClick={() => setShowDeleteModal(cat.id)} className="cat-action-btn delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h3 className="admin-modal-title">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <form onSubmit={handleSubmit} className="admin-modal-form">
                <div className="admin-form-group">
                  <label className="admin-label">Category Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Electronics" className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="admin-select-full">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="admin-modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="admin-modal-btn cancel">Cancel</button>
                  <button type="submit" className="admin-modal-btn confirm">{editingCategory ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(null)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h3 className="admin-modal-title">Delete Category</h3>
              <p className="admin-modal-text">Are you sure you want to delete this category? This action cannot be undone.</p>
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
