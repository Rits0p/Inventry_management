import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ProductCard – product tile used in the shop grid.
 *
 * Props:
 *   product: { id, name, brand, price, originalPrice, discount, rating, reviews, image, badge }
 *   onAddToCart (function) – called with the product when "Add to Cart" is clicked
 */
export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition group overflow-hidden">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full object-contain group-hover:scale-105 transition duration-300"
          />
        </div>
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
            ({product.reviews?.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              ₹{Number(product.originalPrice).toLocaleString('en-IN')}
            </span>
          )}
          {product.discount && (
            <span className="text-xs font-medium text-green-600">
              {product.discount}% off
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => onAddToCart?.(product)}
          className="w-full mt-2 py-2 text-sm font-medium border border-[#2874F0] text-[#2874F0] rounded-sm hover:bg-[#2874F0] hover:text-white transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
