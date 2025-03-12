'use client'

// React Imports
import { useEffect, useState, useCallback } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'

// Form Imports
import { useForm, Controller } from 'react-hook-form'

// Custom Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Type Imports
import type { AssetFormData, AssetCategory, Location, Department, AssetStatus, Branch } from '@/types/assets'

// API Imports
import { assetApi, getToken, setToken, branchApi } from '@/utils/api'
import { MasterDataService } from '@/services/master-data.service'


// Status Options
const statusOptions: { value: AssetStatus; label: string }[] = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'RETIRED', label: 'Retired' }
]

interface EditAssetProps {
  params: {
    id: string
  }
}

const EditAsset = ({ params }: EditAssetProps) => {
  const router = useRouter()
  const { data: session } = useSession()
  const assetId = parseInt(params.id)

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
  const { control, handleSubmit, setValue } = useForm<AssetFormData>({
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
      console.log('Token synchronized from session in asset edit form')
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

  // Load asset data and master data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Ensure token is available
        if (!verifyTokenAvailability()) {
          console.error('No authentication token available')
          setError('Authentication token not available. Please log in again.')
          setLoading(false)
          
          return
        }
        
        // Load asset data
        const assetData = await assetApi.getAssetById(assetId)
        
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
        
        // Set form values
        setValue('assetCode', assetData.assetCode)
        setValue('name', assetData.name)
        setValue('description', assetData.description || '')
        setValue('categoryId', assetData.categoryId)
        setValue('locationId', assetData.locationId)
        setValue('departmentId', assetData.departmentId)
        setValue('branchId', assetData.branchId)
        setValue('purchaseCost', assetData.purchaseCost)
        setValue('status', assetData.status as AssetStatus)
        
        // Convert purchase date string to Date object
        if (assetData.purchaseDate) {
          setValue('purchaseDate', new Date(assetData.purchaseDate))
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load asset data. Please try again.')
        setLoading(false)
      }
    }
    
    if (assetId && session?.user?.token) {
      loadData()
    }
  }, [assetId, session?.user?.token, setValue, verifyTokenAvailability])

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
      const assetData = {
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
      
      console.log('Updating asset data:', assetData)
      
      // Call API to update asset
      const response = await assetApi.updateAsset(assetId, assetData)
      
      console.log('Asset updated:', response)
      setSubmitSuccess(true)
      
      // Redirect to asset detail page after successful update
      setTimeout(() => {
        router.push(`/en/asset-management/detail/${assetId}`)
      }, 1500)
    } catch (err) {
      console.error('Error updating asset:', err)
      setError(err instanceof Error ? err.message : 'Failed to update asset. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle cancel button
  const handleCancel = () => {
    router.push(`/en/asset-management/detail/${assetId}`)
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
                title='Edit Asset' 
                subheader='Update asset information'
                action={
                  <Button 
                    variant='outlined' 
                    color='secondary'
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                }
              />
              <CardContent>
                {error && (
                  <Alert severity='error' sx={{ mb: 4 }}>
                    {error}
                  </Alert>
                )}
                <Grid container spacing={5}>
                  {/* Basic Information */}
                  <Grid item xs={12}>
                    <Typography variant='h6' sx={{ mb: 4 }}>Basic Information</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='assetCode'
                      control={control}
                      rules={{ required: 'Asset code is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Asset Code'
                          placeholder='Enter asset code'
                          error={Boolean(error)}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='name'
                      control={control}
                      rules={{ required: 'Asset name is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Asset Name'
                          placeholder='Enter asset name'
                          error={Boolean(error)}
                          helperText={error?.message}
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
                      rules={{ required: 'Category is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={Boolean(error)}>
                          <InputLabel id='category-select-label'>Category</InputLabel>
                          <Select
                            {...field}
                            labelId='category-select-label'
                            label='Category'
                            value={field.value || ''}
                          >
                            {categories.map(category => (
                              <MenuItem key={category.id} value={category.id}>
                                {category.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {error && <Typography color='error'>{error.message}</Typography>}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='locationId'
                      control={control}
                      rules={{ required: 'Location is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={Boolean(error)}>
                          <InputLabel id='location-select-label'>Location</InputLabel>
                          <Select
                            {...field}
                            labelId='location-select-label'
                            label='Location'
                            value={field.value || ''}
                          >
                            {locations.map(location => (
                              <MenuItem key={location.id} value={location.id}>
                                {location.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {error && <Typography color='error'>{error.message}</Typography>}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='departmentId'
                      control={control}
                      rules={{ required: 'Department is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={Boolean(error)}>
                          <InputLabel id='department-select-label'>Department</InputLabel>
                          <Select
                            {...field}
                            labelId='department-select-label'
                            label='Department'
                            value={field.value || ''}
                          >
                            {departments.map(department => (
                              <MenuItem key={department.id} value={department.id}>
                                {department.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {error && <Typography color='error'>{error.message}</Typography>}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='branchId'
                      control={control}
                      rules={{ required: 'Branch is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={Boolean(error)}>
                          <InputLabel id='branch-select-label'>Branch</InputLabel>
                          <Select
                            {...field}
                            labelId='branch-select-label'
                            label='Branch'
                            value={field.value || ''}
                          >
                            {branches.map(branch => (
                              <MenuItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {error && <Typography color='error'>{error.message}</Typography>}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Financial Information */}
                  <Grid item xs={12}>
                    <Typography variant='h6' sx={{ mb: 4, mt: 4 }}>Financial Information</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='purchaseDate'
                      control={control}
                      render={({ field }) => (
                        <AppReactDatepicker
                          {...field}
                          label='Purchase Date'
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='purchaseCost'
                      control={control}
                      rules={{ required: 'Purchase cost is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          label='Purchase Cost'
                          placeholder='Enter purchase cost'
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
                          }}
                          error={Boolean(error)}
                          helperText={error?.message || 'Enter cost in Indonesian Rupiah (IDR)'}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            
                            field.onChange(isNaN(value) ? 0 : value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  
                  {/* Status */}
                  <Grid item xs={12}>
                    <Typography variant='h6' sx={{ mb: 4, mt: 4 }}>Status</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='status'
                      control={control}
                      rules={{ required: 'Status is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={Boolean(error)}>
                          <InputLabel id='status-select-label'>Status</InputLabel>
                          <Select
                            {...field}
                            labelId='status-select-label'
                            label='Status'
                            value={field.value || ''}
                          >
                            {statusOptions.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {error && <Typography color='error'>{error.message}</Typography>}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type='submit'
                        variant='contained'
                        disabled={submitting}
                        sx={{ mr: 3 }}
                      >
                        {submitting ? 'Updating...' : 'Update Asset'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
      
      <Snackbar 
        open={submitSuccess} 
        autoHideDuration={6000} 
        onClose={() => setSubmitSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSubmitSuccess(false)} severity='success' sx={{ width: '100%' }}>
          Asset updated successfully!
        </Alert>
      </Snackbar>
    </>
  )
}

export default EditAsset
