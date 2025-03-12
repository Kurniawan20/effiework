'use client'

// React Imports
import { useEffect, useState, useCallback } from 'react'

// Next Imports
import { useSession } from 'next-auth/react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'

// Form Imports
import { useForm, Controller } from 'react-hook-form'

// Custom Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Type Imports
import type { AssetFormData, AssetCategory, Location, Department, AssetStatus, Branch } from '@/types/assets'
import type { AssetCreateRequest } from '@/utils/api'

// API Imports
import { assetApi, getToken, setToken, branchApi } from '@/utils/api'
import { MasterDataService } from '@/services/master-data.service'

const NewAsset = () => {
  const { data: session } = useSession()

  // States
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false) 
  const [error, setError] = useState<string | null>(null)
  
  // Master data states
  const [categories, setCategories] = useState<AssetCategory[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  // Form Hook
  const { control, handleSubmit, reset } = useForm<AssetFormData>({
    defaultValues: {
      assetCode: '',
      name: '',
      description: '',
      categoryId: 0,
      locationId: 0,
      departmentId: 0,
      branchId: 0,
      purchaseDate: null,
      purchaseCost: 0,
      status: 'AVAILABLE'
    }
  })

  // Ensure token is available from session
  useEffect(() => {
    if (session?.user?.token) {
      // Synchronize token from session to localStorage
      setToken(session.user.token)
      console.log('Token synchronized from session in asset form')
    }
  }, [session])

  // Function to verify token before submission
  const verifyTokenAvailability = useCallback(() => {
    const token = getToken()

    if (!token && session?.user?.token) {
      console.log('Token not found in localStorage but available in session, synchronizing')
      setToken(session.user.token)
      
      return true
    }
    
    return !!token
  }, [session])

  // Generate random asset data
  const generateRandomData = () => {
    if (categories.length === 0 || locations.length === 0 || departments.length === 0 || branches.length === 0) {
      setError('Cannot generate random data: Master data not loaded')
      
      return
    }

    // Determine if we should generate food items or equipment (50/50 chance)
    const generateFoodItem = Math.random() > 0.5;

    if (generateFoodItem) {
      // Food items for ingredients or menu items
      const foodPrefixes = ['FOOD', 'INGR', 'PROD', 'ITEM', 'MENU']
      
      const foodTypes = [
        // Proteins
        'Chicken', 'Beef', 'Lamb', 'Salmon', 'Tuna', 'Shrimp', 'Tofu',
        
        // Produce
        'Tomatoes', 'Potatoes', 'Onions', 'Lettuce', 'Broccoli', 'Carrots', 'Mushrooms',
        
        // Grains/Starches
        'Rice', 'Pasta', 'Bread', 'Flour', 'Quinoa',
        
        // Dairy
        'Cheese', 'Milk', 'Cream', 'Butter', 'Yogurt',
        
        // Prepared Foods
        'Pizza', 'Burger', 'Salad', 'Soup', 'Sandwich', 'Steak', 'Dessert'
      ]
      
      const foodQualities = [
        'Fresh', 'Organic', 'Premium', 'Grade A', 'Local', 'Imported', 'Wild-caught',
        'Farm-raised', 'Cage-free', 'Grass-fed', 'Artisanal', 'Gourmet', 'House-made'
      ]
      
      const foodDescriptions = [
        'High quality', 'Locally sourced', 'Seasonal', 'Sustainably harvested',
        'Specialty', 'Traditional recipe', 'Signature blend', 'Hand-selected',
        'Carefully prepared', 'Premium quality', 'Organic certified', 'Ethically sourced'
      ]
      
      const foodPreparations = [
        'Diced', 'Sliced', 'Whole', 'Filleted', 'Ground', 'Pureed', 'Chopped',
        'Frozen', 'Fresh', 'Dried', 'Canned', 'Bottled', 'Packaged', 'Bulk'
      ]

      // Generate random values for food
      const randomPrefix = foodPrefixes[Math.floor(Math.random() * foodPrefixes.length)]
      const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      const randomFoodType = foodTypes[Math.floor(Math.random() * foodTypes.length)]
      const randomQuality = foodQualities[Math.floor(Math.random() * foodQualities.length)]
      const randomDescription = foodDescriptions[Math.floor(Math.random() * foodDescriptions.length)]
      const randomPreparation = foodPreparations[Math.floor(Math.random() * foodPreparations.length)]
      
      // Get random category, location, department, and branch
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      const randomLocation = locations[Math.floor(Math.random() * locations.length)]
      const randomDepartment = departments[Math.floor(Math.random() * departments.length)]
      const randomBranch = branches[Math.floor(Math.random() * branches.length)]
      
      // Generate random purchase date (within the last 6 months for food)
      const today = new Date()
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(today.getMonth() - 6)

      const randomDate = new Date(
        sixMonthsAgo.getTime() + Math.random() * (today.getTime() - sixMonthsAgo.getTime())
      )
      
      // Generate random purchase cost for food (between $5 and $500)
      const randomCost = parseFloat((Math.random() * 495 + 5).toFixed(2))
      
      // Set form data for food
      reset({
        assetCode: `${randomPrefix}-${randomNumber}`,
        name: `${randomQuality} ${randomPreparation} ${randomFoodType}`,
        description: `${randomDescription} ${randomFoodType}. ${randomPreparation} and ready for use in various recipes and menu items.`,
        categoryId: randomCategory.id,
        locationId: randomLocation.id,
        departmentId: randomDepartment.id,
        branchId: randomBranch.id,
        purchaseDate: randomDate,
        purchaseCost: randomCost,
        status: 'AVAILABLE'
      })
    } else {
      // Equipment items
      const assetPrefixes = ['EQP', 'MACH', 'TOOL', 'DEV', 'APP']
      
      const randomAssetTypes = [
        'Refrigerator', 'Freezer', 'Oven', 'Grill', 'Fryer', 'Mixer', 'Blender',
        'Slicer', 'Processor', 'Cooker', 'Warmer', 'Steamer', 'Dishwasher', 'Ice Machine',
        'Coffee Maker', 'Espresso Machine', 'Juicer', 'Griddle', 'Range', 'Broiler',
        'Toaster', 'Microwave', 'Hood System', 'Sink', 'Table', 'Rack', 'Cabinet',
        'Display Case', 'POS System', 'Scale', 'Vacuum Sealer', 'Thermometer'
      ]
      
      const randomBrands = [
        'Vulcan', 'Hobart', 'Rational', 'True', 'Beverage-Air', 'Manitowoc', 'Hoshizaki',
        'Bunn', 'Vitamix', 'Robot Coupe', 'Waring', 'Globe', 'Garland', 'Pitco',
        'Frymaster', 'Alto-Shaam', 'Cambro', 'Vollrath', 'Turbo Air', 'Hatco',
        'Southbend', 'Cleveland', 'Blodgett', 'Avantco', 'Delfield', 'Scotsman'
      ]
      
      const randomModels = [
        'Pro Series', 'Commercial', 'Industrial', 'Heavy-Duty', 'Standard', 'Compact',
        'XL', 'Mini', 'Countertop', 'Floor Model', 'High-Capacity', 'Energy Star',
        'Professional', 'Economy'
      ]
      
      const randomDescriptions = [
        'High capacity', 'Energy efficient', 'Commercial grade', 
        'Easy to clean', 'Stainless steel', 'Temperature controlled', 
        'Programmable', 'Multi-function', 'Space-saving design', 
        'High output', 'Digital controls', 'NSF certified'
      ]

      // Generate random values for equipment
      const randomPrefix = assetPrefixes[Math.floor(Math.random() * assetPrefixes.length)]
      const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      const randomAssetType = randomAssetTypes[Math.floor(Math.random() * randomAssetTypes.length)]
      const randomBrand = randomBrands[Math.floor(Math.random() * randomBrands.length)]
      const randomModel = randomModels[Math.floor(Math.random() * randomModels.length)]
      const randomDescription = randomDescriptions[Math.floor(Math.random() * randomDescriptions.length)]
      
      // Get random category, location, department, and branch
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      const randomLocation = locations[Math.floor(Math.random() * locations.length)]
      const randomDepartment = departments[Math.floor(Math.random() * departments.length)]
      const randomBranch = branches[Math.floor(Math.random() * branches.length)]
      
      // Generate random purchase date (within the last 3 years for equipment)
      const today = new Date()
      const threeYearsAgo = new Date()
      threeYearsAgo.setFullYear(today.getFullYear() - 3)

      const randomDate = new Date(
        threeYearsAgo.getTime() + Math.random() * (today.getTime() - threeYearsAgo.getTime())
      )
      
      // Generate random purchase cost for restaurant equipment (between $500 and $15000)
      const randomCost = parseFloat((Math.random() * 14500 + 500).toFixed(2))
      
      // Generate random status (weighted toward Available)
      const statusList = ['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'ASSIGNED', 'ASSIGNED', 'MAINTENANCE', 'RETIRED']
      const randomStatus = statusList[Math.floor(Math.random() * statusList.length)] as AssetStatus
      
      // Set form data for equipment
      reset({
        assetCode: `${randomPrefix}-${randomNumber}`,
        name: `${randomBrand} ${randomAssetType} ${randomModel}`,
        description: `${randomDescription} ${randomBrand} ${randomAssetType} for restaurant use. Ideal for commercial kitchen operations with high-volume food preparation.`,
        categoryId: randomCategory.id,
        locationId: randomLocation.id,
        departmentId: randomDepartment.id,
        branchId: randomBranch.id,
        purchaseDate: randomDate,
        purchaseCost: randomCost,
        status: randomStatus
      })
    }
  }

  // Load master data when component mounts
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setLoading(true)
        
        // Ensure token is available
        if (!verifyTokenAvailability()) {
          console.error('No authentication token available')
          setError('Authentication token not available. Please log in again.')
          setLoading(false)
          
          return
        }
        
        // Load categories, locations, and departments
        const [categoriesData, locationsData, departmentsData] = await Promise.all([
          MasterDataService.getAssetCategories(),
          MasterDataService.getLocations(),
          MasterDataService.getDepartments()
        ])
        
        // Load branches
        const branchesResponse = await branchApi.getBranches({
          isActive: true,
          page: 0,
          size: 100,
          sort: 'name,asc'
        })
        
        setCategories(categoriesData)
        setLocations(locationsData)
        setDepartments(departmentsData)
        setBranches(branchesResponse.content)
        
        setLoading(false)
      } catch (err) {
        console.error('Error loading master data:', err)
        setError('Failed to load master data. Please refresh the page.')
        setLoading(false)
      }
    }
    
    if (session?.user?.token) {
      loadMasterData()
    }
  }, [session?.user?.token, verifyTokenAvailability])

  // Handle form submission
  const onSubmit = async (data: AssetFormData) => {
    try {
      // Verify token availability
      if (!verifyTokenAvailability()) {
        setError('Authentication token not available. Please log in again.')
        
        return
      }
      
      setSubmitting(true)
      setError(null)
      
      // Format date for API
      const formattedDate = data.purchaseDate ? 
        new Date(data.purchaseDate).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0]
      
      // Prepare data for API
      const assetData: AssetCreateRequest = {
        assetCode: data.assetCode,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        locationId: data.locationId,
        departmentId: data.departmentId,
        branchId: data.branchId,
        purchaseDate: formattedDate,
        purchaseCost: data.purchaseCost,
        status: data.status
      }
      
      console.log('Creating new asset:', assetData)
      
      // Call API to create asset
      const response = await assetApi.createAsset(assetData)
      
      console.log('Asset created:', response)
      setSubmitSuccess(true)
      
      // Reset form after successful submission
      reset()
      
      // Redirect to asset list after successful creation
      setTimeout(() => {
        window.location.href = '/en/asset-management/list'
      }, 1500)
    } catch (err) {
      console.error('Error creating asset:', err)
      setError(err instanceof Error ? err.message : 'Failed to create asset. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader 
                title='New Asset Registration' 
                subheader='Register a new asset in the system'
              />
              <CardContent>
                <Grid container spacing={4}>
                  {/* Basic Information */}
                  <Grid item xs={12}>
                    <Typography variant='h6' sx={{ mb: 4 }}>Basic Information</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='assetCode'
                      control={control}
                      rules={{ required: 'Asset Code is required' }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Asset Code'
                          placeholder='AST-001'
                          error={Boolean(fieldState.error)}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='name'
                      control={control}
                      rules={{ required: 'Asset Name is required' }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Asset Name'
                          placeholder='Dell Latitude 5420'
                          error={Boolean(fieldState.error)}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          label='Description'
                          placeholder='Enter asset description'
                        />
                      )}
                    />
                  </Grid>

                  {/* Categories and Location */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='categoryId'
                      control={control}
                      rules={{ required: 'Category is required', min: { value: 1, message: 'Please select a category' } }}
                      render={({ field, fieldState }) => (
                        <FormControl fullWidth error={Boolean(fieldState.error)}>
                          <InputLabel id='category-select-label'>Category</InputLabel>
                          <Select
                            {...field}
                            labelId='category-select-label'
                            label='Category'
                            value={field.value || ''}
                          >
                            <MenuItem value={0} disabled>Select Category</MenuItem>
                            {categories.map(category => (
                              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                            ))}
                          </Select>
                          {fieldState.error && (
                            <Typography variant='caption' color='error'>
                              {fieldState.error.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='locationId'
                      control={control}
                      rules={{ required: 'Location is required', min: { value: 1, message: 'Please select a location' } }}
                      render={({ field, fieldState }) => (
                        <FormControl fullWidth error={Boolean(fieldState.error)}>
                          <InputLabel id='location-select-label'>Location</InputLabel>
                          <Select
                            {...field}
                            labelId='location-select-label'
                            label='Location'
                            value={field.value || ''}
                          >
                            <MenuItem value={0} disabled>Select Location</MenuItem>
                            {locations.map(location => (
                              <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                            ))}
                          </Select>
                          {fieldState.error && (
                            <Typography variant='caption' color='error'>
                              {fieldState.error.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='departmentId'
                      control={control}
                      rules={{ required: 'Department is required', min: { value: 1, message: 'Please select a department' } }}
                      render={({ field, fieldState }) => (
                        <FormControl fullWidth error={Boolean(fieldState.error)}>
                          <InputLabel id='department-select-label'>Department</InputLabel>
                          <Select
                            {...field}
                            labelId='department-select-label'
                            label='Department'
                            value={field.value || ''}
                          >
                            <MenuItem value={0} disabled>Select Department</MenuItem>
                            {departments.map(department => (
                              <MenuItem key={department.id} value={department.id}>{department.name}</MenuItem>
                            ))}
                          </Select>
                          {fieldState.error && (
                            <Typography variant='caption' color='error'>
                              {fieldState.error.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='branchId'
                      control={control}
                      rules={{ required: 'Branch is required', min: { value: 1, message: 'Please select a branch' } }}
                      render={({ field, fieldState }) => (
                        <FormControl fullWidth error={Boolean(fieldState.error)}>
                          <InputLabel id='branch-select-label'>Branch</InputLabel>
                          <Select
                            {...field}
                            labelId='branch-select-label'
                            label='Branch'
                            value={field.value || ''}
                          >
                            <MenuItem value={0} disabled>Select Branch</MenuItem>
                            {branches.map(branch => (
                              <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>
                            ))}
                          </Select>
                          {fieldState.error && (
                            <Typography variant='caption' color='error'>
                              {fieldState.error.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Purchase Information */}
                  <Grid item xs={12}>
                    <Typography variant='h6' sx={{ mb: 4, mt: 4 }}>Purchase Information</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='purchaseDate'
                      control={control}
                      rules={{ required: 'Purchase Date is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <AppReactDatepicker
                          {...field}
                          selected={field.value}
                          onChange={date => field.onChange(date)}
                          customInput={
                            <TextField
                              fullWidth
                              label='Purchase Date'
                              error={Boolean(error)}
                              helperText={error?.message}
                            />
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='purchaseCost'
                      control={control}
                      rules={{ 
                        required: 'Purchase Cost is required',
                        min: { value: 0, message: 'Cost cannot be negative' }
                      }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          label='Purchase Cost'
                          placeholder='0.00'
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
                          }}
                          error={Boolean(fieldState.error)}
                          helperText={fieldState.error?.message || 'Enter cost in Indonesian Rupiah (IDR)'}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            
                            field.onChange(isNaN(value) ? 0 : value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant='contained' 
                    color='secondary'
                    onClick={generateRandomData}
                    disabled={loading || categories.length === 0}
                  >
                    Generate Random Data
                  </Button>
                  <Button 
                    type='submit' 
                    variant='contained' 
                    disabled={submitting}
                    endIcon={submitting ? <CircularProgress size={20} /> : null}
                  >
                    Register Asset
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant='outlined' onClick={() => reset()}>
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* Success Message */}
      <Snackbar 
        open={submitSuccess} 
        autoHideDuration={3000} 
        onClose={() => setSubmitSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity='success' 
          variant='filled'
          sx={{ width: '100%' }}
        >
          Asset created successfully!
        </Alert>
      </Snackbar>

      {/* Error Message */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            severity='error' 
            variant='filled'
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </>
  )
}

export default NewAsset
