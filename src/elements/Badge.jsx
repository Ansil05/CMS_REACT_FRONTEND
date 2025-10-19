const Badge = ({ 
  children, 
  variant = 'primary',
  soft = true,
  pill = false,
  className = '' 
}) => {
  const variants = {
    primary: soft ? 'badge-soft-primary' : 'bg-primary text-white',
    success: soft ? 'badge-soft-success' : 'bg-success text-white',
    warning: soft ? 'badge-soft-warning' : 'bg-warning text-white',
    danger: soft ? 'badge-soft-danger' : 'bg-danger text-white',
    info: soft ? 'badge-soft-info' : 'bg-info text-white',
  };

  return (
    <span 
      className={`badge ${variants[variant]} ${pill ? 'rounded-pill' : ''} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
