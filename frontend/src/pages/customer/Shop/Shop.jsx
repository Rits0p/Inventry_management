import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock products – replace with real API later
const allProducts = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    rating: 4.7,
    reviews: 2841,
    image: 'https://via.placeholder.com/300',
    category: 'Electronics',
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Apple Watch Series 9 GPS 45mm Midnight Aluminium',
    brand: 'Apple',
    price: 41900,
    originalPrice: 44900,
    discount: 7,
    rating: 4.8,
    reviews: 1520,
    image: 'https://via.placeholder.com/300',
    category: 'Electronics',
    badge: null,
  },
  {
    id: 3,
    name: 'Nike Air Force 1 Low White Sneakers',
    brand: 'Nike',
    price: 7495,
    originalPrice: 7995,
    discount: 6,
    rating: 4.5,
    reviews: 932,
    image: 'https://via.placeholder.com/300',
    category: 'Fashion',
    badge: null,
  },
  {
    id: 4,
    name: 'Logitech MX Master 3S Wireless Mouse',
    brand: 'Logitech',
    price: 8995,
    originalPrice: 10995,
    discount: 18,
    rating: 4.6,
    reviews: 2103,
    image: 'https://via.placeholder.com/300',
    category: 'Electronics',
    badge: 'Top Rated',
  },
  {
    id: 5,
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker 6 Litre',
    brand: 'Instant Pot',
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    rating: 4.4,
    reviews: 1876,
    image: 'https://via.placeholder.com/300',
    category: 'Home & Kitchen',
    badge: null,
  },
  {
    id: 6,
    name: 'Samsung 25W PD Power Adapter Type-C',
    brand: 'Samsung',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    rating: 4.3,
    reviews: 5402,
    image: 'https://via.placeholder.com/300',
    category: 'Electronics',
    badge: null,
  },
  {
    id: 7,
    name: 'Cotton Crew Neck T-Shirt (Pack of 3)',
    brand: 'Roadster',
    price: 899,
    originalPrice: 1499,
    discount: 40,
    rating: 4.2,
    reviews: 3201,
    image: 'https://via.placeholder.com/300',
    category: 'Fashion',
    badge: 'Deal of the Day',
  },
  {
    id: 8,
    name: 'Milton Thermosteel Water Bottle 1 Litre',
    brand: 'Milton',
    price: 599,
    originalPrice: 799,
    discount: 25,
    rating: 4.5,
    reviews: 8900,
    image: 'https://via.placeholder.com/300',
    category: 'Home & Kitchen',
    badge: null,
  },
];

export default function Shop() {
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [search, setSearch] = useState('');

  // Filtering + Sorting
  let products = allProducts.filter((p) => {
    const matchCategory = category === 'All' || p.category === category;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (sortBy === 'price-low') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'discount') {
    products = [...products].sort((a, b) => b.discount - a.discount);
  }
  // popularity = default order

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen'];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Categories */}
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

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-16 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-1">Try changing the category or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition group overflow-hidden"
            >
              {/* Image */}
              <Link to={`/product/${product.id}`} className="block relative">
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-2 left-2 bg-[#FB641B] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                    {product.badge}
                  </span>
                )}
              </Link>

              {/* Info */}
              <div className="p-3 space-y-1.5">
                <p className="text-xs text-gray-500 font-medium">{product.brand}</p>

                <Link to={`/product/${product.id}`}>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug hover:text-[#2874F0] transition">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-600 text-white text-[11px] font-medium rounded">
                    {product.rating} ★
                  </span>
                  <span className="text-xs text-gray-500">
                    ({product.reviews.toLocaleString()})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-base font-bold text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-medium text-green-600">
                    {product.discount}% off
                  </span>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => alert(`Added ${product.name} to cart`)}
                  className="w-full mt-2 py-2 text-sm font-medium border border-[#2874F0] text-[#2874F0] rounded-sm hover:bg-[#2874F0] hover:text-white transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
