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
import InputAdornment from '@mui/material/InputAdornment'
import type { SelectChangeEvent } from '@mui/material'

// Type Imports
import type { AssetTransferResponse, AssetTransferStatus, Branch } from '@/types/assets'

// API Imports
import { assetTransferApi, branchApi } from '@/utils/api'

// Status Chip Colors
const statusColorMap: Record<AssetTransferStatus, 'success' | 'info' | 'warning' | 'error'> = {
  REQUESTED: 'info',
  APPROVED: 'success',
  REJECTED: 'error',
  COMPLETED: 'success',
  CANCELLED: 'warning'
}

const AssetTransferList = () => {
  // Hooks
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
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<AssetTransferStatus | ''>('')
  const [fromBranchId, setFromBranchId] = useState<number | string>('')
  const [toBranchId, setToBranchId] = useState<number | string>('')
  const [assetId, setAssetId] = useState<number | ''>('')
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string>('transferDate,desc')
  
  // Branch data
  const [branches, setBranches] = useState<Branch[]>([])
  const [branchesLoading, setBranchesLoading] = useState<boolean>(false)
  
  // Selected transfer for actions
  const [selectedTransfer, setSelectedTransfer] = useState<AssetTransferResponse | null>(null)
  
  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState<boolean>(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState<boolean>(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState<boolean>(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false)
  const [rejectionReason, setRejectionReason] = useState<string>('')
  const [completionNotes, setCompletionNotes] = useState<string>('')
  const [approvalNotes, setApprovalNotes] = useState<string>('')
  const [cancellationNotes, setCancellationNotes] = useState<string>('')
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  
  // Load transfers on component mount and when filters change
  useEffect(() => {
    if (session?.user?.email) {
      loadTransfers(
        page, 
        rowsPerPage, 
        searchTerm, 
        selectedStatus, 
        fromBranchId, 
        toBranchId, 
        assetId,
        startDate,
        endDate,
        sortField
      )
    }
  }, [session, page, rowsPerPage, searchTerm, selectedStatus, fromBranchId, toBranchId, assetId, startDate, endDate, sortField])
  
  // Load branches on component mount
  useEffect(() => {
    if (session?.user?.email) {
      loadBranches()
    }
  }, [session])
  
  // Load branches from API
  const loadBranches = async () => {

    try {
      setBranchesLoading(true)
      
      const response = await branchApi.getBranches({
        size: 100,
        isActive: true
      })
      
      setBranches(response.content)
    } catch (error) {
      console.error('Error loading branches:', error)
      setError('Failed to load branches')
    } finally {
      setBranchesLoading(false)
    }
  }
  
  // Load transfers from API
  const loadTransfers = async (
    page: number,
    rowsPerPage: number,
    searchTerm: string,
    status: AssetTransferStatus | '',
    fromBranchId: number | string,
    toBranchId: number | string,
    assetId: number | '',
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
      
      if (searchTerm) {
        params.search = searchTerm
      }
      
      if (status) {
        params.status = status
      }
      
      if (fromBranchId !== '') {
        params.fromBranchId = fromBranchId
      }
      
      if (toBranchId !== '') {
        params.toBranchId = toBranchId
      }
      
      if (assetId) {
        params.assetId = assetId
      }
      
      if (startDate) {
        params.startDate = startDate
      }
      
      if (endDate) {
        params.endDate = endDate
      }
      
      const response = await assetTransferApi.getTransfers(params)
      
      setTransfers(response.content)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error('Error loading transfers:', error)
      setError('Failed to load asset transfers')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle page change
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  
  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  
  // Handle status filter change
  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value as AssetTransferStatus | '')
  }
  
  // Handle from branch filter change
  const handleFromBranchChange = (event: SelectChangeEvent) => {
    setFromBranchId(event.target.value === '' ? '' : Number(event.target.value))
  }
  
  // Handle to branch filter change
  const handleToBranchChange = (event: SelectChangeEvent) => {
    setToBranchId(event.target.value === '' ? '' : Number(event.target.value))
  }
  
  // Handle asset ID filter change
  const handleAssetIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setAssetId(value === '' ? '' : Number(value))
  }
  
  // Handle start date filter change
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value)
  }
  
  // Handle end date filter change
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value)
  }
  
  // Handle sort filter change
  const handleSortFieldChange = (event: SelectChangeEvent) => {
    setSortField(event.target.value)
  }
  
  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedStatus('')
    setFromBranchId('')
    setToBranchId('')
    setAssetId('')
    setStartDate(null)
    setEndDate(null)
    setSortField('transferDate,desc')
    setPage(0)
    loadTransfers(0, rowsPerPage, '', '', '', '', '', null, null, 'transferDate,desc')
  }
  
  // Open approve dialog
  const handleApproveDialogOpen = (transfer: AssetTransferResponse) => {
    setSelectedTransfer(transfer)
    setApprovalNotes('')
    setApproveDialogOpen(true)
  }
  
  // Close approve dialog
  const handleApproveDialogClose = () => {
    setApproveDialogOpen(false)
    setSelectedTransfer(null)
    setApprovalNotes('')
  }
  
  // Open reject dialog
  const handleRejectDialogOpen = (transfer: AssetTransferResponse) => {
    setSelectedTransfer(transfer)
    setRejectionReason('')
    setRejectDialogOpen(true)
  }
  
  // Close reject dialog
  const handleRejectDialogClose = () => {
    setRejectDialogOpen(false)
    setSelectedTransfer(null)
    setRejectionReason('')
  }
  
  // Open complete dialog
  const handleCompleteDialogOpen = (transfer: AssetTransferResponse) => {
    setSelectedTransfer(transfer)
    setCompletionNotes('')
    setCompleteDialogOpen(true)
  }
  
  // Close complete dialog
  const handleCompleteDialogClose = () => {
    setCompleteDialogOpen(false)
    setSelectedTransfer(null)
    setCompletionNotes('')
  }
  
  // Open cancel dialog
  const handleCancelDialogOpen = (transfer: AssetTransferResponse) => {
    setSelectedTransfer(transfer)
    setCancellationNotes('')
    setCancelDialogOpen(true)
  }
  
  // Close cancel dialog
  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false)
    setSelectedTransfer(null)
    setCancellationNotes('')
  }
  
  // Handle approve transfer
  const handleApproveTransfer = async () => {
    if (!selectedTransfer) return
    
    try {
      setActionLoading(true)
      
      await assetTransferApi.approveTransfer(selectedTransfer.id, approvalNotes)
      setSuccess(`Transfer request for ${selectedTransfer.assetCode} approved`)
      handleApproveDialogClose()
      loadTransfers(page, rowsPerPage, searchTerm, selectedStatus, fromBranchId, toBranchId, assetId, startDate, endDate, sortField)
    } catch (error) {
      console.error('Error approving transfer:', error)
      setError('Failed to approve transfer request')
    } finally {
      setActionLoading(false)
    }
  }
  
  // Handle reject transfer
  const handleRejectTransfer = async () => {
    if (!selectedTransfer || !rejectionReason) return
    
    try {
      setActionLoading(true)
      
      await assetTransferApi.rejectTransfer(selectedTransfer.id, rejectionReason)
      setSuccess(`Transfer request for ${selectedTransfer.assetCode} rejected`)
      handleRejectDialogClose()
      loadTransfers(page, rowsPerPage, searchTerm, selectedStatus, fromBranchId, toBranchId, assetId, startDate, endDate, sortField)
    } catch (error) {
      console.error('Error rejecting transfer:', error)
      setError('Failed to reject transfer request')
    } finally {
      setActionLoading(false)
    }
  }
  
  // Handle complete transfer
  const handleCompleteTransfer = async () => {
    if (!selectedTransfer) return
    
    try {
      setActionLoading(true)
      
      await assetTransferApi.completeTransfer(selectedTransfer.id, completionNotes)
      setSuccess(`Transfer for ${selectedTransfer.assetCode} marked as completed`)
      handleCompleteDialogClose()
      loadTransfers(page, rowsPerPage, searchTerm, selectedStatus, fromBranchId, toBranchId, assetId, startDate, endDate, sortField)
    } catch (error) {
      console.error('Error completing transfer:', error)
      setError('Failed to complete transfer')
    } finally {
      setActionLoading(false)
    }
  }
  
  // Handle cancel transfer
  const handleCancelTransfer = async () => {
    if (!selectedTransfer) return
    
    try {
      setActionLoading(true)
      
      await assetTransferApi.cancelTransfer(selectedTransfer.id, cancellationNotes)
      setSuccess(`Transfer request for ${selectedTransfer.assetCode} cancelled`)
      handleCancelDialogClose()
      loadTransfers(page, rowsPerPage, searchTerm, selectedStatus, fromBranchId, toBranchId, assetId, startDate, endDate, sortField)
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
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Asset Transfer Requests' 
            action={
              <Button 
                variant='contained' 
                startIcon={<i className='ri-add-line'></i>}
                onClick={() => router.push('/en/asset-management/transfer/create')}
              >
                New Transfer
              </Button>
            }
          />
          <CardContent>
            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <TextField
                label='Search'
                placeholder='Search by asset code or name'
                value={searchTerm}
                onChange={handleSearch}
                sx={{ flexGrow: 1, minWidth: '200px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-search-line'></i>
                    </InputAdornment>
                  )
                }}
              />
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
              
              <FormControl sx={{ minWidth: '150px' }}>
                <InputLabel id='from-branch-filter-label'>From Branch</InputLabel>
                <Select
                  labelId='from-branch-filter-label'
                  value={fromBranchId.toString()}
                  onChange={handleFromBranchChange}
                  label='From Branch'
                  disabled={branchesLoading}
                >
                  <MenuItem value=''>All Branches</MenuItem>
                  {branches.map((branch) => (
                    <MenuItem key={`from-${branch.id}`} value={branch.id.toString()}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: '150px' }}>
                <InputLabel id='to-branch-filter-label'>To Branch</InputLabel>
                <Select
                  labelId='to-branch-filter-label'
                  value={toBranchId.toString()}
                  onChange={handleToBranchChange}
                  label='To Branch'
                  disabled={branchesLoading}
                >
                  <MenuItem value=''>All Branches</MenuItem>
                  {branches.map((branch) => (
                    <MenuItem key={`to-${branch.id}`} value={branch.id.toString()}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <TextField
                label='Asset ID'
                type='number'
                value={assetId === '' ? '' : assetId}
                onChange={handleAssetIdChange}
                sx={{ width: '150px' }}
              />
              
              <TextField
                label='Start Date'
                type='date'
                value={startDate || ''}
                onChange={handleStartDateChange}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '200px' }}
              />
              
              <TextField
                label='End Date'
                type='date'
                value={endDate || ''}
                onChange={handleEndDateChange}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '200px' }}
              />
              
              <FormControl sx={{ minWidth: '200px' }}>
                <InputLabel id='sort-filter-label'>Sort By</InputLabel>
                <Select
                  labelId='sort-filter-label'
                  value={sortField}
                  onChange={handleSortFieldChange}
                  label='Sort By'
                >
                  <MenuItem value='transferDate,desc'>Transfer Date (Newest)</MenuItem>
                  <MenuItem value='transferDate,asc'>Transfer Date (Oldest)</MenuItem>
                  <MenuItem value='assetCode,asc'>Asset Code (A-Z)</MenuItem>
                  <MenuItem value='assetCode,desc'>Asset Code (Z-A)</MenuItem>
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
            
            {/* Transfers Table */}
            {loading && transfers.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                  <Table stickyHeader aria-label='asset transfers table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Asset Code</TableCell>
                        <TableCell>Asset Name</TableCell>
                        <TableCell>From Branch</TableCell>
                        <TableCell>To Branch</TableCell>
                        <TableCell>Requested By</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align='right'>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transfers.length > 0 ? (
                        transfers.map((transfer) => (
                          <TableRow hover key={transfer.id}>
                            <TableCell>{transfer.assetCode}</TableCell>
                            <TableCell>{transfer.assetName}</TableCell>
                            <TableCell>
                              <Typography variant='body2'>{transfer.sourceBranchName}</Typography>
                              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                {transfer.sourceBranchId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant='body2'>{transfer.destinationBranchName}</Typography>
                              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                {transfer.destinationBranchId}
                              </Typography>
                            </TableCell>
                            <TableCell>{transfer.requestedByName}</TableCell>
                            <TableCell>
                              <Chip 
                                label={transfer.status} 
                                color={statusColorMap[transfer.status]} 
                                size='small' 
                              />
                            </TableCell>
                            <TableCell align='right'>
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <IconButton 
                                  color='primary' 
                                  size='small'
                                  onClick={() => router.push(`/en/asset-management/transfer/details/${transfer.id}`)}
                                  title="View Transfer Details"
                                >
                                  <i className='ri-eye-line'></i>
                                </IconButton>
                                
                                {transfer.status === 'REQUESTED' && (
                                  <>
                                    <IconButton 
                                      color='success' 
                                      size='small'
                                      onClick={() => handleApproveDialogOpen(transfer)}
                                    >
                                      <i className='ri-check-line'></i>
                                    </IconButton>
                                    <IconButton 
                                      color='error' 
                                      size='small'
                                      onClick={() => handleRejectDialogOpen(transfer)}
                                    >
                                      <i className='ri-close-line'></i>
                                    </IconButton>
                                    <IconButton 
                                      color='warning' 
                                      size='small'
                                      onClick={() => handleCancelDialogOpen(transfer)}
                                    >
                                      <i className='ri-delete-bin-line'></i>
                                    </IconButton>
                                  </>
                                )}
                                
                                {transfer.status === 'APPROVED' && (
                                  <IconButton 
                                    color='success' 
                                    size='small'
                                    onClick={() => handleCompleteDialogOpen(transfer)}
                                  >
                                    <i className='ri-check-double-line'></i>
                                  </IconButton>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align='center'>
                            <Typography variant='body1'>No transfer requests found</Typography>
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
      
      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={handleApproveDialogClose}>
        <DialogTitle>Approve Transfer Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve the transfer request for asset{' '}
            <strong>{selectedTransfer?.assetCode} - {selectedTransfer?.assetName}</strong>?
          </DialogContentText>
          <TextField
            label='Approval Notes'
            fullWidth
            multiline
            rows={3}
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApproveDialogClose} color='secondary'>
            Cancel
          </Button>
          <Button 
            onClick={handleApproveTransfer} 
            color='success' 
            variant='contained'
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleRejectDialogClose}>
        <DialogTitle>Reject Transfer Request</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a reason for rejecting the transfer request for asset{' '}
            <strong>{selectedTransfer?.assetCode} - {selectedTransfer?.assetName}</strong>.
          </DialogContentText>
          <TextField
            autoFocus
            label='Rejection Reason'
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectDialogClose} color='secondary'>
            Cancel
          </Button>
          <Button 
            onClick={handleRejectTransfer} 
            color='error' 
            variant='contained'
            disabled={actionLoading || !rejectionReason}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Complete Dialog */}
      <Dialog open={completeDialogOpen} onClose={handleCompleteDialogClose}>
        <DialogTitle>Complete Transfer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this transfer as completed? This will update the asset&apos;s location to{' '}
            <strong>{selectedTransfer?.destinationBranchName}</strong>.
          </DialogContentText>
          <TextField
            label='Completion Notes'
            fullWidth
            multiline
            rows={3}
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCompleteDialogClose} color='secondary'>
            Cancel
          </Button>
          <Button 
            onClick={handleCompleteTransfer} 
            color='success' 
            variant='contained'
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            Complete Transfer
          </Button>
        </DialogActions>
      </Dialog>
      
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
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default AssetTransferList
