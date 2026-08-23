
/**
 * Input – styled form input with optional label and error.
 *
 * Props:
 *   id, name, type, value, onChange, placeholder
 *   label   (string) – field label text
 *   error   (string) – validation error message
 *   hint    (string) – supporting hint text below field
 *   prefix  (node)   – icon/element before the input
 *   suffix  (node)   – icon/element after the input
 *   required(bool)
 *   disabled(bool)
 */
export default function Input({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  hint,
  prefix,
  suffix,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {prefix}
          </div>
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full py-2.5 border rounded-sm text-sm bg-white dark:bg-[#1a1a24] dark:text-white transition
            focus:outline-none focus:ring-2 focus:ring-[#2874F0] focus:border-[#2874F0]
            ${prefix ? 'pl-10' : 'pl-4'}
            ${suffix ? 'pr-10' : 'pr-4'}
            ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-white/10'}
            ${disabled ? 'bg-gray-50 dark:bg-white/5 text-gray-500 cursor-not-allowed' : ''}
          `}
          {...rest}
        />

        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  );
}
