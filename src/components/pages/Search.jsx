import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { propertyService } from '@/services';
import SearchBar from '@/components/molecules/SearchBar';
import PropertyGrid from '@/components/molecules/PropertyGrid';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const Search = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    loadSavedProperties();
    loadRecentSearches();
  }, []);

  const loadSavedProperties = () => {
    const saved = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    setSavedProperties(saved);
  };

  const loadRecentSearches = () => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent);
  };

  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    
    const searches = recentSearches.filter(s => s !== query);
    const newSearches = [query, ...searches].slice(0, 5);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setHasSearched(true);
    
    if (!query.trim()) {
      setProperties([]);
      return;
    }

    saveRecentSearch(query);
    setLoading(true);
    setError(null);
    
    try {
      const result = await propertyService.search(query);
      setProperties(result);
    } catch (err) {
      setError(err.message || 'Failed to search properties');
      toast.error('Failed to search properties');
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearchClick = (query) => {
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleSaveProperty = (propertyId) => {
    const newSavedProperties = savedProperties.includes(propertyId)
      ? savedProperties.filter(id => id !== propertyId)
      : [...savedProperties, propertyId];
    
    setSavedProperties(newSavedProperties);
    localStorage.setItem('savedProperties', JSON.stringify(newSavedProperties));
    
    const property = properties.find(p => p.Id === propertyId);
    if (property) {
      if (newSavedProperties.includes(propertyId)) {
        toast.success(`${property.title} saved to favorites`);
      } else {
        toast.success(`${property.title} removed from favorites`);
      }
    }
  };

  const suggestedSearches = [
    'San Francisco condos',
    'Austin houses under 500k',
    'Portland Victorian homes',
    'Denver townhouses',
    'Malibu oceanfront'
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-surface-900 mb-4">
            Find Your Perfect Home
          </h1>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            Search through thousands of properties to find the one that matches your dreams
          </p>
          
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search by location, property type, or features..."
            />
          </motion.div>
        </motion.div>

        {/* Recent Searches & Suggestions */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="bg-surface rounded-lg shadow-sm border border-surface-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-surface-900 flex items-center">
                      <ApperIcon name="Clock" className="w-5 h-5 mr-2" />
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-sm text-secondary hover:text-primary transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ x: 4 }}
                        onClick={() => handleRecentSearchClick(search)}
                        className="w-full text-left px-3 py-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-50 transition-all flex items-center"
                      >
                        <ApperIcon name="Search" className="w-4 h-4 mr-2" />
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Searches */}
              <div className="bg-surface rounded-lg shadow-sm border border-surface-200 p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
                  <ApperIcon name="Lightbulb" className="w-5 h-5 mr-2" />
                  Popular Searches
                </h3>
                <div className="space-y-2">
                  {suggestedSearches.map((search, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ x: 4 }}
                      onClick={() => handleRecentSearchClick(search)}
                      className="w-full text-left px-3 py-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-50 transition-all flex items-center"
                    >
                      <ApperIcon name="TrendingUp" className="w-4 h-4 mr-2" />
                      {search}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-surface-900 mb-2">
                Search Results
              </h2>
              <p className="text-secondary">
                {loading ? 'Searching...' : (
                  <>
                    {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                    {searchQuery && (
                      <span className="ml-1">
                        for "<span className="font-medium text-surface-900">{searchQuery}</span>"
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <SkeletonLoader count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
            )}

            {/* Error State */}
            {error && !loading && (
              <ErrorState 
                message={error}
                onRetry={() => handleSearch(searchQuery)}
              />
            )}

            {/* Empty State */}
            {!loading && !error && properties.length === 0 && searchQuery && (
              <EmptyState
                title="No properties found"
                description={`No properties match "${searchQuery}". Try a different search term or check the spelling.`}
                actionLabel="Try Popular Search"
                onAction={() => handleRecentSearchClick(suggestedSearches[0])}
                icon="SearchX"
              />
            )}

            {/* Properties Grid */}
            {!loading && !error && properties.length > 0 && (
              <PropertyGrid
                properties={properties}
                onSaveProperty={handleSaveProperty}
                savedProperties={savedProperties}
                viewMode="grid"
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;