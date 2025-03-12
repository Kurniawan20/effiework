'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

// Type Imports
import { AssetResponse, AssetStatus, User } from '@/types/assets'

// API Imports
import { assetApi, userApi, hasValidToken, setToken } from '@/utils/api'
import { formatRupiah } from '@/utils/formatters'

// Status Chip Colors
const statusColorMap: Record<AssetStatus, 'success' | 'info' | 'warning' | 'error'> = {
  AVAILABLE: 'success',
  ASSIGNED: 'info',
  MAINTENANCE: 'warning',
  RETIRED: 'error'
}

// Format currency - using the formatRupiah utility function
const formatCurrency = (amount: number) => {
  return formatRupiah(amount);
}

interface AssetDetailProps {
  params: {
    id: string
  }
}

const AssetDetail = ({ params }: AssetDetailProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const assetId = parseInt(params.id)
  
  // States
  const [asset, setAsset] = useState<AssetResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [unassignDialogOpen, setUnassignDialogOpen] = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Ensure token is available from session
  useEffect(() => {
    if (session?.user?.token) {
      // Synchronize token from session to localStorage
      setToken(session.user.token)
      console.log('Token synchronized from session in asset detail')
    }
  }, [session])

  // Load asset details
  const loadAssetDetails = async () => {
    try {
      // Verify token availability before making request
      if (!hasValidToken() && session?.user?.token) {
        console.log('Token not found in localStorage but available in session, synchronizing')
        setToken(session.user.token)
      }
      
      setLoading(true)
      setError(null)
      
      const response = await assetApi.getAssetById(assetId)
      setAsset(response)
      console.log('Asset details loaded:', response)
    } catch (error) {
      console.error('Error loading asset details:', error)
      setError('Failed to load asset details. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Initial load
  useEffect(() => {
    if (assetId) {
      loadAssetDetails()
    }
  }, [assetId])
  
  // Load users for assignment
  const loadUsers = async () => {
    try {
      const response = await userApi.getUsers({
        page: 0,
        size: 100,
        search: searchTerm
      })
      setUsers(response.content)
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users for assignment')
    }
  }

  // Handle back button
  const handleBack = () => {
    window.history.back()
  }

  // Handle edit button
  const handleEdit = () => {
    if (asset) {
      router.push(`/en/asset-management/edit/${asset.id}`)
    }
  }

  // Handle delete dialog open
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true)
  }

  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
  }

  // Handle asset deletion
  const handleDeleteAsset = async () => {
    if (!asset) return

    try {
      setDeleteLoading(true)
      await assetApi.deleteAsset(asset.id)
      
      // Redirect to asset list with success message in query params
      router.push('/en/asset-management/registration/list?deleted=true')
    } catch (error) {
      console.error('Error deleting asset:', error)
      setError('Failed to delete asset. Please try again.')
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  // Open assign dialog
  const handleAssignDialogOpen = () => {
    loadUsers()
    setAssignDialogOpen(true)
  }

  // Close assign dialog
  const handleAssignDialogClose = () => {
    setAssignDialogOpen(false)
    setSelectedUser(null)
  }

  // Open unassign dialog
  const handleUnassignDialogOpen = () => {
    setUnassignDialogOpen(true)
  }

  // Close unassign dialog
  const handleUnassignDialogClose = () => {
    setUnassignDialogOpen(false)
  }

  // Handle asset assignment
  const handleAssignAsset = async () => {
    if (!asset || !selectedUser) return

    try {
      setAssignLoading(true)
      const updatedAsset = await assetApi.assignAsset(asset.id, selectedUser.id)
      setAsset(updatedAsset)
      setSuccess(`Asset successfully assigned to ${selectedUser.fullName || selectedUser.username}`)
      handleAssignDialogClose()
    } catch (error) {
      console.error('Error assigning asset:', error)
      setError('Failed to assign asset. Please try again.')
    } finally {
      setAssignLoading(false)
    }
  }

  // Handle asset unassignment
  const handleUnassignAsset = async () => {
    if (!asset) return

    try {
      setAssignLoading(true)
      const updatedAsset = await assetApi.unassignAsset(asset.id)
      setAsset(updatedAsset)
      setSuccess('Asset successfully unassigned')
      handleUnassignDialogClose()
    } catch (error) {
      console.error('Error unassigning asset:', error)
      setError('Failed to unassign asset. Please try again.')
    } finally {
      setAssignLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!asset && !loading) {
    return (
      <Alert severity='error'>
        Asset not found or you don't have permission to view it.
      </Alert>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button 
            variant='outlined' 
            onClick={handleBack}
            sx={{ mr: 2 }}
            startIcon={<i className="ri-arrow-left-line" />}
          >
            Back to List
          </Button>
          <Typography variant='h5'>Asset Details</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            {asset?.status !== 'ASSIGNED' ? (
              <Button 
                variant='outlined' 
                color='primary'
                onClick={handleAssignDialogOpen}
                startIcon={<i className="ri-user-add-line" />}
              >
                Assign Asset
              </Button>
            ) : (
              <Button 
                variant='outlined' 
                color='warning'
                onClick={handleUnassignDialogOpen}
                startIcon={<i className="ri-user-unfollow-line" />}
              >
                Unassign Asset
              </Button>
            )}
            <Button 
              variant='outlined' 
              color='error'
              onClick={handleDeleteDialogOpen}
              startIcon={<i className="ri-delete-bin-line" />}
            >
              Delete Asset
            </Button>
          </Box>
        </Box>
        
        <Card>
          <CardHeader 
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant='h6'>
                  {asset?.name} ({asset?.assetCode})
                </Typography>
                <Chip 
                  label={asset?.status} 
                  color={asset ? statusColorMap[asset.status] : 'default'} 
                  size='small'
                />
              </Box>
            }
            action={
              <IconButton title='Edit Asset' onClick={handleEdit}>
                <i className="ri-edit-line" />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Asset Code
                    </Typography>
                    <Typography variant='body1'>{asset?.assetCode}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Name
                    </Typography>
                    <Typography variant='body1'>{asset?.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Status
                    </Typography>
                    <Box>
                      <Chip 
                        label={asset?.status} 
                        color={asset ? statusColorMap[asset.status] : 'default'} 
                        size='small'
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Description
                    </Typography>
                    <Typography variant='body1'>{asset?.description || 'No description provided'}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Divider />
              </Grid>
              
              {/* Classification Information */}
              <Grid item xs={12}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                  Classification Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Category
                    </Typography>
                    <Typography variant='body1'>{asset?.categoryName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Department
                    </Typography>
                    <Typography variant='body1'>{asset?.departmentName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Location
                    </Typography>
                    <Typography variant='body1'>{asset?.locationName}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Divider />
              </Grid>
              
              {/* Financial Information */}
              <Grid item xs={12}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                  Financial Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Purchase Date
                    </Typography>
                    <Typography variant='body1'>
                      {asset?.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Purchase Cost
                    </Typography>
                    <Typography variant='body1'>
                      {asset?.purchaseCost ? formatCurrency(asset.purchaseCost) : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Divider />
              </Grid>
              
              {/* Assignment Information */}
              <Grid item xs={12}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                  Assignment Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {asset?.currentAssignedUsername ? (
                      <>
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                          Currently Assigned To
                        </Typography>
                        <Typography variant='body1'>
                          {asset.currentAssignedUsername}
                          <Chip 
                            label="Assigned" 
                            color="info" 
                            size="small" 
                            sx={{ ml: 2 }}
                          />
                        </Typography>
                      </>
                    ) : (
                      <Typography variant='body1'>
                        Not currently assigned to any user
                        <Chip 
                          label="Available" 
                          color="success" 
                          size="small" 
                          sx={{ ml: 2 }}
                        />
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
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
      
      {/* Success Message */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity='success' 
          variant='filled'
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Confirm Asset Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete asset {asset?.assetCode} - {asset?.name}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color='primary'>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAsset} 
            color='error' 
            variant='contained'
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <i className='ri-delete-bin-line' />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={handleAssignDialogClose}
        aria-labelledby='assign-dialog-title'
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle id='assign-dialog-title'>
          Assign Asset to User
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              options={users}
              getOptionLabel={(option) => option.fullName || option.username}
              value={selectedUser}
              onChange={(_, newValue) => setSelectedUser(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select User"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    if (e.target.value.length > 2) {
                      loadUsers()
                    }
                  }}
                />
              )}
            />
            <Typography variant='caption' sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
              Search by name or username. Type at least 3 characters to search.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssignDialogClose} color='primary'>
            Cancel
          </Button>
          <Button 
            onClick={handleAssignAsset} 
            color='primary' 
            variant='contained'
            disabled={assignLoading || !selectedUser}
            startIcon={assignLoading ? <CircularProgress size={20} /> : <i className="ri-user-add-line" />}
          >
            {assignLoading ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unassign Dialog */}
      <Dialog
        open={unassignDialogOpen}
        onClose={handleUnassignDialogClose}
        aria-labelledby='unassign-dialog-title'
      >
        <DialogTitle id='unassign-dialog-title'>
          Unassign Asset
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='unassign-dialog-description'>
            Are you sure you want to unassign this asset from {asset?.currentAssignedUsername}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUnassignDialogClose} color='primary'>
            Cancel
          </Button>
          <Button 
            onClick={handleUnassignAsset} 
            color='warning' 
            variant='contained'
            disabled={assignLoading}
            startIcon={assignLoading ? <CircularProgress size={20} /> : <i className="ri-user-unfollow-line" />}
          >
            {assignLoading ? 'Unassigning...' : 'Unassign'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default AssetDetail
