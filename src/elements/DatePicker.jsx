import { forwardRef } from 'react';

const DatePicker = forwardRef(({ 
  label,
  error,
  required = false,
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
      
      <input
        ref={ref}
        type="date"
        className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
        {...props}
      />
      
      {error && (
        <div className="invalid-feedback">{error}</div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
