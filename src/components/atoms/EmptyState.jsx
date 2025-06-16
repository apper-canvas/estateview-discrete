import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from './Button';

const EmptyState = ({ 
  title = 'No items found',
  description = 'Try adjusting your search or filters',
  actionLabel,
  onAction,
  icon = 'Search',
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-16 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto mb-6" />
      </motion.div>
      
      <h3 className="text-xl font-medium text-surface-900 mb-2">{title}</h3>
      <p className="text-secondary mb-8 max-w-md mx-auto">{description}</p>
      
      {actionLabel && onAction && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;