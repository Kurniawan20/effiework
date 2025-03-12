// Types
import { Asset, AssetCategory, Location, Department, Supplier } from '@/types/apps/restaurant'

// Asset Categories
export const assetCategories: AssetCategory[] = [
  { id: 1, name: 'Kitchen Equipment' },
  { id: 2, name: 'Dining Furniture' },
  { id: 3, name: 'Bar Equipment' },
  { id: 4, name: 'Storage Equipment' },
  { id: 5, name: 'Serving Equipment' }
]

// Locations
export const locations: Location[] = [
  { id: 1, name: 'Main Kitchen' },
  { id: 2, name: 'Prep Kitchen' },
  { id: 3, name: 'Dining Area' },
  { id: 4, name: 'Bar Area' },
  { id: 5, name: 'Storage Room' }
]

// Departments
export const departments: Department[] = [
  { id: 1, name: 'Kitchen Operations' },
  { id: 2, name: 'Front of House' },
  { id: 3, name: 'Bar Operations' },
  { id: 4, name: 'Maintenance' },
  { id: 5, name: 'Storage & Inventory' }
]

// Suppliers
export const suppliers: Supplier[] = [
  { id: 1, name: 'Restaurant Supply Co.' },
  { id: 2, name: 'Kitchen Equipment Pro' },
  { id: 3, name: 'Dining Furniture Plus' },
  { id: 4, name: 'Bar Equipment Specialists' },
  { id: 5, name: 'Commercial Kitchen Direct' }
]

// Warranty Periods
export const warrantyPeriods = [
  { value: '1year', label: '1 Year' },
  { value: '2years', label: '2 Years' },
  { value: '3years', label: '3 Years' },
  { value: '5years', label: '5 Years' }
]

// Maintenance Intervals
export const maintenanceIntervals = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: '3 Months' },
  { value: 'biannual', label: '6 Months' },
  { value: 'annual', label: 'Yearly' }
]

// Restaurant Assets
export const restaurantAssets: Asset[] = [
  {
    id: 1,
    name: 'Commercial Kitchen Range',
    category: 'Kitchen Equipment',
    location: 'Main Kitchen',
    department: 'Kitchen Operations',
    supplier: 'Commercial Kitchen Direct',
    purchaseDate: '2024-01-15',
    purchaseValue: 8000,
    currentValue: 7200,
    status: 'Active',
    nextMaintenanceDate: '2024-07-15',
    specifications: {
      brand: 'Viking',
      model: 'VGR5486GSS',
      serialNumber: 'VK24831947',
      dimensions: '60" x 27.5" x 35.75"',
      powerRequirements: '240V/50A'
    }
  },
  {
    id: 2,
    name: 'Industrial Refrigerator',
    category: 'Kitchen Equipment',
    location: 'Main Kitchen',
    department: 'Kitchen Operations',
    supplier: 'Kitchen Equipment Pro',
    purchaseDate: '2024-01-20',
    purchaseValue: 12000,
    currentValue: 11400,
    status: 'Active',
    nextMaintenanceDate: '2024-07-20',
    specifications: {
      brand: 'True',
      model: 'T-49-HC',
      serialNumber: 'TR98765432',
      dimensions: '54" x 29.5" x 78.375"',
      powerRequirements: '115V/60Hz'
    }
  },
  {
    id: 3,
    name: 'Pizza Oven',
    category: 'Kitchen Equipment',
    location: 'Main Kitchen',
    department: 'Kitchen Operations',
    supplier: 'Restaurant Supply Co.',
    purchaseDate: '2024-02-01',
    purchaseValue: 15000,
    currentValue: 14500,
    status: 'Maintenance',
    nextMaintenanceDate: '2024-05-01',
    specifications: {
      brand: 'Marsal',
      model: 'SD-660',
      serialNumber: 'MS45678901',
      dimensions: '66" x 44" x 66"',
      powerRequirements: '208V/60Hz'
    }
  },
  {
    id: 4,
    name: 'Dining Room Set',
    category: 'Dining Furniture',
    location: 'Dining Area',
    department: 'Front of House',
    supplier: 'Dining Furniture Plus',
    purchaseDate: '2024-01-25',
    purchaseValue: 2500,
    currentValue: 2350,
    status: 'Active',
    nextMaintenanceDate: '2024-07-25',
    specifications: {
      brand: 'Restaurant Furniture Co',
      model: 'Modern-DR-Set',
      serialNumber: 'RF34567890',
      dimensions: 'Table: 36" x 72", Chairs: 18" x 22" x 34"',
      powerRequirements: 'N/A'
    }
  },
  {
    id: 5,
    name: 'Bar Equipment Set',
    category: 'Bar Equipment',
    location: 'Bar Area',
    department: 'Bar Operations',
    supplier: 'Bar Equipment Specialists',
    purchaseDate: '2024-02-10',
    purchaseValue: 5000,
    currentValue: 4800,
    status: 'Active',
    nextMaintenanceDate: '2024-08-10',
    specifications: {
      brand: 'Cocktail Pro',
      model: 'Premium Bar Set',
      serialNumber: 'CP12345678',
      dimensions: 'Various',
      powerRequirements: '120V/60Hz'
    }
  }
]
