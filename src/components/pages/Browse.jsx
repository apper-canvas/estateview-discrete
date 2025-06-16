import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { propertyService } from '@/services';
import PropertyFilters from '@/components/organisms/PropertyFilters';
import PropertyGrid from '@/components/molecules/PropertyGrid';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Browse = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProperties();
    loadSavedProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await propertyService.getAll();
      setProperties(result);
      setFilteredProperties(result);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedProperties = () => {
    const saved = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    setSavedProperties(saved);
  };

  const handleFiltersChange = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await propertyService.filter(filters);
      setFilteredProperties(result);
    } catch (err) {
      setError(err.message || 'Failed to apply filters');
      toast.error('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProperties(properties);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await propertyService.search(query);
      setFilteredProperties(result);
    } catch (err) {
      setError(err.message || 'Failed to search properties');
      toast.error('Failed to search properties');
    } finally {
      setLoading(false);
    }
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

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  if (error && !filteredProperties.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState 
          message={error}
          onRetry={loadProperties}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-surface-900 mb-2">Browse Properties</h1>
              <p className="text-secondary">Discover your dream home from our curated collection</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center border border-surface-300 rounded-lg p-1">
                <button
                  onClick={toggleViewMode}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-white' 
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <ApperIcon name="Grid" className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleViewMode}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary text-white' 
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <ApperIcon name="List" className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="ghost"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2"
              >
                <ApperIcon name="Filter" className="w-4 h-4" />
                <span>Filters</span>
              </Button>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search by location, property type, or features..."
              className="max-w-2xl"
            />
          </motion.div>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="sticky top-8">
              <PropertyFilters onFiltersChange={handleFiltersChange} />
            </div>
          </motion.aside>

          {/* Properties Grid */}
          <motion.main
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-secondary">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
                {searchQuery && (
                  <span className="ml-1">
                    for "<span className="font-medium text-surface-900">{searchQuery}</span>"
                  </span>
                )}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <SkeletonLoader 
                count={viewMode === 'grid' ? 6 : 3} 
                className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
              />
            )}

            {/* Empty State */}
            {!loading && filteredProperties.length === 0 && (
              <EmptyState
                title="No properties found"
                description={searchQuery 
                  ? `No properties match "${searchQuery}". Try adjusting your search or filters.`
                  : "No properties match your current filters. Try adjusting your criteria."
                }
                actionLabel="Clear Filters"
                onAction={() => window.location.reload()}
                icon="Home"
              />
            )}

            {/* Properties Grid */}
            {!loading && filteredProperties.length > 0 && (
              <PropertyGrid
                properties={filteredProperties}
                onSaveProperty={handleSaveProperty}
                savedProperties={savedProperties}
                viewMode={viewMode}
              />
            )}
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Browse;