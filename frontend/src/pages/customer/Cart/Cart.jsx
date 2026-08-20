import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const initialCart = [
  { id: 1, name: 'Sony WH-1000XM5 Wireless Headphones', price: 29990, quantity: 1, icon: '🎧', stock: 48 },
  { id: 2, name: 'Logitech MX Master 3S Wireless Mouse', price: 8995, quantity: 2, icon: '🖱️', stock: 15 },
  { id: 3, name: 'Stainless Steel Water Bottle 1L', price: 599, quantity: 1, icon: '🧴', stock: 120 },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCart);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: Math.min(newQty, item.stock) } : item));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2 className="cart-empty-title">Your cart is empty</h2>
            <p className="cart-empty-desc">Looks like you haven't added anything yet.</p>
            <Link to="/" className="cart-empty-btn">Continue Shopping</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        {/* Header */}
        <header className="cart-header">
          <h1 className="cart-title">My Cart</h1>
          <span className="cart-count">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
        </header>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-icon">{item.icon}</div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-stock">In Stock</p>
                  <div className="cart-item-actions">
                    <div className="cart-qty-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="cart-qty-btn">−</button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="cart-qty-btn">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="cart-remove-btn">Remove</button>
                  </div>
                </div>
                <div className="cart-item-price">
                  <p className="cart-price-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  <p className="cart-price-each">₹{item.price.toLocaleString('en-IN')} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <div className="cart-summary-card">
              <h2 className="cart-summary-title">Price Details</h2>
              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Price ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? 'free' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                </div>
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              {delivery === 0 && <p className="cart-savings">You save ₹40 on delivery</p>}
              <button className="cart-checkout-btn">Place Order</button>
              <Link to="/" className="cart-continue">Continue Shopping →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
