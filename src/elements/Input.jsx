import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  required = false,
  icon,
  type = 'text',
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
      
      <div className={icon ? 'form-control-icon' : ''}>
        {icon && <span className="icon">{icon}</span>}
        <input
          ref={ref}
          type={type}
          className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
          {...props}
        />
      </div>
      
      {error && (
        <div className="invalid-feedback">{error}</div>
      )}
      
      {helperText && !error && (
        <div className="form-text">{helperText}</div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
