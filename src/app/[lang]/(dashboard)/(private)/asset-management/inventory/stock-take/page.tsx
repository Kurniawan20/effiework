'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import type { SelectChangeEvent } from '@mui/material'

// Type Imports
import type { AssetResponse } from '@/types/assets'

// Dummy Data
const dummyStockTakeData = [
  {
    id: 1,
    assetCode: 'AST-001',
    name: 'Dell Laptop XPS 15',
    categoryName: 'Computers',
    locationName: 'Main Office',
    departmentName: 'IT Department',
    branchName: 'Headquarters',
    status: 'AVAILABLE',
    lastCheckedDate: '2025-02-15',
    physicallyVerified: true,
    notes: 'Asset in good condition'
  },
  {
    id: 2,
    assetCode: 'AST-002',
    name: 'HP Printer LaserJet Pro',
    categoryName: 'Printers',
    locationName: 'Main Office',
    departmentName: 'Admin',
    branchName: 'Headquarters',
    status: 'AVAILABLE',
    lastCheckedDate: '2025-02-15',
    physicallyVerified: true,
    notes: 'Toner needs replacement soon'
  },
  {
    id: 3,
    assetCode: 'AST-003',
    name: 'Cisco Router',
    categoryName: 'Networking',
    locationName: 'Server Room',
    departmentName: 'IT Department',
    branchName: 'Headquarters',
    status: 'AVAILABLE',
    lastCheckedDate: '2025-02-15',
    physicallyVerified: false,
    notes: 'Could not locate during inventory check'
  },
  {
    id: 4,
    assetCode: 'AST-004',
    name: 'Conference Room Table',
    categoryName: 'Furniture',
    locationName: 'Conference Room',
    departmentName: 'Admin',
    branchName: 'Headquarters',
    status: 'AVAILABLE',
    lastCheckedDate: '2025-02-14',
    physicallyVerified: true,
    notes: 'Small scratch on surface'
  },
  {
    id: 5,
    assetCode: 'AST-005',
    name: 'MacBook Pro',
    categoryName: 'Computers',
    locationName: 'Main Office',
    departmentName: 'Design',
    branchName: 'Headquarters',
    status: 'ASSIGNED',
    lastCheckedDate: '2025-02-14',
    physicallyVerified: true,
    notes: 'Assigned to John Doe'
  }
]

const StockTakePage = () => {
  // State
  const [stockTakeData, setStockTakeData] = useState<typeof dummyStockTakeData>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [verificationStatus, setVerificationStatus] = useState<string>('')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [selectedAsset, setSelectedAsset] = useState<(typeof dummyStockTakeData)[0] | null>(null)
  const [verificationNotes, setVerificationNotes] = useState<string>('')

  // Load data on component mount
  useEffect(() => {
    loadStockTakeData()
  }, [page, rowsPerPage, searchTerm, selectedLocation, selectedDepartment, selectedStatus, verificationStatus])

  // Load stock take data (simulated)
  const loadStockTakeData = () => {
    setLoading(true)
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Filter data based on search term and filters
      let filteredData = [...dummyStockTakeData]
      
      if (searchTerm) {
        filteredData = filteredData.filter(
          item => 
            item.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (selectedLocation) {
        filteredData = filteredData.filter(item => item.locationName === selectedLocation)
      }
      
      if (selectedDepartment) {
        filteredData = filteredData.filter(item => item.departmentName === selectedDepartment)
      }
      
      if (selectedStatus) {
        filteredData = filteredData.filter(item => item.status === selectedStatus)
      }
      
      if (verificationStatus) {
        if (verificationStatus === 'VERIFIED') {
          filteredData = filteredData.filter(item => item.physicallyVerified)
        } else if (verificationStatus === 'UNVERIFIED') {
          filteredData = filteredData.filter(item => !item.physicallyVerified)
        }
      }
      
      setStockTakeData(filteredData)
      setTotalElements(filteredData.length)
      setLoading(false)
    }, 1000)
  }

  // Handle page change
  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  // Handle location filter change
  const handleLocationChange = (event: SelectChangeEvent) => {
    setSelectedLocation(event.target.value)
    setPage(0)
  }

  // Handle department filter change
  const handleDepartmentChange = (event: SelectChangeEvent) => {
    setSelectedDepartment(event.target.value)
    setPage(0)
  }

  // Handle status filter change
  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value)
    setPage(0)
  }

  // Handle verification status filter change
  const handleVerificationStatusChange = (event: SelectChangeEvent) => {
    setVerificationStatus(event.target.value)
    setPage(0)
  }

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedLocation('')
    setSelectedDepartment('')
    setSelectedStatus('')
    setVerificationStatus('')
    setPage(0)
  }

  // Handle verify asset dialog open
  const handleVerifyDialogOpen = (asset: (typeof dummyStockTakeData)[0]) => {
    setSelectedAsset(asset)
    setVerificationNotes('')
    setDialogOpen(true)
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedAsset(null)
    setVerificationNotes('')
  }

  // Handle asset verification
  const handleVerifyAsset = () => {
    if (!selectedAsset) return
    
    // Update the asset in the dummy data
    const updatedData = stockTakeData.map(item => {
      if (item.id === selectedAsset.id) {
        return {
          ...item,
          physicallyVerified: true,
          lastCheckedDate: new Date().toISOString().split('T')[0],
          notes: verificationNotes || item.notes
        }
      }
      return item
    })
    
    setStockTakeData(updatedData)
    setSuccess(`Asset ${selectedAsset.assetCode} has been verified successfully`)
    handleDialogClose()
  }

  // Handle error close
  const handleErrorClose = () => {
    setError(null)
  }

  // Handle success close
  const handleSuccessClose = () => {
    setSuccess(null)
  }

  // Start new stock take
  const handleStartNewStockTake = () => {
    // Reset verification status for all assets
    const resetData = dummyStockTakeData.map(item => ({
      ...item,
      physicallyVerified: false,
      notes: ''
    }))
    
    setStockTakeData(resetData)
    setSuccess('New stock take has been initiated')
  }

  // Complete stock take
  const handleCompleteStockTake = () => {
    const unverifiedCount = stockTakeData.filter(item => !item.physicallyVerified).length
    
    if (unverifiedCount > 0) {
      setError(`Cannot complete stock take. ${unverifiedCount} assets are still unverified.`)
    } else {
      setSuccess('Stock take completed successfully')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Asset Stock Taking' 
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant='contained' 
                  color='primary'
                  onClick={handleStartNewStockTake}
                  startIcon={<i className='ri-restart-line'></i>}
                >
                  Start New Stock Take
                </Button>
                <Button 
                  variant='contained' 
                  color='success'
                  onClick={handleCompleteStockTake}
                  startIcon={<i className='ri-check-double-line'></i>}
                >
                  Complete Stock Take
                </Button>
              </Box>
            }
          />
          <CardContent>
            {/* Filters */}
            <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField
                label='Search Assets'
                value={searchTerm}
                onChange={handleSearchChange}
                size='small'
                sx={{ minWidth: '250px' }}
                InputProps={{
                  startAdornment: <i className='ri-search-line' style={{ marginRight: '8px' }}></i>
                }}
              />
              
              <FormControl sx={{ minWidth: '150px' }} size='small'>
                <InputLabel id='location-filter-label'>Location</InputLabel>
                <Select
                  labelId='location-filter-label'
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  label='Location'
                >
                  <MenuItem value=''>All Locations</MenuItem>
                  <MenuItem value='Main Office'>Main Office</MenuItem>
                  <MenuItem value='Server Room'>Server Room</MenuItem>
                  <MenuItem value='Conference Room'>Conference Room</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: '150px' }} size='small'>
                <InputLabel id='department-filter-label'>Department</InputLabel>
                <Select
                  labelId='department-filter-label'
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  label='Department'
                >
                  <MenuItem value=''>All Departments</MenuItem>
                  <MenuItem value='IT Department'>IT Department</MenuItem>
                  <MenuItem value='Admin'>Admin</MenuItem>
                  <MenuItem value='Design'>Design</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: '150px' }} size='small'>
                <InputLabel id='status-filter-label'>Status</InputLabel>
                <Select
                  labelId='status-filter-label'
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  label='Status'
                >
                  <MenuItem value=''>All Statuses</MenuItem>
                  <MenuItem value='AVAILABLE'>Available</MenuItem>
                  <MenuItem value='ASSIGNED'>Assigned</MenuItem>
                  <MenuItem value='MAINTENANCE'>Maintenance</MenuItem>
                  <MenuItem value='RETIRED'>Retired</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: '150px' }} size='small'>
                <InputLabel id='verification-filter-label'>Verification</InputLabel>
                <Select
                  labelId='verification-filter-label'
                  value={verificationStatus}
                  onChange={handleVerificationStatusChange}
                  label='Verification'
                >
                  <MenuItem value=''>All</MenuItem>
                  <MenuItem value='VERIFIED'>Verified</MenuItem>
                  <MenuItem value='UNVERIFIED'>Unverified</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant='outlined' 
                color='secondary'
                onClick={handleResetFilters}
                size='small'
                startIcon={<i className='ri-refresh-line'></i>}
              >
                Reset Filters
              </Button>
            </Box>
            
            {/* Stock Take Table */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                  <Table stickyHeader aria-label='stock take table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Asset Code</TableCell>
                        <TableCell>Asset Name</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Last Checked</TableCell>
                        <TableCell>Verification</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stockTakeData.length > 0 ? (
                        stockTakeData.map((asset) => (
                          <TableRow hover key={asset.id}>
                            <TableCell>{asset.assetCode}</TableCell>
                            <TableCell>
                              <Typography variant='body2'>{asset.name}</Typography>
                              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                {asset.categoryName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant='body2'>{asset.locationName}</Typography>
                              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                {asset.branchName}
                              </Typography>
                            </TableCell>
                            <TableCell>{asset.departmentName}</TableCell>
                            <TableCell>
                              <Chip 
                                label={asset.status} 
                                color={
                                  asset.status === 'AVAILABLE' ? 'success' : 
                                  asset.status === 'ASSIGNED' ? 'info' : 
                                  asset.status === 'MAINTENANCE' ? 'warning' : 'error'
                                } 
                                size='small' 
                              />
                            </TableCell>
                            <TableCell>{asset.lastCheckedDate}</TableCell>
                            <TableCell>
                              <Chip 
                                label={asset.physicallyVerified ? 'Verified' : 'Unverified'} 
                                color={asset.physicallyVerified ? 'success' : 'warning'} 
                                size='small' 
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                {!asset.physicallyVerified && (
                                  <IconButton 
                                    color='primary' 
                                    size='small'
                                    onClick={() => handleVerifyDialogOpen(asset)}
                                    title='Verify Asset'
                                  >
                                    <i className='ri-checkbox-circle-line'></i>
                                  </IconButton>
                                )}
                                <IconButton 
                                  color='info' 
                                  size='small'
                                  title='View Details'
                                >
                                  <i className='ri-eye-line'></i>
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} align='center'>
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
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </Paper>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      {/* Verify Asset Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Verify Asset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please confirm that you have physically verified this asset:
            {selectedAsset && (
              <Box sx={{ mt: 2 }}>
                <Typography variant='subtitle1'>{selectedAsset.name}</Typography>
                <Typography variant='body2'>Asset Code: {selectedAsset.assetCode}</Typography>
                <Typography variant='body2'>Location: {selectedAsset.locationName}</Typography>
                <Typography variant='body2'>Department: {selectedAsset.departmentName}</Typography>
              </Box>
            )}
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='verification-notes'
            label='Verification Notes'
            type='text'
            fullWidth
            multiline
            rows={3}
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleVerifyAsset} color='primary' variant='contained'>
            Verify Asset
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity='success' sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity='error' sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default StockTakePage
