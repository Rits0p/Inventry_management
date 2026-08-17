import React, { useState } from 'react';
import { Link } from 'react-router-dom';
 import { useTheme } from '../../../context/ThemeContext';

export default function Register() {
  const { brandConfig } = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Customer', // default role
  });

  const [errors, setErrors] = useState({});
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
    // TODO: call your Django register endpoint
    console.log(formData);
    setTimeout(() => setIsLoading(false), 1200);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-flipkart-bg font-sans px-4">
      
      <div className="w-full max-w-[850px] bg-white rounded-sm shadow-[0_2px_4px_0_rgba(0,0,0,.08)] flex md:min-h-[528px] animate-[slideUp_0.4s_ease-out]">
        
        {/* Left Side (Brand Panel) */}
        <div className="hidden md:flex flex-col justify-between w-[40%] bg-flipkart-blue px-8 py-10 text-white relative">
          <div className="relative z-10">
            <h2 className="text-[28px] font-semibold mb-4 tracking-tight">Looks like you're new here!</h2>
            <p className="text-[18px] text-white/80 leading-relaxed font-medium">
              Sign up with your details to get started
            </p>
          </div>
          <div className="flex justify-center mt-auto relative z-10 pb-4">
             <div className="text-8xl drop-shadow-lg">🚀</div>
          </div>
        </div>

        {/* Right Side (Form Panel) */}
        <div className="flex-1 px-8 py-12 md:px-12 flex flex-col relative">
          
          <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col">
            
            {/* Full Name Input */}
            <div className="mb-6 relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="peer w-full pt-4 pb-2 text-flipkart-text bg-transparent border-b border-[#e0e0e0] focus:border-flipkart-blue focus:outline-none transition-colors"
                placeholder=" "
              />
              <label 
                htmlFor="fullName"
                className={`absolute left-0 transition-all duration-200 pointer-events-none text-[#878787] ${
                  formData.fullName ? '-top-2 text-[12px]' : 'top-3 text-[15px] peer-focus:-top-2 peer-focus:text-[12px]'
                }`}
              >
                Enter your full name
              </label>
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>

            {/* Email Input */}
            <div className="mb-6 relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="peer w-full pt-4 pb-2 text-flipkart-text bg-transparent border-b border-[#e0e0e0] focus:border-flipkart-blue focus:outline-none transition-colors"
                placeholder=" "
              />
              <label 
                htmlFor="email"
                className={`absolute left-0 transition-all duration-200 pointer-events-none text-[#878787] ${
                  formData.email ? '-top-2 text-[12px]' : 'top-3 text-[15px] peer-focus:-top-2 peer-focus:text-[12px]'
                }`}
              >
                Enter Email ID
              </label>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="mb-8 relative">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="peer w-full pt-4 pb-2 text-flipkart-text bg-transparent border-b border-[#e0e0e0] focus:border-flipkart-blue focus:outline-none transition-colors"
                placeholder=" "
              />
              <label 
                htmlFor="password"
                className={`absolute left-0 transition-all duration-200 pointer-events-none text-[#878787] ${
                  formData.password ? '-top-2 text-[12px]' : 'top-3 text-[15px] peer-focus:-top-2 peer-focus:text-[12px]'
                }`}
              >
                Enter Password
              </label>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Role Selection (Minimalist design) */}
            <div className="mb-10">
              <p className="text-[13px] text-[#878787] mb-2">Account Type</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="Customer"
                    checked={formData.role === 'Customer'}
                    onChange={handleChange}
                    className="accent-flipkart-blue w-4 h-4"
                  />
                  <span className="text-[14px] text-flipkart-text font-medium">Customer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="Admin"
                    checked={formData.role === 'Admin'}
                    onChange={handleChange}
                    className="accent-flipkart-blue w-4 h-4"
                  />
                  <span className="text-[14px] text-flipkart-text font-medium">Admin</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-flipkart-orange text-white font-medium shadow-[0_1px_2px_0_rgba(0,0,0,.2)] hover:shadow-[0_2px_4px_0_rgba(0,0,0,.2)] transition-shadow flex justify-center items-center rounded-sm min-h-[48px]"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Continue'
              )}
            </button>

            {/* Login link */}
            <div className="mt-auto pt-8 text-center">
              <Link to="/login" className="text-flipkart-blue font-medium shadow-[0_1px_2px_0_rgba(0,0,0,.2)] bg-white border border-[#e0e0e0] block w-full py-3 hover:shadow-[0_2px_4px_0_rgba(0,0,0,.2)] transition-shadow rounded-sm">
                Existing User? Log in
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
