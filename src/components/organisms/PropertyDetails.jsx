import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import ImageGallery from '@/components/molecules/ImageGallery';
import { format } from 'date-fns';

const PropertyDetails = ({ property, onSave, onContact, isSaved = false }) => {
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

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <ImageGallery images={property.images} title={property.title} />

      {/* Property Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-surface-900">{property.title}</h1>
            <Badge variant="success">{property.status}</Badge>
          </div>
          
          <div className="flex items-center text-secondary mb-4">
            <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
            <span className="text-lg">
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </span>
          </div>

          <div className="text-4xl font-bold text-primary mb-4">
            {formatPrice(property.price)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={isSaved ? "error" : "ghost"}
              onClick={() => onSave && onSave(property.Id)}
              className="flex items-center space-x-2"
            >
              <ApperIcon 
                name="Heart" 
                className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} 
              />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </Button>
          </motion.div>
          
          <Button
            variant="primary"
            onClick={() => onContact && onContact(property)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="MessageCircle" className="w-5 h-5" />
            <span>Contact Agent</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
              <ApperIcon name="Bed" className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-surface-900">{property.bedrooms}</div>
            <div className="text-sm text-secondary">Bedroom{property.bedrooms !== 1 ? 's' : ''}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
              <ApperIcon name="Bath" className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-surface-900">{property.bathrooms}</div>
            <div className="text-sm text-secondary">Bathroom{property.bathrooms !== 1 ? 's' : ''}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
              <ApperIcon name="Square" className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-surface-900">{formatSquareFeet(property.squareFeet)}</div>
            <div className="text-sm text-secondary">Square Feet</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
              <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-surface-900">{property.yearBuilt}</div>
            <div className="text-sm text-secondary">Year Built</div>
          </div>
        </div>
      </Card>

      {/* Description */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-surface-900 mb-4">Description</h2>
        <p className="text-surface-700 leading-relaxed">{property.description}</p>
      </Card>

      {/* Features */}
      {property.features && property.features.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Features & Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {property.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-2 text-surface-700"
              >
                <ApperIcon name="Check" className="w-4 h-4 text-success flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Property Details */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-surface-900 mb-4">Property Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-surface-200">
            <span className="text-secondary">Property Type</span>
            <span className="font-medium text-surface-900">{property.propertyType}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-surface-200">
            <span className="text-secondary">Year Built</span>
            <span className="font-medium text-surface-900">{property.yearBuilt}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-surface-200">
            <span className="text-secondary">Square Feet</span>
            <span className="font-medium text-surface-900">{formatSquareFeet(property.squareFeet)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-surface-200">
            <span className="text-secondary">Listed Date</span>
            <span className="font-medium text-surface-900">{formatDate(property.listingDate)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PropertyDetails;