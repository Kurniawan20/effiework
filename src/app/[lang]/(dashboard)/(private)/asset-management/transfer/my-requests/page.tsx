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
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import type { SelectChangeEvent } from '@mui/material'

// Type Imports
import type { AssetTransferResponse, AssetTransferStatus } from '@/types/assets'

// API Imports
import { assetTransferApi } from '@/utils/api'

// Status Chip Colors
const statusColorMap: Record<AssetTransferStatus, 'success' | 'info' | 'warning' | 'error'> = {
  REQUESTED: 'info',
  APPROVED: 'success',
  REJECTED: 'error',
  COMPLETED: 'success',
  CANCELLED: 'warning'
}

const MyTransferRequests = () => {
  // Router and session
  const router = useRouter()
  const { data: session } = useSession()

  // State
  const [transfers, setTransfers] = useState<AssetTransferResponse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Pagination state
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [totalElements, setTotalElements] = useState<number>(0)
  
  // Filter state
  const [selectedStatus, setSelectedStatus] = useState<AssetTransferStatus | ''>('')
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string>('createdAt,desc')
  
  // Selected transfer for actions
  const [selectedTransfer, setSelectedTransfer] = useState<AssetTransferResponse | null>(null)
  
  // State for dialogs
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false)
  const [cancellationNotes, setCancellationNotes] = useState<string>('')
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  
  // Load transfers on component mount and when filters change
  useEffect(() => {
    if (session?.user?.email) {
      loadMyTransfers(
        page, 
        rowsPerPage, 
        selectedStatus, 
        startDate,
        endDate,
        sortField
      )
    }
  }, [session, page, rowsPerPage, selectedStatus, startDate, endDate, sortField])
  
  // Load user's transfer requests from API
  const loadMyTransfers = async (
    page: number,
    rowsPerPage: number,
    status: AssetTransferStatus | '',
    startDate: string | null,
    endDate: string | null,
    sortField: string
  ) => {
    try {
      setLoading(true)
      
      const params: any = {
        page,
        size: rowsPerPage,
        sort: sortField
      }
      
      if (status) {
        params.status = status
      }
      
      if (startDate) {
        params.startDate = startDate
      }
      
      if (endDate) {
        params.endDate = endDate
      }
      
      const response = await assetTransferApi.getMyTransferRequests(params)
      
      setTransfers(response.content)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error('Error loading transfers:', error)
      setError('Failed to load transfer requests')
    } finally {
      setLoading(false)
    }
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
  
  // Handle status change
  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value as AssetTransferStatus | '')
    setPage(0)
  }
  
  // Handle start date change
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value)
    setPage(0)
  }
  
  // Handle end date change
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value)
    setPage(0)
  }
  
  // Handle sort field change
  const handleSortFieldChange = (event: SelectChangeEvent) => {
    setSortField(event.target.value)
    setPage(0)
  }
  
  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedStatus('')
    setStartDate(null)
    setEndDate(null)
    setSortField('createdAt,desc')
    setPage(0)
    loadMyTransfers(0, rowsPerPage, '', null, null, 'createdAt,desc')
  }
  
  // Handle cancel dialog open
  const handleCancelDialogOpen = (transfer: AssetTransferResponse) => {
    setSelectedTransfer(transfer)
    setCancellationNotes('')
    setCancelDialogOpen(true)
  }
  
  // Handle cancel dialog close
  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false)
    setSelectedTransfer(null)
    setCancellationNotes('')
  }
  
  // Handle cancel transfer
  const handleCancelTransfer = async () => {
    if (!selectedTransfer) return
    
    try {
      setActionLoading(true)
      
      await assetTransferApi.cancelTransfer(selectedTransfer.id, cancellationNotes)
      setSuccess(`Transfer request for ${selectedTransfer.assetCode} cancelled`)
      handleCancelDialogClose()
      loadMyTransfers(page, rowsPerPage, selectedStatus, startDate, endDate, sortField)
    } catch (error) {
      console.error('Error cancelling transfer:', error)
      setError('Failed to cancel transfer request')
    } finally {
      setActionLoading(false)
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
  
  // Handle view details
  const handleViewDetails = (id: number) => {
    router.push(`/en/asset-management/transfer/details/${id}`)
  }
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='My Transfer Requests' 
            action={
              <Button 
                variant='contained' 
                color='primary'
                onClick={() => router.push('/asset-management/transfer/create')}
                startIcon={<i className='ri-add-line'></i>}
              >
                Create New Transfer
              </Button>
            }
          />
          <CardContent>
            {/* Filters */}
            <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: '150px' }}>
                <InputLabel id='status-filter-label'>Status</InputLabel>
                <Select
                  labelId='status-filter-label'
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  label='Status'
                >
                  <MenuItem value=''>All Statuses</MenuItem>
                  <MenuItem value='REQUESTED'>Requested</MenuItem>
                  <MenuItem value='APPROVED'>Approved</MenuItem>
                  <MenuItem value='REJECTED'>Rejected</MenuItem>
                  <MenuItem value='COMPLETED'>Completed</MenuItem>
                  <MenuItem value='CANCELLED'>Cancelled</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label='Start Date'
                type='date'
                value={startDate || ''}
                onChange={handleStartDateChange}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: '150px' }}
              />
              
              <TextField
                label='End Date'
                type='date'
                value={endDate || ''}
                onChange={handleEndDateChange}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: '150px' }}
              />
              
              <FormControl sx={{ minWidth: '200px' }}>
                <InputLabel id='sort-filter-label'>Sort By</InputLabel>
                <Select
                  labelId='sort-filter-label'
                  value={sortField}
                  onChange={handleSortFieldChange}
                  label='Sort By'
                >
                  <MenuItem value='createdAt,desc'>Created Date (Newest)</MenuItem>
                  <MenuItem value='createdAt,asc'>Created Date (Oldest)</MenuItem>
                  <MenuItem value='transferDate,desc'>Transfer Date (Newest)</MenuItem>
                  <MenuItem value='transferDate,asc'>Transfer Date (Oldest)</MenuItem>
                  <MenuItem value='status,asc'>Status (A-Z)</MenuItem>
                  <MenuItem value='status,desc'>Status (Z-A)</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant='outlined' 
                color='secondary'
                onClick={handleResetFilters}
                startIcon={<i className='ri-refresh-line'></i>}
              >
                Reset Filters
              </Button>
            </Box>
            
            {/* Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label='my transfer requests table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset Code</TableCell>
                      <TableCell>Asset Name</TableCell>
                      <TableCell>From Branch</TableCell>
                      <TableCell>To Branch</TableCell>
                      <TableCell>Transfer Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align='center'>
                          <CircularProgress size={30} />
                          <Typography variant='body2' sx={{ mt: 2 }}>
                            Loading transfer requests...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : transfers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align='center'>
                          <Typography variant='body2'>
                            No transfer requests found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      transfers.map((transfer) => (
                        <TableRow key={transfer.id} hover>
                          <TableCell>{transfer.assetCode}</TableCell>
                          <TableCell>{transfer.assetName}</TableCell>
                          <TableCell>{transfer.sourceBranchName}</TableCell>
                          <TableCell>{transfer.destinationBranchName}</TableCell>
                          <TableCell>
                            {transfer.transferDate ? new Date(transfer.transferDate).toLocaleDateString() : 'Not set'}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={transfer.status} 
                              color={statusColorMap[transfer.status]} 
                              size='small' 
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton 
                                size='small' 
                                color='primary'
                                onClick={() => handleViewDetails(transfer.id)}
                                title='View Details'
                              >
                                <i className='ri-eye-line'></i>
                              </IconButton>
                              
                              {/* Only show cancel button for REQUESTED or APPROVED transfers */}
                              {(transfer.status === 'REQUESTED' || transfer.status === 'APPROVED') && (
                                <IconButton 
                                  size='small' 
                                  color='error'
                                  onClick={() => handleCancelDialogOpen(transfer)}
                                  title='Cancel Transfer'
                                >
                                  <i className='ri-close-circle-line'></i>
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
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
          </CardContent>
        </Card>
      </Grid>
      
      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleCancelDialogClose}>
        <DialogTitle>Cancel Transfer Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel the transfer request for asset{' '}
            <strong>{selectedTransfer?.assetCode} - {selectedTransfer?.assetName}</strong>?
          </DialogContentText>
          <TextField
            label='Cancellation Notes'
            fullWidth
            multiline
            rows={3}
            value={cancellationNotes}
            onChange={(e) => setCancellationNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose} color='secondary'>
            No, Keep It
          </Button>
          <Button 
            onClick={handleCancelTransfer} 
            color='error' 
            variant='contained'
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Yes, Cancel Transfer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity='error' sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* Success Snackbar */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity='success' sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default MyTransferRequests
