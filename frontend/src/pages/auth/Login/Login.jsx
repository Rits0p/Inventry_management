import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { useTheme } from '../../../context/ThemeContext';

export default function Login() {
  const { brandConfig } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
    // TODO: call your Django JWT auth service
    console.log({ email, password });
    setTimeout(() => setIsLoading(false), 1200);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-flipkart-bg font-sans px-4">
      
      <div className="w-full max-w-[850px] bg-white rounded-sm shadow-[0_2px_4px_0_rgba(0,0,0,.08)] flex md:min-h-[528px] animate-[slideUp_0.4s_ease-out]">
        
        {/* Left Side (Brand Panel) */}
        <div className="hidden md:flex flex-col justify-between w-[40%] bg-flipkart-blue px-8 py-10 text-white relative">
          <div className="relative z-10">
            <h2 className="text-[28px] font-semibold mb-4 tracking-tight">Login</h2>
            <p className="text-[18px] text-white/80 leading-relaxed font-medium">
              Get access to your Orders, Stock updates, and Recommendations
            </p>
          </div>
          {/* Logo / Illustration */}
          <div className="flex justify-center mt-auto relative z-10 pb-4">
             <div className="text-8xl drop-shadow-lg">🛒</div>
          </div>
        </div>

        {/* Right Side (Form Panel) */}
        <div className="flex-1 px-8 py-12 md:px-12 flex flex-col relative">
          
          <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col">
            {/* Email Input */}
            <div className="mb-6 relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full pt-4 pb-2 text-flipkart-text bg-transparent border-b border-[#e0e0e0] focus:border-flipkart-blue focus:outline-none transition-colors"
                placeholder=" "
              />
              <label 
                htmlFor="email"
                className={`absolute left-0 transition-all duration-200 pointer-events-none text-[#878787] ${
                  email ? '-top-2 text-[12px]' : 'top-3 text-[15px] peer-focus:-top-2 peer-focus:text-[12px]'
                }`}
              >
                Enter Email/Mobile number
              </label>
              {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
            </div>

            {/* Password Input */}
            <div className="mb-2 relative">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full pt-4 pb-2 text-flipkart-text bg-transparent border-b border-[#e0e0e0] focus:border-flipkart-blue focus:outline-none transition-colors"
                placeholder=" "
              />
              <label 
                htmlFor="password"
                className={`absolute left-0 transition-all duration-200 pointer-events-none text-[#878787] ${
                  password ? '-top-2 text-[12px]' : 'top-3 text-[15px] peer-focus:-top-2 peer-focus:text-[12px]'
                }`}
              >
                Enter Password
              </label>
              {passwordError && <p className="mt-1 text-xs text-red-500">{passwordError}</p>}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-8">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[14px] text-flipkart-blue hover:underline font-medium"
              >
                Forgot?
              </button>
            </div>

            {/* Terms text */}
            <p className="text-[12px] text-[#878787] mb-4 leading-relaxed">
              By continuing, you agree to {brandConfig.companyName}'s <a href="#" className="text-flipkart-blue">Terms of Use</a> and <a href="#" className="text-flipkart-blue">Privacy Policy</a>.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-flipkart-orange text-white font-medium shadow-[0_1px_2px_0_rgba(0,0,0,.2)] hover:shadow-[0_2px_4px_0_rgba(0,0,0,.2)] transition-shadow flex justify-center items-center rounded-sm min-h-[48px]"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Login'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center my-4">
              <span className="text-[#878787] text-[15px]">OR</span>
            </div>

            {/* Request OTP (Alternative Action) */}
            <button
              type="button"
              className="w-full py-3.5 bg-white text-flipkart-blue font-medium shadow-[0_1px_2px_0_rgba(0,0,0,.2)] border border-[#e0e0e0] hover:shadow-[0_2px_4px_0_rgba(0,0,0,.2)] transition-shadow rounded-sm"
            >
              Request OTP
            </button>
            
            {/* Create Account link */}
            <div className="mt-auto pt-8 text-center">
              <Link to="/register" className="text-flipkart-blue font-medium text-[14px] hover:underline">
                New to {brandConfig.companyName}? Create an account
              </Link>
            </div>

          </form>
        </div>
      </div>

      <ForgotPassword open={showForgot} onClose={() => setShowForgot(false)} />
    </div>
  );
}
