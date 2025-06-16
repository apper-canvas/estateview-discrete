import { toast } from 'react-toastify';

const propertyService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "zip_code" } },
          { field: { Name: "property_type" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "year_built" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "images" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } }
        ],
        orderBy: [
          { fieldName: "listing_date", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data?.map(property => ({
        Id: property.Id,
        title: property.title || '',
        price: property.price || 0,
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zipCode: property.zip_code || '',
        propertyType: property.property_type || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        squareFeet: property.square_feet || 0,
        yearBuilt: property.year_built || 0,
        description: property.description || '',
        features: property.features ? property.features.split(',') : [],
        images: property.images ? property.images.split(',') : [],
        listingDate: property.listing_date || new Date().toISOString(),
        status: property.status || 'For Sale'
      })) || [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "zip_code" } },
          { field: { Name: "property_type" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "year_built" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "images" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } }
        ]
      };
      
      const response = await apperClient.getRecordById('property', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Property not found');
      }
      
      const property = response.data;
      return {
        Id: property.Id,
        title: property.title || '',
        price: property.price || 0,
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zipCode: property.zip_code || '',
        propertyType: property.property_type || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        squareFeet: property.square_feet || 0,
        yearBuilt: property.year_built || 0,
        description: property.description || '',
        features: property.features ? property.features.split(',') : [],
        images: property.images ? property.images.split(',') : [],
        listingDate: property.listing_date || new Date().toISOString(),
        status: property.status || 'For Sale'
      };
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw error;
    }
  },

  async create(property) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
      const recordData = {
        title: property.title || '',
        price: property.price || 0,
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zipCode || '',
        property_type: property.propertyType || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        square_feet: property.squareFeet || 0,
        year_built: property.yearBuilt || 0,
        description: property.description || '',
        features: Array.isArray(property.features) ? property.features.join(',') : '',
        images: Array.isArray(property.images) ? property.images.join(',') : '',
        listing_date: new Date().toISOString(),
        status: property.status || 'For Sale'
      };
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.createRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const created = successfulRecords[0].data;
          return {
            Id: created.Id,
            title: created.title || '',
            price: created.price || 0,
            address: created.address || '',
            city: created.city || '',
            state: created.state || '',
            zipCode: created.zip_code || '',
            propertyType: created.property_type || '',
            bedrooms: created.bedrooms || 0,
            bathrooms: created.bathrooms || 0,
            squareFeet: created.square_feet || 0,
            yearBuilt: created.year_built || 0,
            description: created.description || '',
            features: created.features ? created.features.split(',') : [],
            images: created.images ? created.images.split(',') : [],
            listingDate: created.listing_date || new Date().toISOString(),
            status: created.status || 'For Sale'
          };
        }
      }
      
      throw new Error('Failed to create property');
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  async update(id, propertyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
      const { Id, ...updateData } = propertyData;
      const recordData = {
        Id: parseInt(id, 10),
        ...(updateData.title !== undefined && { title: updateData.title }),
        ...(updateData.price !== undefined && { price: updateData.price }),
        ...(updateData.address !== undefined && { address: updateData.address }),
        ...(updateData.city !== undefined && { city: updateData.city }),
        ...(updateData.state !== undefined && { state: updateData.state }),
        ...(updateData.zipCode !== undefined && { zip_code: updateData.zipCode }),
        ...(updateData.propertyType !== undefined && { property_type: updateData.propertyType }),
        ...(updateData.bedrooms !== undefined && { bedrooms: updateData.bedrooms }),
        ...(updateData.bathrooms !== undefined && { bathrooms: updateData.bathrooms }),
        ...(updateData.squareFeet !== undefined && { square_feet: updateData.squareFeet }),
        ...(updateData.yearBuilt !== undefined && { year_built: updateData.yearBuilt }),
        ...(updateData.description !== undefined && { description: updateData.description }),
        ...(updateData.features !== undefined && { features: Array.isArray(updateData.features) ? updateData.features.join(',') : updateData.features }),
        ...(updateData.images !== undefined && { images: Array.isArray(updateData.images) ? updateData.images.join(',') : updateData.images }),
        ...(updateData.status !== undefined && { status: updateData.status })
      };
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.updateRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updated = successfulUpdates[0].data;
          return {
            Id: updated.Id,
            title: updated.title || '',
            price: updated.price || 0,
            address: updated.address || '',
            city: updated.city || '',
            state: updated.state || '',
            zipCode: updated.zip_code || '',
            propertyType: updated.property_type || '',
            bedrooms: updated.bedrooms || 0,
            bathrooms: updated.bathrooms || 0,
            squareFeet: updated.square_feet || 0,
            yearBuilt: updated.year_built || 0,
            description: updated.description || '',
            features: updated.features ? updated.features.split(',') : [],
            images: updated.images ? updated.images.split(',') : [],
            listingDate: updated.listing_date || new Date().toISOString(),
            status: updated.status || 'For Sale'
          };
        }
      }
      
      throw new Error('Failed to update property');
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          
          throw new Error('Failed to delete property');
        }
        
        return true;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "zip_code" } },
          { field: { Name: "property_type" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "year_built" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "images" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "title",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "address",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "city",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "state",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            }
          ]
        }],
        orderBy: [
          { fieldName: "listing_date", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data?.map(property => ({
        Id: property.Id,
        title: property.title || '',
        price: property.price || 0,
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zipCode: property.zip_code || '',
        propertyType: property.property_type || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        squareFeet: property.square_feet || 0,
        yearBuilt: property.year_built || 0,
        description: property.description || '',
        features: property.features ? property.features.split(',') : [],
        images: property.images ? property.images.split(',') : [],
        listingDate: property.listing_date || new Date().toISOString(),
        status: property.status || 'For Sale'
      })) || [];
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  },

  async filter(filters) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const whereConditions = [];
      
      if (filters.priceMin) {
        whereConditions.push({
          fieldName: "price",
          operator: "GreaterThanOrEqualTo",
          values: [filters.priceMin.toString()]
        });
      }
      
      if (filters.priceMax) {
        whereConditions.push({
          fieldName: "price",
          operator: "LessThanOrEqualTo",
          values: [filters.priceMax.toString()]
        });
      }
      
      if (filters.propertyTypes?.length) {
        whereConditions.push({
          fieldName: "property_type",
          operator: "ExactMatch",
          values: filters.propertyTypes
        });
      }
      
      if (filters.bedroomsMin) {
        whereConditions.push({
          fieldName: "bedrooms",
          operator: "GreaterThanOrEqualTo",
          values: [filters.bedroomsMin.toString()]
        });
      }
      
      if (filters.bathroomsMin) {
        whereConditions.push({
          fieldName: "bathrooms",
          operator: "GreaterThanOrEqualTo",
          values: [filters.bathroomsMin.toString()]
        });
      }
      
      if (filters.location) {
        whereConditions.push({
          fieldName: "city",
          operator: "Contains",
          values: [filters.location]
        });
      }
      
      let orderBy = [{ fieldName: "listing_date", sorttype: "DESC" }];
      
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-low':
            orderBy = [{ fieldName: "price", sorttype: "ASC" }];
            break;
          case 'price-high':
            orderBy = [{ fieldName: "price", sorttype: "DESC" }];
            break;
          case 'newest':
            orderBy = [{ fieldName: "listing_date", sorttype: "DESC" }];
            break;
          case 'oldest':
            orderBy = [{ fieldName: "listing_date", sorttype: "ASC" }];
            break;
          default:
            break;
        }
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "zip_code" } },
          { field: { Name: "property_type" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "year_built" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "images" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } }
        ],
        ...(whereConditions.length > 0 && { where: whereConditions }),
        orderBy,
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data?.map(property => ({
        Id: property.Id,
        title: property.title || '',
        price: property.price || 0,
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zipCode: property.zip_code || '',
        propertyType: property.property_type || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        squareFeet: property.square_feet || 0,
        yearBuilt: property.year_built || 0,
        description: property.description || '',
        features: property.features ? property.features.split(',') : [],
        images: property.images ? property.images.split(',') : [],
        listingDate: property.listing_date || new Date().toISOString(),
        status: property.status || 'For Sale'
      })) || [];
    } catch (error) {
      console.error('Error filtering properties:', error);
      throw error;
    }
  }
};

export default propertyService;