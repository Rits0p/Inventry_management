import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './AddProduct.css';

const mockProduct = {
  1: { name: 'Sony WH-1000XM5 Wireless Headphones', sku: 'SNY-WH1000XM5', category: 'Electronics', price: 29990, stock: 48, description: 'Industry-leading noise cancellation with Auto NC Optimizer.', status: 'Active' },
  2: { name: 'Apple Watch Series 9 GPS 45mm', sku: 'APL-WATCH-S9', category: 'Electronics', price: 41900, stock: 15, description: 'GPS model with always-on Retina display.', status: 'Active' },
  3: { name: 'Nike Air Force 1 Low White', sku: 'NK-AF1-WHT', category: 'Fashion', price: 7495, stock: 0, description: 'Classic silhouette with premium leather upper.', status: 'Inactive' },
  4: { name: 'Instant Pot Duo 7-in-1 Cooker', sku: 'IP-DUO-7IN1', category: 'Home & Kitchen', price: 8999, stock: 32, description: 'Multi-use programmable pressure cooker.', status: 'Active' },
  5: { name: 'Logitech MX Master 3S Mouse', sku: 'LOG-MX3S', category: 'Electronics', price: 8995, stock: 7, description: 'Quiet clicks and 8K DPI track-on-glass sensor.', status: 'Active' },
};

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(
    isEdit && mockProduct[id]
      ? mockProduct[id]
      : {
          name: '',
          sku: '',
          category: '',
          price: '',
          stock: '',
          description: '',
          status: 'Active',
        }
  );

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product data:', formData);
    alert(isEdit ? 'Product updated (demo)' : 'Product created (demo)');
    navigate('/admin/products');
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
                  <label className="admin-label">Category *</label>
                  <select name="category" required value={formData.category} onChange={handleChange} className="admin-select-full">
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
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
                  <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} placeholder="0" className="admin-input" />
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
          </div>

          {/* Actions */}
          <div className="add-product-actions">
            <Link to="/admin/products" className="add-product-cancel">Cancel</Link>
            <button type="submit" className="add-product-submit">
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
