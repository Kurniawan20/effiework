'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'

// Type Imports
import { AssetResponse, PaginatedResponse, AssetStatus, User, AssetCategory } from '@/types/assets'

// API Imports
import { assetApi, userApi, categoryApi, hasValidToken, setToken } from '@/utils/api'
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

const AssetList = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // States
  const [assets, setAssets] = useState<AssetResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<AssetResponse | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [unassignDialogOpen, setUnassignDialogOpen] = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [categories, setCategories] = useState<AssetCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null)
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  
  // Ensure token is available from session
  useEffect(() => {
    if (session?.user?.token) {
      // Synchronize token from session to localStorage
      setToken(session.user.token)
      console.log('Token synchronized from session in asset list')
    }
  }, [session])

  // Check for deleted query parameter
  useEffect(() => {
    const deleted = searchParams.get('deleted')
    if (deleted === 'true') {
      setSuccess('Asset deleted successfully')
    }
  }, [searchParams])

  // Load assets
  const loadAssets = async (pageNumber = page, pageSize = rowsPerPage, search = searchTerm, categoryId?: number) => {
    try {
      // Verify token availability before making request
      if (!hasValidToken() && session?.user?.token) {
        console.log('Token not found in localStorage but available in session, synchronizing')
        setToken(session.user.token)
      }
      
      setLoading(true)
      setError(null)
      
      const response = await assetApi.getAssets({
        page: pageNumber,
        size: pageSize,
        search: search || undefined,
        categoryId: categoryId
      })
      
      setAssets(response.content)
      setTotalElements(response.totalElements)
      console.log('Assets loaded:', response.content.length)
    } catch (error) {
      console.error('Error loading assets:', error)
      setError('Failed to load assets. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Load categories
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true)
      const categoriesData = await categoryApi.getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
      setError('Failed to load categories. Please try again.')
    } finally {
      setCategoriesLoading(false)
    }
  }
  
  // Initial load
  useEffect(() => {
    loadAssets()
    loadCategories()
  }, [])
  
  // Effect to reload assets when category changes
  useEffect(() => {
    loadAssets(0, rowsPerPage, searchTerm, selectedCategory?.id)
    setPage(0)
  }, [selectedCategory])
  
  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    loadAssets(newPage, rowsPerPage, searchTerm, selectedCategory?.id)
  }
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    setPage(0)
    loadAssets(0, newRowsPerPage, searchTerm, selectedCategory?.id)
  }
  
  // Handle search
  const handleSearch = () => {
    setPage(0)
    loadAssets(0, rowsPerPage, searchTerm, selectedCategory?.id)
  }
  
  // Handle search input keypress
  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  // Handle category change
  const handleCategoryChange = (category: AssetCategory | null) => {
    setSelectedCategory(category)
    setPage(0)
    loadAssets(0, rowsPerPage, searchTerm, category?.id)
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory(null)
    setPage(0)
    loadAssets(0, rowsPerPage, '')
  }

  // Load users for assignment
  const loadUsers = async () => {
    try {
      const response = await userApi.getUsers({
        page: 0,
        size: 100,
        search: userSearchTerm
      })
      setUsers(response.content)
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users for assignment')
    }
  }

  // Open assign dialog
  const handleAssignDialogOpen = (asset: AssetResponse) => {
    setSelectedAsset(asset)
    loadUsers()
    setAssignDialogOpen(true)
  }

  // Close assign dialog
  const handleAssignDialogClose = () => {
    setAssignDialogOpen(false)
    setSelectedUser(null)
  }

  // Open unassign dialog
  const handleUnassignDialogOpen = (asset: AssetResponse) => {
    setSelectedAsset(asset)
    setUnassignDialogOpen(true)
  }

  // Close unassign dialog
  const handleUnassignDialogClose = () => {
    setUnassignDialogOpen(false)
  }

  // Handle asset assignment
  const handleAssignAsset = async () => {
    if (!selectedAsset || !selectedUser) return

    try {
      setAssignLoading(true)
      await assetApi.assignAsset(selectedAsset.id, selectedUser.id)
      setSuccess(`Asset successfully assigned to ${selectedUser.fullName || selectedUser.username}`)
      handleAssignDialogClose()
      loadAssets(page, rowsPerPage, searchTerm, selectedCategory?.id)
    } catch (error) {
      console.error('Error assigning asset:', error)
      setError('Failed to assign asset. Please try again.')
    } finally {
      setAssignLoading(false)
    }
  }

  // Handle asset unassignment
  const handleUnassignAsset = async () => {
    if (!selectedAsset) return

    try {
      setAssignLoading(true)
      await assetApi.unassignAsset(selectedAsset.id)
      setSuccess('Asset successfully unassigned')
      handleUnassignDialogClose()
      loadAssets(page, rowsPerPage, searchTerm, selectedCategory?.id)
    } catch (error) {
      console.error('Error unassigning asset:', error)
      setError('Failed to unassign asset. Please try again.')
    } finally {
      setAssignLoading(false)
    }
  }

  // Handle delete dialog open
  const handleDeleteDialogOpen = (asset: AssetResponse) => {
    setSelectedAsset(asset)
    setDeleteDialogOpen(true)
  }

  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setSelectedAsset(null)
  }

  // Handle asset deletion
  const handleDeleteAsset = async () => {
    if (!selectedAsset) return

    try {
      setDeleteLoading(true)
      await assetApi.deleteAsset(selectedAsset.id)
      
      // Remove the deleted asset from the list
      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== selectedAsset.id))
      
      // Show success message
      setSuccess(`Asset ${selectedAsset.assetCode} deleted successfully`)
      
      // Close dialog
      handleDeleteDialogClose()
      
      // Reload assets if the list is now empty
      if (assets.length === 1) {
        const newPage = page > 0 ? page - 1 : 0
        setPage(newPage)
        loadAssets(newPage, rowsPerPage, searchTerm, selectedCategory?.id)
      }
    } catch (error) {
      console.error('Error deleting asset:', error)
      setError('Failed to delete asset. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Asset List' 
            subheader='Manage and view all assets'
            action={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Autocomplete
                  size='small'
                  options={categories}
                  getOptionLabel={(option) => option.name}
                  value={selectedCategory}
                  onChange={(_, newValue) => handleCategoryChange(newValue)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Filter by Category" 
                      size="small" 
                      sx={{ minWidth: 200 }}
                    />
                  )}
                  loading={categoriesLoading}
                  loadingText="Loading categories..."
                />
                <TextField
                  size='small'
                  placeholder='Search assets...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-search-2-line' />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position='end'>
                        <IconButton size='small' onClick={() => {
                          setSearchTerm('')
                          loadAssets(page, rowsPerPage, '', selectedCategory?.id)
                        }}>
                          <i className='ri-close-circle-line' />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                {(selectedCategory || searchTerm) && (
                  <Button 
                    size='small' 
                    variant='outlined' 
                    color='secondary'
                    onClick={handleClearFilters}
                    startIcon={<i className='ri-filter-off-line'></i>}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            }
          />
          <CardContent>
            {loading && assets.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                  <Table stickyHeader aria-label='asset table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Asset Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Branch Code</TableCell>
                        <TableCell>Purchase Date</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Assigned To</TableCell>
                        <TableCell align='right'>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assets.length > 0 ? (
                        assets.map((asset) => (
                          <TableRow hover key={asset.id}>
                            <TableCell>{asset.assetCode}</TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                  {asset.name}
                                </Typography>
                                <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                  {asset.description?.length > 50 
                                    ? `${asset.description.substring(0, 50)}...` 
                                    : asset.description}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{asset.categoryName}</TableCell>
                            <TableCell>{asset.departmentName}</TableCell>
                            <TableCell>{asset.locationName}</TableCell>
                            <TableCell>{asset.branchCode || '-'}</TableCell>
                            <TableCell>{new Date(asset.purchaseDate).toLocaleDateString()}</TableCell>
                            <TableCell>{formatCurrency(asset.purchaseCost)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={asset.status} 
                                color={statusColorMap[asset.status]} 
                                size='small' 
                              />
                            </TableCell>
                            <TableCell>
                              {asset.currentAssignedUsername || 'Not Assigned'}
                            </TableCell>
                            <TableCell align='right'>
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <IconButton 
                                  color='primary' 
                                  size='small'
                                  onClick={() => router.push(`/en/asset-management/detail/${asset.id}`)}
                                >
                                  <i className='ri-eye-line'></i>
                                </IconButton>
                                
                                {asset.status !== 'ASSIGNED' ? (
                                  <IconButton 
                                    color='info' 
                                    size='small'
                                    onClick={() => handleAssignDialogOpen(asset)}
                                  >
                                    <i className='ri-user-add-line'></i>
                                  </IconButton>
                                ) : (
                                  <IconButton 
                                    color='warning' 
                                    size='small'
                                    onClick={() => handleUnassignDialogOpen(asset)}
                                  >
                                    <i className='ri-user-unfollow-line'></i>
                                  </IconButton>
                                )}
                                
                                <IconButton 
                                  color='error' 
                                  size='small'
                                  onClick={() => handleDeleteDialogOpen(asset)}
                                >
                                  <i className='ri-delete-bin-line'></i>
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} align='center'>
                            <Typography variant='body1'>No assets found</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component='div'
                  count={totalElements}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            )}
          </CardContent>
        </Card>
      </Grid>
      
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
            Are you sure you want to delete asset {selectedAsset?.assetCode} - {selectedAsset?.name}? 
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
            <Typography variant='subtitle1' gutterBottom>
              Asset: {selectedAsset?.name} ({selectedAsset?.assetCode})
            </Typography>
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
                    setUserSearchTerm(e.target.value)
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
            Are you sure you want to unassign this asset from {selectedAsset?.currentAssignedUsername}?
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

export default AssetList
