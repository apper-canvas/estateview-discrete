import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { FilterSection, PriceRangeFilter, PropertyTypeFilter, BedroomFilter, BathroomFilter } from '@/components/molecules/FilterSection';
import ApperIcon from '@/components/ApperIcon';

const PropertyFilters = ({ onFiltersChange, initialFilters = {}, className = '' }) => {
  const [filters, setFilters] = useState({
    priceMin: initialFilters.priceMin || null,
    priceMax: initialFilters.priceMax || null,
    propertyTypes: initialFilters.propertyTypes || [],
    bedroomsMin: initialFilters.bedroomsMin || null,
    bathroomsMin: initialFilters.bathroomsMin || null,
    location: initialFilters.location || '',
    sortBy: initialFilters.sortBy || 'newest'
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priceMin: null,
      priceMax: null,
      propertyTypes: [],
      bedroomsMin: null,
      bathroomsMin: null,
      location: '',
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
  };

  const hasActiveFilters = () => {
    return filters.priceMin || 
           filters.priceMax || 
           filters.propertyTypes.length > 0 || 
           filters.bedroomsMin || 
           filters.bathroomsMin || 
           filters.location || 
           filters.sortBy !== 'newest';
  };

  return (
    <div className={`bg-surface rounded-lg shadow-sm border border-surface-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-surface-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900 flex items-center">
            <ApperIcon name="Filter" className="w-5 h-5 mr-2" />
            Filters
          </h2>
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-accent hover:text-accent/80"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Sort By */}
      <div className="p-4 border-b border-surface-200">
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilters({ sortBy: e.target.value })}
          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div className="p-4 border-b border-surface-200">
        <Input
          label="Location"
          type="text"
          value={filters.location}
          onChange={(e) => updateFilters({ location: e.target.value })}
          placeholder="City, State, or ZIP"
        />
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range" defaultOpen>
        <PriceRangeFilter
          priceMin={filters.priceMin}
          priceMax={filters.priceMax}
          onChange={updateFilters}
        />
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property Type">
        <PropertyTypeFilter
          selectedTypes={filters.propertyTypes}
          onChange={updateFilters}
        />
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="Bedrooms">
        <BedroomFilter
          bedroomsMin={filters.bedroomsMin}
          onChange={updateFilters}
        />
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection title="Bathrooms">
        <BathroomFilter
          bathroomsMin={filters.bathroomsMin}
          onChange={updateFilters}
        />
      </FilterSection>
    </div>
  );
};

export default PropertyFilters;