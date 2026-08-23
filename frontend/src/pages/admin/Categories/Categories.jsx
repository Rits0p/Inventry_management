import { useState, useEffect } from 'react';
import './Categories.css';
import { categoryService } from '../../../services/categoryService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const CARD_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];
const CARD_ICONS = ['📁', '🗂️', '🏷️'];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', status: 'Active' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await categoryService.getCategories({ page_size: 100 });
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
  }, [reloadKey]);

  const filtered = categories.filter(cat =>
    (cat.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', status: 'Active' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name || '', status: category.status || 'Active' });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || submitting) return;
    setSubmitting(true);
    setFormError('');
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, { name: formData.name.trim() });
      } else {
        await categoryService.createCategory({ name: formData.name.trim() });
      }
      setShowModal(false);
      setReloadKey(key => key + 1);
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Failed to save category.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteModal || deleting) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await categoryService.deleteCategory(showDeleteModal);
      setShowDeleteModal(null);
      setReloadKey(key => key + 1);
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, 'Failed to delete category.'));
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
          {loading ? (
            <LoadingSpinner label="Loading categories..." />
          ) : error ? (
            <div className="admin-empty-card">
              <span className="admin-empty-icon">⚠️</span>
              <p>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty-card">
              <span className="admin-empty-icon">📂</span>
              <p>No categories found</p>
            </div>
          ) : (
            filtered.map(cat => {
              const color = cat.color || CARD_COLORS[Math.abs(cat.id) % CARD_COLORS.length];
              const icon = CARD_ICONS[Math.abs(cat.id) % CARD_ICONS.length];
              const statusLabel = cat.status || 'Active';
              return (
                <div key={cat.id} className="category-card" style={{ '--cat-color': color }}>
                  <div className="category-card-header">
                    <span className="category-icon">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                      ) : (
                        icon
                      )}
                    </span>
                    <span className={`category-status ${statusLabel.toLowerCase()}`}>{statusLabel}</span>
                  </div>
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-slug">/{cat.slug || (cat.name || '').toLowerCase().replace(/\s+/g, '-')}</p>
                  <p className="category-count">{cat.product_count ?? 0} products</p>
                  <div className="category-actions">
                    <button onClick={() => openEditModal(cat)} className="cat-action-btn edit">Edit</button>
                    <button onClick={() => { setDeleteError(''); setShowDeleteModal(cat.id); }} className="cat-action-btn delete">Delete</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="admin-modal-overlay" onClick={() => { if (!submitting) setShowModal(false); }}>
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
                {formError && <p className="admin-modal-text">{formError}</p>}
                <div className="admin-modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} disabled={submitting} className="admin-modal-btn cancel">Cancel</button>
                  <button type="submit" disabled={submitting} className="admin-modal-btn confirm">{editingCategory ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="admin-modal-overlay" onClick={() => { if (!deleting) setShowDeleteModal(null); }}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h3 className="admin-modal-title">Delete Category</h3>
              <p className="admin-modal-text">Are you sure you want to delete this category? This action cannot be undone.</p>
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
