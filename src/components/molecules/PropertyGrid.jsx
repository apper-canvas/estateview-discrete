import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';

const PropertyGrid = ({ properties, onSaveProperty, savedProperties = [], viewMode = 'grid' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {properties.map((property, index) => (
          <motion.div key={property.Id} variants={itemVariants}>
            <PropertyCard
              property={property}
              onSave={onSaveProperty}
              isSaved={savedProperties.includes(property.Id)}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {properties.map((property, index) => (
        <motion.div key={property.Id} variants={itemVariants}>
          <PropertyCard
            property={property}
            onSave={onSaveProperty}
            isSaved={savedProperties.includes(property.Id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;