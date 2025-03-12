import { apiRequest, hasValidToken } from '@/utils/api';
import { AssetCategory, Department, Location } from '@/types/assets';

/**
 * Service to handle master data (reference data) for the application
 */
export const MasterDataService = {
  /**
   * Get all asset categories
   */
  getAssetCategories: async (): Promise<AssetCategory[]> => {
    // Verify token availability before making request
    if (!hasValidToken()) {
      console.error('No valid token available for categories request');
      throw new Error('Authentication required. Please log in again.');
    }
    
    console.log('Fetching asset categories from API');
    const response = await apiRequest('/categories', 'GET', null, true);
    console.log('Categories fetched successfully:', response);
    return response;
  },

  /**
   * Get all locations
   */
  getLocations: async (): Promise<Location[]> => {
    // Verify token availability before making request
    if (!hasValidToken()) {
      console.error('No valid token available for locations request');
      throw new Error('Authentication required. Please log in again.');
    }
    
    console.log('Fetching locations from API');
    const response = await apiRequest('/locations', 'GET', null, true);
    console.log('Locations fetched successfully:', response);
    return response;
  },

  /**
   * Get all departments
   */
  getDepartments: async (): Promise<Department[]> => {
    // Verify token availability before making request
    if (!hasValidToken()) {
      console.error('No valid token available for departments request');
      throw new Error('Authentication required. Please log in again.');
    }
    
    console.log('Fetching departments from API');
    const response = await apiRequest('/departments', 'GET', null, true);
    console.log('Departments fetched successfully:', response);
    return response;
  }
};
