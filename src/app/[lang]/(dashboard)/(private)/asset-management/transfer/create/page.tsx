'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Autocomplete from '@mui/material/Autocomplete'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Type Imports
import type { 
  AssetResponse, 
  AssetTransferRequest, 
  Department, 
  Location, 
  Branch 
} from '@/types/assets'

// API Imports
import { 
  assetApi, 
  assetTransferApi, 
  locationApi, 
  departmentApi, 
  branchApi, 
  setToken 
} from '@/utils/api'

// Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Form validation schema
const schema = yup.object().shape({
  assetId: yup.number().required('Asset is required'),
  destinationBranchId: yup.number().required('Destination Branch is required'),
  destinationLocationId: yup.number().required('Destination Location is required'),
  destinationDepartmentId: yup.number().required('Destination Department is required'),
  reason: yup.string().required('Reason is required'),
  notes: yup.string(),
  transferDate: yup.date().nullable()
})

// Default form values
const defaultValues: AssetTransferRequest = {
  assetId: 0,
  destinationBranchId: 0,
  destinationLocationId: 0,
  destinationDepartmentId: 0,
  reason: '',
  notes: '',
  transferDate: new Date().toISOString()
}

const AssetTransferCreate = () => {
  // Hooks
  const router = useRouter()
  const { data: session } = useSession()
  
  // Form state
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  })
  
  // Component state
  const [loading, setLoading] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Data state
  const [assets, setAssets] = useState<AssetResponse[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  
  // Selected asset state
  const [selectedAsset, setSelectedAsset] = useState<AssetResponse | null>(null)
  
  // Load data on component mount
  useEffect(() => {
    if (session?.user?.email) {
      loadData()
    }
  }, [session])
  
  // Load all required data
  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load assets
      const assetsResponse = await assetApi.getAssets({ 
        page: 0, 
        size: 100,
        status: 'AVAILABLE' 
      })
      setAssets(assetsResponse.content)
      
      // Load branches
      const branchesResponse = await branchApi.getBranches({
        isActive: true,
        page: 0,
        size: 100
      })
      setBranches(branchesResponse.content)
      
      // Load locations
      const locationsResponse = await locationApi.getLocations()
      setLocations(locationsResponse)
      
      // Load departments
      const departmentsResponse = await departmentApi.getDepartments()
      setDepartments(departmentsResponse)
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle asset selection
  const handleAssetChange = (asset: AssetResponse | null) => {
    setSelectedAsset(asset)
    if (asset) {
      setValue('assetId', asset.id)
    } else {
      setValue('assetId', 0)
    }
  }
  
  // Handle form submission
  const onSubmit = async (data: AssetTransferRequest) => {
    try {
      setSubmitLoading(true)
      
      // Format transfer date if provided
      if (data.transferDate && typeof data.transferDate === 'object') {
        data.transferDate = (data.transferDate as Date).toISOString()
      }
      
      // Create asset transfer
      await assetTransferApi.createTransfer(data)
      
      // Show success message
      setSuccess('Asset transfer request created successfully')
      
      // Redirect to transfer list after a short delay
      setTimeout(() => {
        router.push('/en/asset-management/transfer/list')
      }, 1500)
    } catch (error) {
      console.error('Error creating asset transfer:', error)
      setError('Failed to create asset transfer. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }
  
  // Handle error close
  const handleErrorClose = () => {
    setError(null)
  }
  
  // Handle success close
  const handleSuccessClose = () => {
    setSuccess(null)
  }
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Create Asset Transfer Request' 
            subheader='Request to transfer an asset to a different branch, location, or department'
          />
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={5}>
                  {/* Asset Selection */}
                  <Grid item xs={12}>
                    <Typography variant='h6' sx={{ mb: 2 }}>Asset Information</Typography>
                    <Controller
                      name='assetId'
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <Autocomplete
                          options={assets}
                          getOptionLabel={(option) => `${option.assetCode} - ${option.name}`}
                          onChange={(_, value) => handleAssetChange(value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Select Asset'
                              error={Boolean(errors.assetId)}
                              helperText={errors.assetId?.message}
                              fullWidth
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  
                  {/* Asset Details (if selected) */}
                  {selectedAsset && (
                    <Grid item xs={12}>
                      <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>Asset Code:</Typography>
                            <Typography variant='body2'>{selectedAsset.assetCode}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>Name:</Typography>
                            <Typography variant='body2'>{selectedAsset.name}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>Current Branch:</Typography>
                            <Typography variant='body2'>{selectedAsset.branchName || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>Current Location:</Typography>
                            <Typography variant='body2'>{selectedAsset.locationName || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>Current Department:</Typography>
                            <Typography variant='body2'>{selectedAsset.departmentName || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>Status:</Typography>
                            <Typography variant='body2'>{selectedAsset.status}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  
                  {/* Destination Information */}
                  <Grid item xs={12}>
                    <Typography variant='h6' sx={{ mb: 2 }}>Destination Information</Typography>
                  </Grid>
                  
                  {/* Branch */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name='destinationBranchId'
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={Boolean(errors.destinationBranchId)}>
                          <InputLabel id='destination-branch-label'>Destination Branch</InputLabel>
                          <Select
                            {...field}
                            labelId='destination-branch-label'
                            label='Destination Branch'
                            value={field.value || ''}
                          >
                            {branches.map((branch) => (
                              <MenuItem key={branch.id} value={branch.id}>
                                {branch.name} ({branch.code})
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.destinationBranchId && (
                            <FormHelperText>{errors.destinationBranchId.message}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  {/* Location */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name='destinationLocationId'
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={Boolean(errors.destinationLocationId)}>
                          <InputLabel id='destination-location-label'>Destination Location</InputLabel>
                          <Select
                            {...field}
                            labelId='destination-location-label'
                            label='Destination Location'
                            value={field.value || ''}
                          >
                            {locations.map((location) => (
                              <MenuItem key={location.id} value={location.id}>
                                {location.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.destinationLocationId && (
                            <FormHelperText>{errors.destinationLocationId.message}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  {/* Department */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name='destinationDepartmentId'
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={Boolean(errors.destinationDepartmentId)}>
                          <InputLabel id='destination-department-label'>Destination Department</InputLabel>
                          <Select
                            {...field}
                            labelId='destination-department-label'
                            label='Destination Department'
                            value={field.value || ''}
                          >
                            {departments.map((department) => (
                              <MenuItem key={department.id} value={department.id}>
                                {department.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.destinationDepartmentId && (
                            <FormHelperText>{errors.destinationDepartmentId.message}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  
                  {/* Transfer Details */}
                  <Grid item xs={12}>
                    <Typography variant='h6' sx={{ mb: 2 }}>Transfer Details</Typography>
                  </Grid>
                  
                  {/* Reason */}
                  <Grid item xs={12}>
                    <Controller
                      name='reason'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Reason for Transfer'
                          placeholder='Why is this asset being transferred?'
                          fullWidth
                          multiline
                          rows={2}
                          error={Boolean(errors.reason)}
                          helperText={errors.reason?.message}
                        />
                      )}
                    />
                  </Grid>
                  
                  {/* Notes */}
                  <Grid item xs={12}>
                    <Controller
                      name='notes'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Additional Notes'
                          placeholder='Any additional information about this transfer'
                          fullWidth
                          multiline
                          rows={3}
                          error={Boolean(errors.notes)}
                          helperText={errors.notes?.message}
                        />
                      )}
                    />
                  </Grid>
                  
                  {/* Transfer Date */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name='transferDate'
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <AppReactDatepicker
                          {...field}
                          selected={field.value ? new Date(field.value) : null}
                          onChange={date => field.onChange(date)}
                          customInput={
                            <TextField
                              fullWidth
                              label='Planned Transfer Date'
                              error={Boolean(error)}
                              helperText={error?.message}
                            />
                          }
                        />
                      )}
                    />
                  </Grid>
                  
                  {/* Form Actions */}
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant='outlined'
                      color='secondary'
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      variant='contained'
                      disabled={submitLoading}
                      startIcon={submitLoading ? <CircularProgress size={20} /> : null}
                    >
                      Submit Transfer Request
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      {/* Error Snackbar */}
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity='error' sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* Success Snackbar */}
      <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity='success' sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default AssetTransferCreate
