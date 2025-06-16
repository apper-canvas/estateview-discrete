import propertiesData from '../mockData/properties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let properties = [...propertiesData];

const propertyService = {
  async getAll() {
    await delay(300);
    return [...properties];
  },

  async getById(id) {
    await delay(200);
    const property = properties.find(p => p.Id === parseInt(id, 10));
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  },

  async create(property) {
    await delay(400);
    const highestId = Math.max(...properties.map(p => p.Id), 0);
    const newProperty = {
      ...property,
      Id: highestId + 1,
      listingDate: new Date().toISOString()
    };
    properties.push(newProperty);
    return { ...newProperty };
  },

  async update(id, propertyData) {
    await delay(300);
    const index = properties.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    const { Id, ...updateData } = propertyData;
    properties[index] = { ...properties[index], ...updateData };
    return { ...properties[index] };
  },

  async delete(id) {
    await delay(250);
    const index = properties.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    const deletedProperty = properties[index];
    properties.splice(index, 1);
    return { ...deletedProperty };
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    const filtered = properties.filter(property =>
      property.title.toLowerCase().includes(searchTerm) ||
      property.address.toLowerCase().includes(searchTerm) ||
      property.city.toLowerCase().includes(searchTerm) ||
      property.state.toLowerCase().includes(searchTerm)
    );
    return [...filtered];
  },

  async filter(filters) {
    await delay(250);
    let filtered = [...properties];

    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= filters.priceMax);
    }
    if (filters.propertyTypes?.length) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.propertyType));
    }
    if (filters.bedroomsMin) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedroomsMin);
    }
    if (filters.bathroomsMin) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathroomsMin);
    }
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(p =>
        p.city.toLowerCase().includes(location) ||
        p.state.toLowerCase().includes(location) ||
        p.address.toLowerCase().includes(location)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.listingDate) - new Date(b.listingDate));
          break;
        default:
          break;
      }
    }

    return filtered;
  }
};

export default propertyService;