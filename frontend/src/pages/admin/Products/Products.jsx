import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Temporary mock data – replace with real API later
const initialProducts = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Wireless Headphones',
    sku: 'SNY-WH1000XM5',
    category: 'Electronics',
    price: 29990,
    stock: 48,
    status: 'Active',
    image: 'https://via.placeholder.com/64',
  },
  {
    id: 2,
    name: 'Apple Watch Series 9 GPS 45mm',
    sku: 'APL-WATCH-S9',
    category: 'Electronics',
    price: 41900,
    stock: 15,
    status: 'Active',
    image: 'https://via.placeholder.com/64',
  },
  {
    id: 3,
    name: 'Nike Air Force 1 Low White',
    sku: 'NK-AF1-WHT',
    category: 'Fashion',
    price: 7495,
    stock: 0,
    status: 'Inactive',
    image: 'https://via.placeholder.com/64',
  },
  {
    id: 4,
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    sku: 'IP-DUO-7IN1',
    category: 'Home & Kitchen',
    price: 8999,
    stock: 32,
    status: 'Active',
    image: 'https://via.placeholder.com/64',
  },
  {
    id: 5,
    name: 'Logitech MX Master 3S Wireless Mouse',
    sku: 'LOG-MX3S',
    category: 'Electronics',
    price: 8995,
    stock: 7,
    status: 'Active',
    image: 'https://via.placeholder.com/64',
  },
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  // Filtering
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    const matchStatus = status === 'All' || p.status === status;
    return matchSearch && matchCategory && matchStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="text-red-600 font-medium">Out of stock</span>;
    if (stock <= 10) return <span className="text-orange-600 font-medium">{stock} left</span>;
    return <span className="text-green-600 font-medium">{stock} in stock</span>;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FB641B] hover:bg-[#e55a15] text-white text-sm font-medium rounded-sm shadow-sm transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add a product
        </Link>
      </div>

      {/* Search + Filters (Amazon style bar) */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0] focus:border-[#2874F0]"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
          >
            <option value="All">All categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
          >
            <option value="All">All status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table (Amazon-style) */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-5 py-3.5 font-medium text-gray-600 w-16">Image</th>
                <th className="px-5 py-3.5 font-medium text-gray-600 min-w-[280px]">Product details</th>
                <th className="px-5 py-3.5 font-medium text-gray-600">SKU</th>
                <th className="px-5 py-3.5 font-medium text-gray-600">Price</th>
                <th className="px-5 py-3.5 font-medium text-gray-600">Stock</th>
                <th className="px-5 py-3.5 font-medium text-gray-600">Status</th>
                <th className="px-5 py-3.5 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="font-medium">No products found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    {/* Image */}
                    <td className="px-5 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded border border-gray-200"
                      />
                    </td>

                    {/* Product details */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900 line-clamp-2 max-w-xs">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{product.category}</div>
                    </td>

                    {/* SKU */}
                    <td className="px-5 py-4 text-gray-600 font-mono text-xs">
                      {product.sku}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 font-medium text-gray-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      {getStockBadge(product.stock)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.status === 'Active'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="text-[#2874F0] hover:text-blue-700 font-medium text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Simple Pagination (Amazon style) */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filtered.length}</span> of{' '}
              <span className="font-medium">{products.length}</span> products
            </p>
            <div className="flex gap-2">
              <button
                disabled
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-sm bg-white text-gray-400 cursor-not-allowed"
              >
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-sm bg-white text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
