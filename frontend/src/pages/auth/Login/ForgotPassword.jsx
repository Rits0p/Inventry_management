import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';

export default function ForgotPassword({ open, onClose }) {
  const { brandConfig } = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] bg-white rounded-sm p-8 shadow-2xl relative animate-[slideUp_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>

        <h3 className="text-xl font-medium text-flipkart-text mb-2">Forgot Password?</h3>
        
        {sent ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>
            <p className="text-[14px] text-flipkart-muted leading-relaxed">
              We've sent a password reset link to <br/>
              <strong className="text-flipkart-text">{email}</strong>
            </p>
          </div>
        ) : (
          <>
            <p className="text-[14px] text-flipkart-muted mb-8">
              Enter your email address associated with your {brandConfig.companyName} account.
            </p>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full pt-4 pb-2 text-flipkart-text bg-transparent border-b border-[#e0e0e0] focus:border-flipkart-blue focus:outline-none transition-colors"
                  placeholder=" "
                />
                <label 
                  htmlFor="reset-email"
                  className={`absolute left-0 transition-all duration-200 pointer-events-none text-[#878787] ${
                    email ? '-top-2 text-[12px]' : 'top-3 text-[15px] peer-focus:-top-2 peer-focus:text-[12px]'
                  }`}
                >
                  Email Address
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-flipkart-orange text-white font-medium shadow-[0_1px_2px_0_rgba(0,0,0,.2)] hover:shadow-[0_2px_4px_0_rgba(0,0,0,.2)] transition-shadow rounded-sm"
              >
                Continue
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
