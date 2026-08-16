import React, { useState } from 'react';

// Mock products – replace with real API later
const allProducts = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    sku: 'WH-1000XM5',
    category: 'Electronics',
    stock: 12,
    lowStockThreshold: 15,
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 2,
    name: 'Apple Watch Series 9 GPS 45mm Midnight Aluminium',
    brand: 'Apple',
    sku: 'AW-S9-45-MID',
    category: 'Electronics',
    stock: 4,
    lowStockThreshold: 10,
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 3,
    name: 'Nike Air Force 1 Low White Sneakers',
    brand: 'Nike',
    sku: 'NK-AF1-WHT',
    category: 'Fashion',
    stock: 0,
    lowStockThreshold: 8,
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 4,
    name: 'Logitech MX Master 3S Wireless Mouse',
    brand: 'Logitech',
    sku: 'LG-MX3S',
    category: 'Electronics',
    stock: 28,
    lowStockThreshold: 12,
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 5,
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker 6 Litre',
    brand: 'Instant Pot',
    sku: 'IP-DUO-6L',
    category: 'Home & Kitchen',
    stock: 7,
    lowStockThreshold: 10,
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 6,
    name: 'Samsung 25W PD Power Adapter Type-C',
    brand: 'Samsung',
    sku: 'SS-25W-PD',
    category: 'Electronics',
    stock: 45,
    lowStockThreshold: 20,
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 7,
    name: 'Cotton Crew Neck T-Shirt (Pack of 3)',
    brand: 'Roadster',
    sku: 'RD-TS-3PK',
    category: 'Fashion',
    stock: 2,
    lowStockThreshold: 15,
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 8,
    name: 'Milton Thermosteel Water Bottle 1 Litre',
    brand: 'Milton',
    sku: 'ML-TS-1L',
    category: 'Home & Kitchen',
    stock: 63,
    lowStockThreshold: 25,
    image: 'https://via.placeholder.com/80',
  },
];

export default function Stock() {
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustType, setAdjustType] = useState('add');
  const [adjustQty, setAdjustQty] = useState('');

  // Filtering
  let products = allProducts.filter((p) => {
    const matchCategory = category === 'All' || p.category === category;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    let matchStatus = true;
    if (status === 'In Stock') matchStatus = p.stock > p.lowStockThreshold;
    else if (status === 'Low Stock')
      matchStatus = p.stock > 0 && p.stock <= p.lowStockThreshold;
    else if (status === 'Out of Stock') matchStatus = p.stock === 0;

    return matchCategory && matchSearch && matchStatus;
  });

  // Sorting
  if (sortBy === 'stock-low') {
    products = [...products].sort((a, b) => a.stock - b.stock);
  } else if (sortBy === 'stock-high') {
    products = [...products].sort((a, b) => b.stock - a.stock);
  } else {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  }

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen'];
  const statusOptions = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  const totalProducts = allProducts.length;
  const lowStockCount = allProducts.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  ).length;
  const outOfStockCount = allProducts.filter((p) => p.stock === 0).length;

  const getStatusBadge = (product) => {
    if (product.stock === 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
          Out of Stock
        </span>
      );
    }
    if (product.stock <= product.lowStockThreshold) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
        In Stock
      </span>
    );
  };

  const openAdjust = (product) => {
    setSelectedProduct(product);
    setAdjustType('add');
    setAdjustQty('');
  };

  const closeAdjust = () => {
    setSelectedProduct(null);
    setAdjustQty('');
  };

  const handleAdjust = () => {
    console.log({
      productId: selectedProduct.id,
      type: adjustType,
      quantity: Number(adjustQty),
    });
    closeAdjust();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
          <p className="text-sm text-gray-500">Low Stock</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{outOfStockCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search by name, brand or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
          />

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    category === cat
                      ? 'bg-[#2874F0] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
                >
                  <option value="name">Name</option>
                  <option value="stock-low">Stock: Low to High</option>
                  <option value="stock-high">Stock: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-16 text-center">
          <div className="text-5xl mb-3">📦</div>
          <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-1">Try changing filters or search term</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">SKU</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Stock</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-contain rounded bg-gray-50"
                        />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      {product.sku}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold ${
                          product.stock === 0
                            ? 'text-red-600'
                            : product.stock <= product.lowStockThreshold
                            ? 'text-amber-600'
                            : 'text-green-600'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(product)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openAdjust(product)}
                        className="px-3 py-1.5 text-sm font-medium border border-[#2874F0] text-[#2874F0] rounded-sm hover:bg-[#2874F0] hover:text-white transition"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Adjust Stock</h2>
              <button
                onClick={closeAdjust}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <p className="font-medium text-gray-900 text-sm line-clamp-1">
                    {selectedProduct.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Current stock:{' '}
                    <span className="font-semibold text-gray-800">
                      {selectedProduct.stock}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {['add', 'remove', 'set'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setAdjustType(type)}
                    className={`flex-1 py-2 text-sm font-medium rounded-sm border transition ${
                      adjustType === type
                        ? 'bg-[#2874F0] text-white border-[#2874F0]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type === 'add' ? 'Add' : type === 'remove' ? 'Remove' : 'Set Exact'}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeAdjust}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-sm hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjust}
                disabled={!adjustQty || Number(adjustQty) < 0}
                className="px-4 py-2 text-sm font-medium text-white bg-[#2874F0] rounded-sm hover:bg-[#1a5dc8] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
