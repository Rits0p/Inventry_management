import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import './AddProduct.css';

const EMPTY_FORM = {
  name: '',
  sku: '',
  brand: '',
  category: '',
  price: '',
  original_price: '',
  discount: '0',
  stock: '',
  description: '',
  highlights: '',
  specifications: [{ label: '', value: '' }],
  status: 'Active',
};

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    categoryService
      .getCategories()
      .then((data) => {
        if (!cancelled) setCategories(unwrapList(data));
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load categories.'));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    setLoading(true);
    productService
      .getProduct(id)
      .then((product) => {
        if (cancelled) return;
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          brand: product.brand || '',
          category: product.category ? String(product.category) : '',
          price: product.price ?? '',
          original_price: product.original_price ?? '',
          discount: product.discount ?? '0',
          stock: product.stock ?? '',
          description: product.description || '',
          highlights: Array.isArray(product.highlights) ? product.highlights.join('\n') : '',
          specifications: Array.isArray(product.specifications) && product.specifications.length > 0
            ? product.specifications
            : [{ label: '', value: '' }],
          status: product.status || 'Active',
        });
        setImagePreview(product.image || null);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load product.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (index, field, value) => {
    setFormData(prev => {
      const specs = [...prev.specifications];
      specs[index] = { ...specs[index], [field]: value };
      return { ...prev, specifications: specs };
    });
  };

  const addSpecRow = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }],
    }));
  };

  const removeSpecRow = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const buildPayload = () => {
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('sku', formData.sku);
    payload.append('brand', formData.brand);
    payload.append('category', formData.category);
    payload.append('price', formData.price);
    if (formData.original_price !== '' && formData.original_price !== null) {
      payload.append('original_price', formData.original_price);
    }
    payload.append('discount', formData.discount || 0);
    payload.append('stock', formData.stock);
    payload.append('description', formData.description);
    const highlightsList = formData.highlights
      .split('\n')
      .map(h => h.trim())
      .filter(Boolean);
    payload.append('highlights', JSON.stringify(highlightsList));
    const specsList = formData.specifications.filter(s => s.label.trim() && s.value.trim());
    payload.append('specifications', JSON.stringify(specsList));
    payload.append('status', formData.status);
    if (imageFile) payload.append('image', imageFile);
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = buildPayload();
      if (isEdit) await productService.updateProduct(id, payload);
      else await productService.createProduct(payload);
      navigate('/admin/products');
    } catch (err) {
      setError(getApiErrorMessage(err, isEdit ? 'Failed to update product.' : 'Failed to create product.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-page">
      <div className="add-product-container">
        {/* Header */}
        <header className="add-product-header">
          <div className="add-product-breadcrumb">
            <Link to="/admin/products" className="breadcrumb-link">Products</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{isEdit ? 'Edit Product' : 'Add Product'}</span>
          </div>
          <h1 className="admin-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="admin-subtitle">{isEdit ? 'Update product details below' : 'Fill in the details to create a new product listing'}</p>
        </header>

        {error && <div className="add-product-error">{error}</div>}

        {loading ? (
          <p className="admin-loading">Loading product…</p>
        ) : (
          <form onSubmit={handleSubmit} className="add-product-form">
            {/* Image Upload */}
            <div className="add-product-image-card">
              <div className="image-upload-area" onClick={() => document.getElementById('product-image').click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">
                    <span className="image-placeholder-icon">📷</span>
                    <p>Click to upload image</p>
                    <p className="image-placeholder-hint">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
              <input id="product-image" type="file" accept="image/*" onChange={handleImageChange} hidden />
            </div>

            {/* Form Fields */}
            <div className="add-product-fields">
              {/* Basic Info */}
              <div className="form-section">
                <h3 className="form-section-title">Basic Information</h3>
                <div className="form-grid">
                  <div className="admin-form-group full">
                    <label className="admin-label">Product Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Sony WH-1000XM5" className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">SKU *</label>
                    <input type="text" name="sku" required value={formData.sku} onChange={handleChange} placeholder="e.g. SNY-WH1000XM5" className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Brand</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Sony" className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Category *</label>
                    <select name="category" required value={formData.category} onChange={handleChange} className="admin-select-full">
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="form-section">
                <h3 className="form-section-title">Pricing & Stock</h3>
                <div className="form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Price (₹) *</label>
                    <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange} placeholder="0" className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">MRP (₹)</label>
                    <input type="number" name="original_price" min="0" step="0.01" value={formData.original_price} onChange={handleChange} placeholder="Optional – shown struck through" className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Discount (%)</label>
                    <input type="number" name="discount" min="0" max="100" value={formData.discount} onChange={handleChange} placeholder="0" className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Stock Quantity *</label>
                    <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} placeholder="0" className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="admin-select-full">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="form-section">
                <h3 className="form-section-title">Description</h3>
                <div className="admin-form-group full">
                  <textarea name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Product description..." className="admin-textarea" />
                </div>
              </div>

              {/* Highlights */}
              <div className="form-section">
                <h3 className="form-section-title">Highlights</h3>
                <div className="admin-form-group full">
                  <label className="admin-label">Key Features (one per line)</label>
                  <textarea
                    name="highlights"
                    rows="4"
                    value={formData.highlights}
                    onChange={handleChange}
                    placeholder="Enter one highlight per line, e.g.:&#10;Active Noise Cancellation&#10;30-hour battery life&#10;Premium comfort fit"
                    className="admin-textarea"
                  />
                </div>
              </div>

              {/* Specifications */}
              <div className="form-section">
                <h3 className="form-section-title">Specifications</h3>
                <div className="admin-form-group full">
                  <label className="admin-label">Technical Specifications</label>
                  {formData.specifications.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={e => handleSpecChange(idx, 'label', e.target.value)}
                        placeholder="Label (e.g. Weight)"
                        className="admin-input flex-1"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                        placeholder="Value (e.g. 250g)"
                        className="admin-input flex-1"
                      />
                      {formData.specifications.length > 1 && (
                        <button type="button" onClick={() => removeSpecRow(idx)}
                          className="text-red-500 hover:text-red-700 text-lg font-bold px-2">
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addSpecRow}
                    className="text-sm font-semibold text-[#2874F0] hover:underline mt-1">
                    + Add Specification
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="add-product-actions">
              <Link to="/admin/products" className="add-product-cancel">Cancel</Link>
              <button type="submit" className="add-product-submit" disabled={saving}>
                {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
