import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-surface rounded-lg shadow-sm border border-surface-200 overflow-hidden';
  const hoverClasses = hover ? 'transition-all duration-200 hover:shadow-md' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const cardClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className={cardClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;