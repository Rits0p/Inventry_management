import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import { useCart } from '../../../context/CartContext';
import { useUser } from '../../../context/UserContext';
import { orderService } from '../../../services/orderService';
import { getApiErrorMessage } from '../../../utils/apiErrors';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useUser();
  const [address, setAddress] = useState(user?.address || '');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;

  const handlePlaceOrder = async () => {
    if (placing) return;
    setPlacing(true);
    setError('');
    try {
      await orderService.placeOrder({
        items: cartItems.map(item => ({ product_id: item.id, quantity: item.quantity })),
        delivery_address: address,
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to place your order.'));
    } finally {
      setPlacing(false);
    }
  };

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

        {error && <div className="cart-error">{error}</div>}

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-icon">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    '📦'
                  )}
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className={`cart-item-stock ${item.stock === 0 ? 'out' : ''}`}>
                    {item.stock === 0 ? 'Out of Stock' : `In Stock (${item.stock} left)`}
                  </p>
                  <div className="cart-item-actions">
                    <div className="cart-qty-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="cart-qty-btn">−</button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="cart-qty-btn">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="cart-remove-btn">Remove</button>
                  </div>
                </div>
                <div className="cart-item-price">
                  <p className="cart-price-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  <p className="cart-price-each">₹{Number(item.price).toLocaleString('en-IN')} each</p>
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

              <div className="cart-address-group">
                <label className="cart-address-label" htmlFor="delivery-address">Delivery Address</label>
                <textarea
                  id="delivery-address"
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no, street, city, pincode…"
                  className="cart-address-input"
                />
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing || cartItems.some(item => item.stock === 0)}
                className="cart-checkout-btn"
              >
                {placing ? 'Placing Order…' : 'Place Order'}
              </button>
              <Link to="/" className="cart-continue">Continue Shopping →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
