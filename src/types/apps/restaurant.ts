// Asset Types
export interface Asset {
  id: number
  name: string
  category: string
  location: string
  department: string
  supplier: string
  purchaseDate: string
  purchaseValue: number
  currentValue: number
  status: 'Active' | 'Maintenance' | 'Retired'
  nextMaintenanceDate: string
  specifications: {
    brand: string
    model: string
    serialNumber: string
    dimensions: string
    powerRequirements: string
  }
}

// Category Type
export interface AssetCategory {
  id: number
  name: string
}

// Location Type
export interface Location {
  id: number
  name: string
}

// Department Type
export interface Department {
  id: number
  name: string
}

// Supplier Type
export interface Supplier {
  id: number
  name: string
}

// Form Types
export interface AssetFormData {
  code: string
  name: string
  category: string
  location: string
  department: string
  supplier: string
  purchaseDate: Date
  purchaseValue: number
  warrantyPeriod: string
  maintenanceInterval: string
  specifications: {
    brand: string
    model: string
    serialNumber: string
    dimensions: string
    powerRequirements: string
  }
}
