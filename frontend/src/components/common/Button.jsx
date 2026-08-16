import React from 'react';

/**
 * Button – themed button with variants and sizes.
 *
 * Props:
 *   variant  : 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
 *   size     : 'sm' | 'md' | 'lg'
 *   disabled : bool
 *   loading  : bool – shows spinner and disables
 *   fullWidth: bool
 *   onClick  : function
 *   type     : 'button' | 'submit' | 'reset'
 *   children : content
 */
const variants = {
  primary:
    'bg-[#2874F0] hover:bg-blue-700 text-white border border-transparent',
  secondary:
    'bg-[#FB641B] hover:bg-[#e55a15] text-white border border-transparent',
  outline:
    'bg-white border border-[#2874F0] text-[#2874F0] hover:bg-blue-50',
  danger:
    'bg-red-600 hover:bg-red-700 text-white border border-transparent',
  ghost:
    'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  children,
  className = '',
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-sm transition
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
