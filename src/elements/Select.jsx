import { forwardRef } from 'react';

const Select = forwardRef(({ 
  label,
  error,
  helperText,
  required = false,
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label className={`form-label ${required ? 'form-label-required' : ''}`}>
          {label}
        </label>
      )}
      
      <select
        ref={ref}
        className={`form-control form-select ${error ? 'is-invalid' : ''} ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="invalid-feedback">{error}</div>
      )}
      
      {helperText && !error && (
        <div className="form-text">{helperText}</div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
