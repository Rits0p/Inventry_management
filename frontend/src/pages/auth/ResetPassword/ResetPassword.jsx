import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, KeyRound, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { authService } from '../../../services/authService';
import { getApiErrorMessage } from '../../../utils/apiErrors';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';
  const linkValid = Boolean(uid && token);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = 'Reset Password | RPD Store';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await authService.resetPassword(uid, token, password);
      setDone(true);
    } catch (err) {
      setError(getApiErrorMessage(err, 'This reset link is invalid or has expired.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-dvh flex items-center justify-center relative overflow-hidden font-sans px-4 transition-colors duration-300"
      style={{ background: 'var(--page-bg)' }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(40,116,240,0.07) 0%, var(--page-bg) 50%, rgba(251,100,27,0.05) 100%)',
          }}
        />
        <div
          className="auth-orb-1 absolute w-[500px] h-[500px] rounded-full blur-[120px] top-[-10%] left-[-5%]"
          style={{ background: 'rgba(40,116,240,0.12)' }}
        />
        <div
          className="auth-orb-2 absolute w-[400px] h-[400px] rounded-full blur-[100px] bottom-[-8%] right-[-5%]"
          style={{ background: 'rgba(251,100,27,0.10)' }}
        />
      </div>

      <div className="w-full max-w-[440px] animate-[slideUp_0.5s_ease-out]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB641B] to-[#e55a1a] flex items-center justify-center shadow-lg shadow-[#FB641B]/25 group-hover:scale-105 transition-transform duration-200">
              <Package className="w-6 h-6 text-white" strokeWidth={2.2} />
            </div>
            <div className="text-left leading-none">
              <span
                className="font-bold text-2xl tracking-tight font-[var(--font-display)]"
                style={{ color: 'var(--text-primary)' }}
              >
                RPD<span className="text-[#FB641B]">.</span>
              </span>
              <span
                className="block text-[10px] uppercase tracking-[0.2em] font-semibold mt-0.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Store
              </span>
            </div>
          </Link>
          <h1
            className="text-2xl font-bold font-[var(--font-display)]"
            style={{ color: 'var(--text-primary)' }}
          >
            Choose a new password
          </h1>
        </div>

        {/* Glass Card */}
        <div
          className="backdrop-blur-xl rounded-3xl p-8 md:p-10 transition-colors duration-300"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            boxShadow: '0 8px 40px -12px rgba(0,0,0,0.1)',
          }}
        >
          {!linkValid ? (
            /* Missing / malformed link params */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                This password reset link is invalid. Please request a new one.
              </p>
              <Link
                to="/login"
                className="inline-block w-full py-3.5 bg-gradient-to-r from-[#2874F0] to-[#1e5bc0] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#2874F0]/20 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                Back to Login
              </Link>
            </div>
          ) : done ? (
            /* Success */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Your password has been reset successfully.<br />
                You can now sign in with your new password.
              </p>
              <Link
                to="/login"
                className="inline-block w-full py-3.5 bg-gradient-to-r from-[#FB641B] to-[#e55a1a] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#FB641B]/20 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  New Password
                </label>
                <div className="relative">
                  <KeyRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px]"
                    style={{ color: 'var(--text-secondary)' }}
                  />
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874F0]/30 focus:border-[#2874F0]/50 placeholder:opacity-40 transition-all duration-200"
                    style={{
                      color: 'var(--text-primary)',
                      background: 'rgba(128,128,128,0.06)',
                      border: '1px solid var(--card-border)',
                    }}
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px]"
                    style={{ color: 'var(--text-secondary)' }}
                  />
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874F0]/30 focus:border-[#2874F0]/50 placeholder:opacity-40 transition-all duration-200"
                    style={{
                      color: 'var(--text-primary)',
                      background: 'rgba(128,128,128,0.06)',
                      border: '1px solid var(--card-border)',
                    }}
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#FB641B] to-[#e55a1a] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#FB641B]/20 hover:shadow-[#FB641B]/30 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Resetting…' : 'Reset Password'}
              </button>

              <Link
                to="/login"
                className="text-xs text-center font-medium hover:underline transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
