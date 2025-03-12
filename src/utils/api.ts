// API Utility functions for authentication and API requests

// Type Imports
import { 
  AssetCategory, 
  AssetCreateRequest, 
  AssetListParams, 
  AssetResponse, 
  AssetLocation,
  Department, 
  User,
  UserListParams,
  UserListResponse,
  PaginatedResponse,
  Ingredient,
  MenuItem,
  MenuItemListResponse,
  MenuItemDetail,
  Branch,
  BranchCreateRequest,
  BranchUpdateRequest
} from '@/types/assets';

/**
 * Base URL for API requests
 */
export const API_BASE_URL = 'http://localhost:8083/api';

/**
 * Get the authentication token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Add debug log to help troubleshoot token issues
      if (!token) {
        console.warn('No authentication token found in localStorage');
        
        // Try to get token from session storage as fallback
        const sessionToken = sessionStorage.getItem('accessToken');
        if (sessionToken) {
          console.log('Found token in sessionStorage, using it and syncing to localStorage');
          localStorage.setItem('accessToken', sessionToken);
          return sessionToken;
        }
      } else {
        console.log('Token found in localStorage');
      }
      
      return token;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }
  return null;
};

/**
 * Set the authentication token in localStorage
 */
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
    console.log('Authentication token set in localStorage');
  }
};

/**
 * Clear the authentication token from localStorage
 */
export const clearToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
};

/**
 * Check if a user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Check if a user is authenticated with a valid token
 */
export const hasValidToken = (): boolean => {
  const token = getToken();
  return !!token && token.length > 10; // Basic validation that token exists and has reasonable length
};

/**
 * Default headers for API requests
 */
export const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      // Add debug log to confirm token is being added to headers
      console.log('Adding authorization header with token');
    } else {
      console.warn('Authorization header not added - no token available');
    }
  }

  return headers;
};

/**
 * Handle API responses and errors
 */
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    // Handle different error status codes appropriately
    if (response.status === 401) {
      // Clear token on unauthorized access
      clearToken();
      
      // Only redirect to login page if explicitly logged out or token expired
      // This prevents unwanted redirects during form submissions
      if (typeof window !== 'undefined' && response.url.includes('/auth/')) {
        window.location.href = '/login';
      }
    }
    
    // Try to parse error response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred');
    } catch (e) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  }
  
  return response.json();
};

/**
 * Generic function to make API requests
 */
export const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  data: any = null,
  requireAuth: boolean = true
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Check authentication before making request if required
  if (requireAuth && !hasValidToken()) {
    console.error('Authentication required but no valid token available');
    throw new Error('Authentication required. Please log in again.');
  }
  
  const options: RequestInit = {
    method,
    headers: getHeaders(requireAuth),
  };
  
  if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
    options.body = JSON.stringify(data);
  }
  
  try {
    console.log(`Making ${method} request to ${endpoint} with auth: ${requireAuth}`);
    const response = await fetch(url, options);
    return handleApiResponse(response);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Authentication API functions
 */
export const authApi = {
  login: async (username: string, password: string) => {
    return apiRequest('/auth/login', 'POST', { username, password }, false);
  },
  
  logout: async () => {
    clearToken();
    // You might want to call a logout endpoint here if your API has one
    // return apiRequest('/auth/logout', 'POST');
  },
  
  getCurrentUser: async () => {
    return apiRequest('/auth/me', 'GET');
  }
};

/**
 * Interface for Asset API requests
 */
export interface AssetCreateRequest {
  assetCode: string;
  name: string;
  description: string;
  categoryId: number;
  locationId: number;
  departmentId: number;
  branchId: number;
  purchaseDate: string;
  purchaseCost: number;
  status: string;
}

/**
 * Interface for Asset API responses
 */
export interface AssetResponse {
  id: number;
  assetCode: string;
  name: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  locationId: number;
  locationName: string;
  departmentId: number;
  departmentName: string;
  branchId: number;
  branchName: string;
  purchaseDate: string;
  purchaseCost: number;
  status: string;
  currentAssignedUserId?: number | null;
  currentAssignedUsername?: string | null;
}

/**
 * Asset API functions
 */
export const assetApi = {
  /**
   * Create a new asset
   */
  createAsset: async (assetData: AssetCreateRequest): Promise<AssetResponse> => {
    return apiRequest('/assets', 'POST', assetData);
  },
  
  /**
   * Get all assets with pagination and filtering
   */
  getAssets: async (params: AssetListParams = {}): Promise<PaginatedResponse<AssetResponse>> => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    
    // Add filter params
    if (params.status) queryParams.append('status', params.status);
    if (params.categoryId) queryParams.append('categoryId', params.categoryId.toString());
    if (params.departmentId) queryParams.append('departmentId', params.departmentId.toString());
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/assets/my-assets${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Fetching assets with params: ${JSON.stringify(params)}`);
    return apiRequest(endpoint, 'GET');
  },
  
  /**
   * Get a single asset by ID
   */
  getAssetById: async (id: number): Promise<AssetResponse> => {
    return apiRequest(`/assets/${id}`, 'GET');
  },
  
  /**
   * Update an asset
   */
  updateAsset: async (id: number, assetData: Partial<AssetCreateRequest>): Promise<AssetResponse> => {
    return apiRequest(`/assets/${id}`, 'PUT', assetData);
  },
  
  /**
   * Delete an asset
   */
  deleteAsset: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete asset')
    }
  },
  
  /**
   * Assign an asset to a user
   */
  assignAsset: async (assetId: number, userId: number): Promise<AssetResponse> => {
    const response = await fetch(`${API_BASE_URL}/assets/${assetId}/assign?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to assign asset')
    }

    return response.json()
  },
  
  /**
   * Unassign an asset from a user
   */
  unassignAsset: async (assetId: number): Promise<AssetResponse> => {
    const response = await fetch(`${API_BASE_URL}/assets/${assetId}/unassign`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to unassign asset')
    }

    return response.json()
  }
}

/**
 * Category API functions
 */
export const categoryApi = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<AssetCategory[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch categories')
    }

    return response.json()
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: number): Promise<AssetCategory> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch category details')
    }

    return response.json()
  },

  /**
   * Create a new category
   */
  createCategory: async (data: { name: string, description?: string }): Promise<AssetCategory> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create category')
    }

    return response.json()
  },

  /**
   * Update an existing category
   */
  updateCategory: async (id: number, data: { name: string, description?: string }): Promise<AssetCategory> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update category')
    }

    return response.json()
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete category')
    }
  }
}

/**
 * Location API functions
 */
export const locationApi = {
  /**
   * Get all locations
   */
  getLocations: async (): Promise<AssetLocation[]> => {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch locations')
    }

    return response.json()
  },

  /**
   * Get root locations (locations without parents)
   */
  getRootLocations: async (): Promise<AssetLocation[]> => {
    const response = await fetch(`${API_BASE_URL}/locations/root`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch root locations')
    }

    return response.json()
  },

  /**
   * Get location by ID
   */
  getLocationById: async (id: number): Promise<AssetLocation> => {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch location')
    }

    return response.json()
  },

  /**
   * Create a new location
   */
  createLocation: async (data: Omit<AssetLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<AssetLocation> => {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create location')
    }

    return response.json()
  },

  /**
   * Update an existing location
   */
  updateLocation: async (id: number, data: Partial<Omit<AssetLocation, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AssetLocation> => {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update location')
    }

    return response.json()
  },

  /**
   * Delete a location
   */
  deleteLocation: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete location')
    }
  }
}

/**
 * Department API
 */
export const departmentApi = {
  /**
   * Get all departments
   */
  getDepartments: async (): Promise<Department[]> => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch departments')
    }

    return response.json()
  },

  /**
   * Get department by ID
   */
  getDepartmentById: async (id: number): Promise<Department> => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch department')
    }

    return response.json()
  },

  /**
   * Create a new department
   */
  createDepartment: async (data: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create department')
    }

    return response.json()
  },

  /**
   * Update an existing department
   */
  updateDepartment: async (id: number, data: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update department')
    }

    return response.json()
  },

  /**
   * Delete a department
   */
  deleteDepartment: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete department')
    }
  }
}

/**
 * User API functions
 */
export const userApi = {
  /**
   * Get users with pagination
   */
  getUsers: async (params: UserListParams): Promise<UserListResponse> => {
    // Build query string from params
    const queryParams = new URLSearchParams()
    
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString())
    }
    
    if (params.size !== undefined) {
      queryParams.append('size', params.size.toString())
    }
    
    if (params.search) {
      queryParams.append('search', params.search)
    }
    
    const queryString = queryParams.toString()
    const url = `${API_BASE_URL}/users${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch users')
    }

    return response.json()
  },
  
  /**
   * Get user by ID
   */
  getUserById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch user details')
    }

    return response.json()
  }
}

/**
 * Food Management API
 */
export const foodManagementApi = {
  // Ingredients API
  async getIngredients(page = 0, size = 10): Promise<IngredientListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/food/ingredients?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ingredients: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw error;
    }
  },

  async getIngredientById(id: number): Promise<Ingredient> {
    try {
      const response = await fetch(`${API_BASE_URL}/food/ingredients/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ingredient: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ingredient with id ${id}:`, error);
      throw error;
    }
  },

  async createIngredient(data: any): Promise<Ingredient> {
    try {
      const response = await fetch(`${API_BASE_URL}/food/ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to create ingredient: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating ingredient:', error);
      throw error;
    }
  },

  async updateIngredient(id: number, data: any): Promise<Ingredient> {
    try {
      const response = await fetch(`${API_BASE_URL}/food/ingredients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to update ingredient: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating ingredient with id ${id}:`, error);
      throw error;
    }
  },

  async deleteIngredient(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/food/ingredients/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ingredient: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting ingredient with id ${id}:`, error);
      throw error;
    }
  },

  // Menu Items API
  async getMenuItems(page = 0, size = 10): Promise<MenuItemListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/food/menu-items?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch menu items: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  async getMenuItemById(id: number): Promise<MenuItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/food/menu-items/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch menu item: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching menu item with id ${id}:`, error);
      throw error;
    }
  },

  async createMenuItem(data: any): Promise<MenuItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/food/menu-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to create menu item: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  async updateMenuItem(id: number, data: any): Promise<MenuItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/food/menu-items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to update menu item: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating menu item with id ${id}:`, error);
      throw error;
    }
  },

  async deleteMenuItem(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/food/menu-items/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete menu item: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting menu item with id ${id}:`, error);
      throw error;
    }
  },

  // Assets for Food
  async getAvailableAssetsForFood(search = '', page = 0, size = 10, sort = 'name,asc'): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/assets/available-for-food?search=${encodeURIComponent(search)}&page=${page}&size=${size}&sort=${sort}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching available assets for food: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch available assets for food:', error);
      throw error;
    }
  }
};

/**
 * Food API
 */
export const foodApi = {
  /**
   * Get menu item details by ID
   */
  getMenuItem: async (id: number): Promise<MenuItemDetail> => {
    return apiRequest(`/food/menu-items/${id}`, 'GET');
  },
};

/**
 * Branch Management API
 */
export const branchApi = {
  /**
   * Get branches with pagination and filtering
   */
  getBranches: async (params: {
    name?: string;
    isActive?: boolean;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PaginatedResponse<Branch>> => {
    const queryParams = new URLSearchParams();
    
    if (params.name !== undefined) queryParams.append('name', params.name);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort !== undefined) queryParams.append('sort', params.sort);
    
    const queryString = queryParams.toString();
    const endpoint = `/branches${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint, 'GET');
  },

  /**
   * Get branch by ID
   */
  getBranchById: async (id: number): Promise<Branch> => {
    return apiRequest(`/branches/${id}`, 'GET');
  },

  /**
   * Create new branch
   */
  createBranch: async (data: BranchCreateRequest): Promise<Branch> => {
    return apiRequest('/branches', 'POST', data);
  },

  /**
   * Update branch
   */
  updateBranch: async (id: number, data: BranchUpdateRequest): Promise<Branch> => {
    return apiRequest(`/branches/${id}`, 'PUT', data);
  },

  /**
   * Delete branch
   */
  deleteBranch: async (id: number): Promise<void> => {
    return apiRequest(`/branches/${id}`, 'DELETE');
  },
};

/**
 * Asset Transfer API
 */
export const assetTransferApi = {
  /**
   * Create a new asset transfer request
   */
  createTransfer: async (transferData: AssetTransferRequest): Promise<AssetTransferResponse> => {
    if (!hasValidToken()) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const response = await apiRequest('/asset-transfers', 'POST', transferData, true);
    
    return response;
  },

  /**
   * Get all asset transfers with pagination and filtering
   */
  getTransfers: async (params: AssetTransferListParams = {}): Promise<PaginatedResponse<AssetTransferResponse>> => {
    if (!hasValidToken()) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.assetId) queryParams.append('assetId', params.assetId.toString());
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await apiRequest(`/asset-transfers${queryString}`, 'GET', null, true);
    
    return response;
  },

  /**
   * Get a single asset transfer by ID
   */
  getTransferById: async (id: number): Promise<AssetTransferResponse> => {
    if (!hasValidToken()) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const response = await apiRequest(`/asset-transfers/${id}`, 'GET', null, true);
    
    return response;
  },
  
  /**
   * Get user's transfer requests with pagination and filtering
   */
  getMyTransferRequests: async (params: {
    page?: number;
    size?: number;
    sort?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<PaginatedResponse<AssetTransferResponse>> => {
    if (!hasValidToken()) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort !== undefined) queryParams.append('sort', params.sort);
    if (params.status !== undefined) queryParams.append('status', params.status);
    if (params.startDate !== undefined) queryParams.append('startDate', params.startDate);
    if (params.endDate !== undefined) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const endpoint = `/asset-transfers/my-requests${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiRequest(endpoint, 'GET', null, true);
    
    return response;
  },

  /**
   * Approve an asset transfer
   */
  approveTransfer: async (id: number, notes: string = ''): Promise<AssetTransferResponse> => {
    if (!hasValidToken()) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const payload = {
      status: 'APPROVED',
      notes
    };
    
    const response = await apiRequest(`/asset-transfers/${id}/status`, 'PUT', payload, true);
    
    return response;
  },

  /**
   * Reject an asset transfer
   */
  rejectTransfer: async (id: number, notes: string): Promise<AssetTransferResponse> => {
    if (!hasValidToken()) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const payload = {
      status: 'REJECTED',
      notes
    };
    
    const response = await apiRequest(`/asset-transfers/${id}/status`, 'PUT', payload, true);
    
    return response;
  },

  /**
   * Complete an asset transfer
   */
  completeTransfer: async (id: number, notes: string = ''): Promise<AssetTransferResponse> => {
    if (!hasValidToken()) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const payload = {
      status: 'COMPLETED',
      notes
    };
    
    const response = await apiRequest(`/asset-transfers/${id}/status`, 'PUT', payload, true);
    
    return response;
  },

  /**
   * Cancel an asset transfer
   */
  cancelTransfer: async (id: number, notes: string = ''): Promise<AssetTransferResponse> => {
    if (!hasValidToken()) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const payload = {
      status: 'CANCELLED',
      notes
    };
    
    const response = await apiRequest(`/asset-transfers/${id}/status`, 'PUT', payload, true);
    
    return response;
  },
};
