import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialCart = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Wireless Headphones',
    price: 29990,
    quantity: 1,
    image: 'https://via.placeholder.com/80',
    stock: 48,
  },
  {
    id: 2,
    name: 'Logitech MX Master 3S Wireless Mouse',
    price: 8995,
    quantity: 2,
    image: 'https://via.placeholder.com/80',
    stock: 15,
  },
  {
    id: 3,
    name: 'Stainless Steel Water Bottle 1L',
    price: 599,
    quantity: 1,
    image: 'https://via.placeholder.com/80',
    stock: 120,
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCart);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(newQty, item.stock) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven’t added anything to your cart yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FB641B] hover:bg-[#e55a15] text-white font-medium rounded-sm transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Cart ({cartItems.length} items)</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sm:p-5 flex gap-4"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded border border-gray-200 flex-shrink-0"
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-green-600 mt-1">In Stock</p>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ₹{item.price.toLocaleString('en-IN')} each
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Price ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})
                </span>
                <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charges</span>
                <span className={delivery === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                  {delivery === 0 ? 'FREE' : `₹${delivery}`}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {delivery === 0 && (
              <p className="mt-3 text-xs text-green-600">
                You will save ₹40 on delivery charges
              </p>
            )}

            <button className="w-full mt-5 py-3.5 bg-[#FB641B] hover:bg-[#e55a15] text-white font-semibold rounded-sm transition shadow-sm">
              Place Order
            </button>

            <Link
              to="/"
              className="block text-center mt-3 text-sm text-[#2874F0] hover:underline font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
