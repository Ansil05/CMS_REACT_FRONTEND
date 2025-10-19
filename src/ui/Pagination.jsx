import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage <= 4) {
      return [...pages.slice(0, 5), '...', totalPages];
    }
    
    if (currentPage >= totalPages - 3) {
      return [1, '...', ...pages.slice(totalPages - 5)];
    }
    
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    ];
  };

  return (
    <div className="table-pagination">
      <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> entries
      </div>
      
      <ul className="pagination mb-0">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="d-flex align-items-center gap-2"
          >
            <FaChevronLeft size={12} />
            <span className="d-none d-sm-inline">Previous</span>
          </button>
        </li>
        
        {getVisiblePages().map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-3 py-2">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="d-flex align-items-center gap-2"
          >
            <span className="d-none d-sm-inline">Next</span>
            <FaChevronRight size={12} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
