import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Package, Eye, EyeOff } from 'lucide-react';
import ForgotPassword from './ForgotPassword';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../../../services/authService';
import { getApiErrorMessage } from '../../../utils/apiErrors';

export default function Login() {
  const { brandConfig } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError('');
    try {
      const data = await authService.login(email.trim(), password);
      login(data.user);
      const from = location.state?.from?.pathname;
      navigate(from || (data.user.role === 'Admin' ? '/admin/dashboard' : '/'), {
        replace: true,
      });
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Unable to sign in. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-dvh flex items-center justify-center relative overflow-hidden font-sans px-4 transition-colors duration-300"
      style={{ background: 'var(--page-bg)' }}
    >
      {/* ── Animated Background ── */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(40,116,240,0.07) 0%, var(--page-bg) 50%, rgba(251,100,27,0.05) 100%)',
          }}
        />
        <div className="auth-orb-1 absolute w-[500px] h-[500px] rounded-full blur-[120px] top-[-10%] left-[-5%]"
          style={{ background: 'rgba(40,116,240,0.12)' }} />
        <div className="auth-orb-2 absolute w-[400px] h-[400px] rounded-full blur-[100px] bottom-[-8%] right-[-5%]"
          style={{ background: 'rgba(251,100,27,0.10)' }} />
        <div className="auth-orb-3 absolute w-[300px] h-[300px] rounded-full blur-[100px] top-[40%] right-[20%]"
          style={{ background: 'rgba(139,92,246,0.06)' }} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #2874F0 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── Login Card ── */}
      <div className="w-full max-w-[440px] animate-[slideUp_0.5s_ease-out]">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB641B] to-[#e55a1a] flex items-center justify-center shadow-lg shadow-[#FB641B]/25 group-hover:scale-105 transition-transform duration-200">
              <Package className="w-6 h-6 text-white" strokeWidth={2.2} />
            </div>
            <div className="text-left leading-none">
              <span className="font-bold text-2xl tracking-tight font-[var(--font-display)]" style={{ color: 'var(--text-primary)' }}>
                RPD<span className="text-[#FB641B]">.</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Store
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: 'var(--text-primary)' }}>
            Welcome back
          </h1>
          <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
            Sign in to your account to continue
          </p>
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
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
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
                  id="email"
                  type="email"
                  autoComplete="email"
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
              {emailError && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs font-medium text-[#2874F0] hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px]"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874F0]/30 focus:border-[#2874F0]/50 placeholder:opacity-40 transition-all duration-200"
                  style={{
                    color: 'var(--text-primary)',
                    background: 'rgba(128,128,128,0.06)',
                    border: '1px solid var(--card-border)',
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{passwordError}</p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="text-xs font-medium text-red-500 bg-red-500/[0.06] border border-red-500/20 rounded-lg px-3.5 py-2.5">
                {apiError}
              </div>
            )}

            {/* Terms */}
            <p className="text-[11px] leading-relaxed -mt-1" style={{ color: 'var(--text-secondary)' }}>
              By continuing, you agree to {brandConfig.companyName}'s{' '}
              <a href="#" className="text-[#2874F0] hover:underline">Terms of Use</a> and{' '}
              <a href="#" className="text-[#2874F0] hover:underline">Privacy Policy</a>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#FB641B] to-[#e55a1a] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#FB641B]/20 hover:shadow-[#FB641B]/30 hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2 min-h-[48px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
          </div>

          {/* Request OTP */}
          <button
            type="button"
            className="w-full py-3.5 backdrop-blur-sm font-medium text-sm rounded-xl transition-all duration-200 cursor-pointer hover:brightness-95"
            style={{
              color: 'var(--text-primary)',
              background: 'rgba(128,128,128,0.06)',
              border: '1px solid var(--card-border)',
            }}
          >
            Request OTP
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            New to {brandConfig.companyName}?{' '}
            <Link to="/register" className="font-semibold text-[#2874F0] hover:underline transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <ForgotPassword open={showForgot} onClose={() => setShowForgot(false)} />
    </div>
  );
}
