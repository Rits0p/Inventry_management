import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// Mock product – in real app, fetch by ID from params
const product = {
  id: 1,
  name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
  brand: 'Sony',
  price: 29990,
  originalPrice: 34990,
  discount: 14,
  rating: 4.7,
  reviews: 2841,
  stock: 48,
  sku: 'SNY-WH1000XM5',
  category: 'Electronics',
  images: [
    'https://via.placeholder.com/500',
    'https://via.placeholder.com/500/eee',
    'https://via.placeholder.com/500/ddd',
  ],
  highlights: [
    'Industry-leading noise cancellation',
    'Up to 30 hours battery life',
    'Multipoint connection',
    'Speak-to-Chat technology',
    'Lightweight design (250g)',
  ],
  description:
    'The WH-1000XM5 headphones rewrite the rules for distraction-free listening. With eight microphones, Auto NC Optimizer and specially developed driver units, they offer an unprecedented level of noise cancellation and call quality.',
  specifications: [
    { label: 'Brand', value: 'Sony' },
    { label: 'Model', value: 'WH-1000XM5' },
    { label: 'Color', value: 'Black' },
    { label: 'Connectivity', value: 'Bluetooth 5.2' },
    { label: 'Battery Life', value: 'Up to 30 hours' },
    { label: 'Weight', value: '250 g' },
  ],
};

export default function ProductDetail() {
  const { id } = useParams(); // for real routing
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    // TODO: call cart service
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link to="/" className="hover:text-[#2874F0]">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/" className="hover:text-[#2874F0]">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-sm p-4 flex items-center justify-center">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="max-h-[420px] object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 border-2 rounded-sm overflow-hidden ${
                  selectedImage === idx ? 'border-[#2874F0]' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-[#2874F0] font-medium">{product.brand}</p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded">
                {product.rating} ★
              </span>
              <span className="text-sm text-gray-500">
                {product.reviews.toLocaleString()} ratings
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-lg text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-lg font-medium text-green-600">
              {product.discount}% off
            </span>
          </div>

          {/* Stock */}
          <p className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
            {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                −
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-[#FB641B] hover:bg-[#e55a15] text-white font-semibold rounded-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              {addedToCart ? (
                <>✓ Added to Cart</>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
            <button className="flex-1 py-3.5 bg-[#2874F0] hover:bg-blue-700 text-white font-semibold rounded-sm transition">
              Buy Now
            </button>
          </div>

          {/* Highlights */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Highlights</h3>
            <ul className="space-y-2">
              {product.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Description + Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
          <table className="w-full text-sm">
            <tbody>
              {product.specifications.map((spec, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0">
                  <td className="py-2.5 text-gray-500 w-1/3">{spec.label}</td>
                  <td className="py-2.5 text-gray-900 font-medium">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
