import { forwardRef } from 'react';

const Checkbox = forwardRef(({ 
  label,
  error,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="form-check">
      <input
        ref={ref}
        type="checkbox"
        className={`form-check-input ${error ? 'is-invalid' : ''} ${className}`}
        {...props}
      />
      {label && (
        <label className="form-check-label">
          {label}
        </label>
      )}
      {error && (
        <div className="invalid-feedback">{error}</div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
