import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Package } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../../../services/authService';
import { getApiErrorMessage } from '../../../utils/apiErrors';

export default function Register() {
  const { brandConfig } = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email ID';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError('');
    try {
      await authService.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      const data = await authService.login(formData.email.trim(), formData.password);
      login(data.user);
      navigate(data.user.role === 'Admin' ? '/admin/dashboard' : '/', { replace: true });
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center relative overflow-hidden bg-[var(--page-bg)] font-sans px-4 transition-colors duration-300">

      {/* ── Animated Background ── */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2874F0]/8 to-[#FB641B]/6 transition-colors duration-300" style={{ background: 'linear-gradient(to bottom right, rgba(40,116,240,0.08), var(--page-bg), rgba(251,100,27,0.06))' }} />
        <div className="auth-orb-1 absolute w-[500px] h-[500px] rounded-full bg-[#2874F0]/15 dark:bg-[#2874F0]/10 blur-[120px] top-[-10%] left-[-5%]" />
        <div className="auth-orb-2 absolute w-[400px] h-[400px] rounded-full bg-[#FB641B]/12 dark:bg-[#FB641B]/8 blur-[100px] bottom-[-8%] right-[-5%]" />
        <div className="auth-orb-3 absolute w-[300px] h-[300px] rounded-full bg-emerald-400/8 dark:bg-emerald-500/5 blur-[100px] top-[35%] left-[20%]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #2874F0 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* ── Glass Card ── */}
      <div className="w-full max-w-[440px] animate-[slideUp_0.5s_ease-out]">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB641B] to-[#e55a1a] flex items-center justify-center shadow-lg shadow-[#FB641B]/25 dark:shadow-[#FB641B]/15">
              <Package className="w-6 h-6 text-white" strokeWidth={2.2} />
            </div>
            <div className="text-left leading-none">
              <span className="font-bold text-flipkart-text dark:text-white tracking-tight text-2xl font-[var(--font-display)]">
                RPD<span className="text-[#FB641B]">.</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-flipkart-muted dark:text-gray-500 font-semibold mt-0.5">
                Store
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-flipkart-text dark:text-white font-[var(--font-display)]">
            Create your account
          </h1>
          <p className="text-sm text-flipkart-muted dark:text-gray-400 mt-1.5">
            Join {brandConfig.companyName} to start shopping
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] p-8 md:p-10">
          
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-flipkart-muted dark:text-gray-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-flipkart-muted/60 dark:text-gray-500" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 text-sm text-flipkart-text dark:text-white bg-white/60 dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874F0]/30 dark:focus:ring-[#2874F0]/25 focus:border-[#2874F0]/50 dark:focus:border-[#2874F0]/30 placeholder:text-flipkart-muted/50 dark:placeholder:text-gray-500 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-flipkart-muted dark:text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-flipkart-muted/60 dark:text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 text-sm text-flipkart-text dark:text-white bg-white/60 dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874F0]/30 dark:focus:ring-[#2874F0]/25 focus:border-[#2874F0]/50 dark:focus:border-[#2874F0]/30 placeholder:text-flipkart-muted/50 dark:placeholder:text-gray-500 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-flipkart-muted dark:text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-flipkart-muted/60 dark:text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 text-sm text-flipkart-text dark:text-white bg-white/60 dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874F0]/30 dark:focus:ring-[#2874F0]/25 focus:border-[#2874F0]/50 dark:focus:border-[#2874F0]/30 placeholder:text-flipkart-muted/50 dark:placeholder:text-gray-500 transition-all duration-200"
                  placeholder="Min. 6 characters"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="text-xs font-medium text-red-500 bg-red-500/[0.06] border border-red-500/20 rounded-lg px-3.5 py-2.5">
                {apiError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#FB641B] to-[#e55a1a] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#FB641B]/20 hover:shadow-[#FB641B]/30 hover:from-[#e55a1a] hover:to-[#d14e14] active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2 min-h-[48px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-flipkart-muted dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#2874F0] hover:text-[#1e5bc0] dark:text-[#5a9cf8] dark:hover:text-[#7db4ff] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
