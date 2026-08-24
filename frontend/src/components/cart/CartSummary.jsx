import { Link } from 'react-router-dom';

/**
 * CartSummary – price breakdown panel + checkout button.
 *
 * Props:
 *   itemCount  (number) – total item count
 *   subtotal   (number) – subtotal in rupees
 *   delivery   (number) – delivery charge (0 = free)
 *   onCheckout (fn)     – called when "Place Order" is clicked
 */
export default function CartSummary({ itemCount = 0, subtotal = 0, delivery = 0, onCheckout }) {
  const total = subtotal + delivery;

  return (
    <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-sm shadow-sm p-5 sticky top-24">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Price Details</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">
            Price ({itemCount} item{itemCount !== 1 ? 's' : ''})
          </span>
          <span className="font-medium dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Delivery Charges</span>
          <span className={delivery === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
            {delivery === 0 ? 'FREE' : `₹${delivery}`}
          </span>
        </div>

        <div className="border-t border-[var(--card-border)] pt-3 flex justify-between text-base font-bold">
          <span className="dark:text-white">Total Amount</span>
          <span className="dark:text-white">₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {delivery === 0 && (
        <p className="mt-3 text-xs text-green-600">
          🎉 You're saving ₹40 on delivery!
        </p>
      )}

      <button
        onClick={onCheckout}
        className="w-full mt-5 py-3.5 bg-[#FB641B] hover:bg-[#e55a15] text-white font-semibold rounded-sm transition shadow-sm"
      >
        Place Order
      </button>

      <Link
        to="/"
        className="block text-center mt-3 text-sm text-[#2874F0] hover:underline font-medium"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
