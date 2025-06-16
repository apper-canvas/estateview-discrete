import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchBar = ({ onSearch, placeholder = "Search properties...", className = '' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-secondary hover:text-primary transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <ApperIcon name="Search" className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;