import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { propertyService } from '@/services';
import PropertyGrid from '@/components/molecules/PropertyGrid';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const savedIds = JSON.parse(localStorage.getItem('savedProperties') || '[]');
      setSavedProperties(savedIds);
      
      if (savedIds.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      // Fetch all properties and filter saved ones
      const allProperties = await propertyService.getAll();
      const savedPropertyObjects = allProperties.filter(property => 
        savedIds.includes(property.Id)
      );
      
      setProperties(savedPropertyObjects);
    } catch (err) {
      setError(err.message || 'Failed to load saved properties');
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProperty = (propertyId) => {
    const newSavedProperties = savedProperties.filter(id => id !== propertyId);
    const newProperties = properties.filter(p => p.Id !== propertyId);
    
    setSavedProperties(newSavedProperties);
    setProperties(newProperties);
    localStorage.setItem('savedProperties', JSON.stringify(newSavedProperties));
    
    const property = properties.find(p => p.Id === propertyId);
    if (property) {
      toast.success(`${property.title} removed from favorites`);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all saved properties?')) {
      setSavedProperties([]);
      setProperties([]);
      localStorage.removeItem('savedProperties');
      toast.success('All saved properties cleared');
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-surface-200 rounded w-64 mb-2 animate-pulse" />
            <div className="h-4 bg-surface-200 rounded w-96 animate-pulse" />
          </div>
          <SkeletonLoader count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState 
            message={error}
            onRetry={loadSavedProperties}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-surface-900 mb-2 flex items-center">
              <ApperIcon name="Heart" className="w-8 h-8 mr-3 text-error" />
              Saved Properties
            </h1>
            <p className="text-secondary">
              Your favorite properties in one place
              {properties.length > 0 && (
                <span className="ml-2 text-surface-900 font-medium">
                  ({properties.length} {properties.length === 1 ? 'property' : 'properties'})
                </span>
              )}
            </p>
          </div>
          
          {properties.length > 0 && (
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

              {/* Clear All Button */}
              <Button
                variant="ghost"
                onClick={handleClearAll}
                className="text-error hover:text-error/80 hover:bg-error/10"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {properties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <EmptyState
              title="No saved properties yet"
              description="Start saving properties by clicking the heart icon on any listing. Your favorites will appear here for easy access."
              actionLabel="Browse Properties"
              onAction={() => window.location.href = '/browse'}
              icon="Heart"
            />
          </motion.div>
        )}

        {/* Saved Properties Grid */}
        {properties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PropertyGrid
              properties={properties}
              onSaveProperty={handleRemoveProperty}
              savedProperties={savedProperties}
              viewMode={viewMode}
            />
          </motion.div>
        )}

        {/* Tips Section */}
        {properties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-surface rounded-lg shadow-sm border border-surface-200 p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
              <ApperIcon name="Lightbulb" className="w-5 h-5 mr-2 text-warning" />
              Pro Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Check" className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Save properties to compare features and prices side by side</span>
              </div>
              <div className="flex items-start space-x-3">
                <ApperIcon name="Check" className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Contact agents directly from saved properties for faster responses</span>
              </div>
              <div className="flex items-start space-x-3">
                <ApperIcon name="Check" className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Your saved properties are stored locally and persist between sessions</span>
              </div>
              <div className="flex items-start space-x-3">
                <ApperIcon name="Check" className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Bookmark this page to quickly access your favorite properties</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;