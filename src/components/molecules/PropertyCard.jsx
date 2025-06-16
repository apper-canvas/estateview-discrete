import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const PropertyCard = ({ property, onSave, isSaved = false }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSave) {
      onSave(property.Id);
    }
  };

  const primaryImage = property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';

  return (
    <Card hover onClick={handleCardClick} className="group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 animate-pulse" />
            )}
            <img
              src={primaryImage}
              alt={property.title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full bg-surface-100 flex items-center justify-center">
            <ApperIcon name="Image" className="w-12 h-12 text-surface-400" />
          </div>
        )}
        
        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSaveClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isSaved 
              ? 'bg-error text-white shadow-md' 
              : 'bg-white/80 text-surface-600 hover:bg-white hover:text-error'
          }`}
        >
          <ApperIcon name="Heart" className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary">{property.propertyType}</Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-primary">{formatPrice(property.price)}</h3>
          <Badge variant="success">{property.status}</Badge>
        </div>

        {/* Title */}
        <h4 className="text-lg font-semibold text-surface-900 mb-2 line-clamp-1">
          {property.title}
        </h4>

        {/* Address */}
        <div className="flex items-center text-secondary mb-3">
          <ApperIcon name="MapPin" className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">
            {property.address}, {property.city}, {property.state}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-secondary border-t border-surface-200 pt-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Square" className="w-4 h-4 mr-1" />
            <span>{formatSquareFeet(property.squareFeet)} sqft</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;