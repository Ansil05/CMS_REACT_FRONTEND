const SkeletonLoader = ({ type = 'text', count = 1, height = '20px', width = '100%' }) => {
  const skeletons = Array(count).fill(null);

  const renderSkeleton = () => {
    switch (type) {
      case 'circle':
        return (
          <div 
            className="skeleton-loader"
            style={{
              width: width,
              height: width,
              borderRadius: '50%'
            }}
          />
        );
      case 'card':
        return (
          <div className="card border-0 shadow-sm" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div className="card-body p-4">
              <div className="skeleton-loader mb-3" style={{ height: '200px', borderRadius: 'var(--radius-md)' }} />
              <div className="skeleton-loader mb-2" style={{ height: '24px', width: '60%' }} />
              <div className="skeleton-loader" style={{ height: '16px', width: '80%' }} />
            </div>
          </div>
        );
      default:
        return (
          <div 
            className="skeleton-loader mb-2"
            style={{
              height: height,
              width: width,
              borderRadius: 'var(--radius-md)'
            }}
          />
        );
    }
  };

  return (
    <div>
      {skeletons.map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
