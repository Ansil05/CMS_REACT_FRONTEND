import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  className = '' 
}) => {
  return (
    <div className={`search-bar ${className}`}>
      <FaSearch className="search-icon" size={18} />
      <input
        type="search"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
