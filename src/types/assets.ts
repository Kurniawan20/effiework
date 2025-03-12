/**
 * Asset Management Types
 */

/**
 * Asset Status Types
 */
export type AssetStatus = 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'RETIRED';

/**
 * Asset Form Data for creating new assets
 */
export interface AssetFormData {
  // Basic information
  assetCode: string;
  name: string;
  description: string;
  
  // Relationships
  categoryId: number;
  locationId: number;
  departmentId: number;
  branchId: number;
  
  // Financial information
  purchaseDate: Date | null;
  purchaseCost: number;
  
  // Status
  status: AssetStatus;
}

/**
 * Category for asset classification
 */
export interface AssetCategory {
  id: number;
  name: string;
  description?: string;
}

/**
 * Location where assets can be stored or used
 */
export interface Location {
  id: number;
  name: string;
  description?: string;
}

/**
 * Department that can own or use assets
 */
export interface Department {
  id: number
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Asset inventory data model as returned from API
 */
export interface Asset {
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
  purchaseDate: string;
  purchaseCost: number;
  status: AssetStatus;
  currentAssignedUserId?: number | null;
  currentAssignedUsername?: string | null;
}

/**
 * Asset Response from API
 */
export interface AssetResponse {
  id: number;
  assetCode: string;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  locationId: number;
  locationName: string;
  departmentId: number;
  departmentName: string;
  branchId: number;
  branchName: string;
  branchCode: string;
  purchaseDate: string | null;
  purchaseCost: number | null;
  status: AssetStatus;
  currentAssignedUserId: number | null;
  currentAssignedUsername: string | null;
}

/**
 * Pageable information
 */
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

/**
 * Sort information
 */
export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  empty: boolean;
}

/**
 * Asset list params for filtering and pagination
 */
export interface AssetListParams {
  page?: number;
  size?: number;
  status?: AssetStatus;
  categoryId?: number;
  departmentId?: number;
  search?: string;
}

// User Types
export interface User {
  id: number
  name: string
  email: string
  department?: string
  fullName?: string
  username?: string
}

export interface UserListResponse {
  content: User[]
  pageable: Pageable
  totalElements: number
  totalPages: number
  last: boolean
  size: number
  number: number
  sort: Sort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface UserListParams {
  page?: number
  size?: number
  search?: string
}

export interface AssetLocation {
  id: number
  name: string
  description?: string
  parentLocationId?: number | null
  parentLocationName?: string | null
  createdAt?: string
  updatedAt?: string
}

// Food Management Types
export interface Ingredient {
  id: number
  assetId: number
  assetCode: string
  name: string
  description: string
  unit: string
  unitCost: number
  currentStock: number
  minimumStock?: number
  shelfLifeDays: number
  storageRequirements: string
  allergenInfo: string
  supplier?: string
  createdAt: string
  updatedAt: string
}

export interface PageableResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface IngredientListResponse extends PageableResponse<Ingredient> {}

// Menu Item interfaces
export interface MenuItem {
  id: number
  name: string
  description: string
  sellingPrice: number
  assetId: number
  assetCode: string
  preparationTimeMinutes: number
  calorieCount: number
  servingSize: string
  ingredients?: MenuItemIngredient[]
}

export interface MenuItemListResponse {
  content: MenuItem[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface MenuItemIngredient {
  menuItemId: number
  ingredientId: number
  quantity: number
  unit: string
  notes: string
  createdAt: string
  updatedAt: string
  ingredientName: string | null
  ingredientCode: string | null
  unitCost: number | null
  storageRequirements: string | null
  allergenInfo: string | null
}

export interface MenuItemDetail {
  id: number
  assetId: number
  sellingPrice: number
  preparationTimeMinutes: number
  calorieCount: number
  servingSize: string
  createdAt: string
  updatedAt: string
  name: string
  description: string
  assetCode: string
  ingredients: MenuItemIngredient[]
}

/**
 * Branch Management Types
 */

export interface Branch {
  id: number;
  code: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BranchCreateRequest {
  code: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  notes?: string;
  isActive: boolean;
}

export interface BranchUpdateRequest extends Partial<BranchCreateRequest> {}

/**
 * Asset Transfer Types
 */

export type AssetTransferStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface AssetTransferRequest {
  assetId: number;
  destinationBranchId: number;
  destinationLocationId: number;
  destinationDepartmentId: number;
  reason: string;
  notes?: string;
  transferDate?: string;
}

export interface AssetTransferResponse {
  id: number;
  assetId: number;
  assetCode: string;
  assetName: string;
  sourceBranchId: number;
  sourceBranchName: string;
  destinationBranchId: number;
  destinationBranchName: string;
  sourceLocationId: number;
  sourceLocationName: string;
  destinationLocationId: number;
  destinationLocationName: string;
  sourceDepartmentId: number;
  sourceDepartmentName: string;
  destinationDepartmentId: number;
  destinationDepartmentName: string;
  requestedById: number;
  requestedByName: string;
  approvedById: number | null;
  approvedByName: string | null;
  status: AssetTransferStatus;
  reason: string;
  transferDate: string | null;
  approvedDate: string | null;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AssetTransferListParams {
  page?: number;
  size?: number;
  status?: AssetTransferStatus;
  assetId?: number;
  search?: string;
}
