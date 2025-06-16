import { useState } from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  className = '',
  required = false,
  disabled = false,
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  
  const hasValue = value && value.toString().length > 0;
  const showFloatingLabel = focused || hasValue;
  
  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={showFloatingLabel ? '' : placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border rounded-lg transition-all duration-200
          ${error ? 'border-error focus:border-error focus:ring-error/20' : 'border-surface-300 focus:border-primary focus:ring-primary/20'}
          ${disabled ? 'bg-surface-50 cursor-not-allowed' : 'bg-white'}
          focus:outline-none focus:ring-4
          ${showFloatingLabel ? 'pt-6 pb-2' : ''}
        `}
        {...props}
      />
      
      {label && (
        <label className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${showFloatingLabel 
            ? 'top-2 text-xs text-secondary transform' 
            : 'top-1/2 -translate-y-1/2 text-base text-secondary'
          }
          ${error ? 'text-error' : ''}
        `}>
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;