import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { propertyService } from '@/services';
import PropertyDetails from '@/components/organisms/PropertyDetails';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    if (id) {
      loadProperty();
      loadSavedProperties();
    }
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await propertyService.getById(id);
      setProperty(result);
    } catch (err) {
      setError(err.message || 'Failed to load property');
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedProperties = () => {
    const saved = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    setSavedProperties(saved);
  };

  const handleSaveProperty = (propertyId) => {
    const newSavedProperties = savedProperties.includes(propertyId)
      ? savedProperties.filter(id => id !== propertyId)
      : [...savedProperties, propertyId];
    
    setSavedProperties(newSavedProperties);
    localStorage.setItem('savedProperties', JSON.stringify(newSavedProperties));
    
    if (property) {
      if (newSavedProperties.includes(propertyId)) {
        toast.success(`${property.title} saved to favorites`);
      } else {
        toast.success(`${property.title} removed from favorites`);
      }
    }
  };

  const handleContactAgent = (property) => {
    // Simulate contacting agent
    toast.success(`Contact request sent for ${property.title}! An agent will reach out to you soon.`);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button Skeleton */}
          <div className="h-10 bg-surface-200 rounded w-32 mb-8 animate-pulse" />
          
          {/* Property Detail Skeleton */}
          <div className="space-y-6">
            {/* Image Gallery Skeleton */}
            <div className="h-64 md:h-96 bg-surface-200 rounded-lg animate-pulse" />
            
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-surface-200 rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-surface-200 rounded w-1/2 animate-pulse" />
                <div className="h-10 bg-surface-200 rounded w-1/3 animate-pulse" />
              </div>
              <div className="flex gap-3">
                <div className="h-10 bg-surface-200 rounded w-24 animate-pulse" />
                <div className="h-10 bg-surface-200 rounded w-32 animate-pulse" />
              </div>
            </div>
            
            {/* Cards Skeleton */}
            <div className="space-y-6">
              <div className="h-32 bg-surface-200 rounded-lg animate-pulse" />
              <div className="h-48 bg-surface-200 rounded-lg animate-pulse" />
              <div className="h-64 bg-surface-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={goBack}
            className="mb-8 flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <ErrorState 
            message={error}
            onRetry={loadProperty}
          />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState 
            message="Property not found"
            onRetry={() => navigate('/browse')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={goBack}
            className="flex items-center space-x-2 hover:bg-surface-50"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Back to listings</span>
          </Button>
        </motion.div>

        {/* Property Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PropertyDetails
            property={property}
            onSave={handleSaveProperty}
            onContact={handleContactAgent}
            isSaved={savedProperties.includes(property.Id)}
          />
        </motion.div>

        {/* Similar Properties CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-surface rounded-lg shadow-sm border border-surface-200 p-8 text-center"
        >
          <h3 className="text-xl font-semibold text-surface-900 mb-2">
            Looking for more options?
          </h3>
          <p className="text-secondary mb-6">
            Explore similar properties in {property.city}, {property.state} or browse our entire collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={() => navigate(`/search?location=${property.city}, ${property.state}`)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Search" className="w-4 h-4" />
              <span>Search in {property.city}</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/browse')}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Grid" className="w-4 h-4" />
              <span>Browse All Properties</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyDetail;