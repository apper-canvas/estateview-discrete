import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-surface-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-surface-50 transition-colors px-4"
      >
        <span className="font-medium text-surface-900">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="ChevronDown" className="w-5 h-5 text-secondary" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PriceRangeFilter = ({ priceMin, priceMax, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min Price"
          type="number"
          value={priceMin || ''}
          onChange={(e) => onChange({ priceMin: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="$0"
        />
        <Input
          label="Max Price"
          type="number"
          value={priceMax || ''}
          onChange={(e) => onChange({ priceMax: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="Any"
        />
      </div>
    </div>
  );
};

const PropertyTypeFilter = ({ selectedTypes, onChange }) => {
  const propertyTypes = ['House', 'Condo', 'Townhouse', 'Apartment'];

  const handleTypeToggle = (type) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onChange({ propertyTypes: newTypes });
  };

  return (
    <div className="space-y-2">
      {propertyTypes.map((type) => (
        <label key={type} className="flex items-center">
          <input
            type="checkbox"
            checked={selectedTypes.includes(type)}
            onChange={() => handleTypeToggle(type)}
            className="h-4 w-4 text-primary border-surface-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="ml-2 text-sm text-surface-700">{type}</span>
        </label>
      ))}
    </div>
  );
};

const BedroomFilter = ({ bedroomsMin, onChange }) => {
  const bedroomOptions = [
    { value: null, label: 'Any' },
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' }
  ];

  return (
    <div className="space-y-2">
      {bedroomOptions.map((option) => (
        <label key={option.value || 'any'} className="flex items-center">
          <input
            type="radio"
            name="bedrooms"
            checked={bedroomsMin === option.value}
            onChange={() => onChange({ bedroomsMin: option.value })}
            className="h-4 w-4 text-primary border-surface-300 focus:ring-primary focus:ring-2"
          />
          <span className="ml-2 text-sm text-surface-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

const BathroomFilter = ({ bathroomsMin, onChange }) => {
  const bathroomOptions = [
    { value: null, label: 'Any' },
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' }
  ];

  return (
    <div className="space-y-2">
      {bathroomOptions.map((option) => (
        <label key={option.value || 'any'} className="flex items-center">
          <input
            type="radio"
            name="bathrooms"
            checked={bathroomsMin === option.value}
            onChange={() => onChange({ bathroomsMin: option.value })}
            className="h-4 w-4 text-primary border-surface-300 focus:ring-primary focus:ring-2"
          />
          <span className="ml-2 text-sm text-surface-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export { FilterSection, PriceRangeFilter, PropertyTypeFilter, BedroomFilter, BathroomFilter };