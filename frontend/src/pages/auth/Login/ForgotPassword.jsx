import React, { useState } from 'react';
import { Mail, X, CheckCircle } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(0,0,0,0.4)' }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[400px] backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] p-8 animate-[slideUp_0.25s_ease-out] transition-colors duration-300"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:brightness-90"
          style={{
            background: 'rgba(128,128,128,0.1)',
            color: 'var(--text-secondary)',
          }}
        >
          <X className="w-4 h-4" />
        </button>

        <h3
          className="text-xl font-bold font-[var(--font-display)] mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          Forgot Password?
        </h3>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We've sent a password reset link to<br />
              <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>{email}</strong>
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Enter your email address associated with your {brandConfig.companyName} account.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px]"
                    style={{ color: 'var(--text-secondary)' }}
                  />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874F0]/30 focus:border-[#2874F0]/50 placeholder:opacity-40 transition-all duration-200"
                    style={{
                      color: 'var(--text-primary)',
                      background: 'rgba(128,128,128,0.06)',
                      border: '1px solid var(--card-border)',
                    }}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#FB641B] to-[#e55a1a] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#FB641B]/20 hover:shadow-[#FB641B]/30 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                Send Reset Link
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
