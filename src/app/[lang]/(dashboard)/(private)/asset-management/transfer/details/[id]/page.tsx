'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

// Third-party Imports
import { format } from 'date-fns'

// MUI Imports
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Timeline Imports
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'

// Type Imports
import type { AssetTransferResponse, AssetTransferStatus } from '@/types/assets'

// API Imports
import { assetTransferApi } from '@/utils/api'

// Utils
// Status Chip Colors
const statusColorMap: Record<AssetTransferStatus, 'success' | 'info' | 'warning' | 'error'> = {
  REQUESTED: 'info',
  APPROVED: 'success',
  REJECTED: 'error',
  COMPLETED: 'success',
  CANCELLED: 'warning'
}

const TransferDetails = () => {
  // Router and params
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  
  // Get transfer ID from URL
  const transferId = params?.id ? Number(params.id) : 0
  
  // State
  const [transfer, setTransfer] = useState<AssetTransferResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // State for dialogs
  const [approveDialogOpen, setApproveDialogOpen] = useState<boolean>(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState<boolean>(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState<boolean>(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false)
  const [rejectionReason, setRejectionReason] = useState<string>('')
  const [completionNotes, setCompletionNotes] = useState<string>('')
  const [approvalNotes, setApprovalNotes] = useState<string>('')
  const [cancellationNotes, setCancellationNotes] = useState<string>('')
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  
  // Load transfer details on component mount
  useEffect(() => {
    if (transferId) {
      loadTransferDetails()
    }
  }, [transferId])
  
  // Load transfer details from API
  const loadTransferDetails = async () => {
    try {
      setLoading(true)
      
      const response = await assetTransferApi.getTransferById(transferId)
      
      setTransfer(response)
    } catch (error) {
      console.error('Error loading transfer details:', error)
      setError('Failed to load transfer details')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle approve dialog open
  const handleApproveDialogOpen = () => {
    setApprovalNotes('')
    setApproveDialogOpen(true)
  }
  
  // Handle approve dialog close
  const handleApproveDialogClose = () => {
    setApproveDialogOpen(false)
    setApprovalNotes('')
  }
  
  // Handle approve transfer
  const handleApproveTransfer = async () => {
    if (!transfer) return
    
    try {
      setActionLoading(true)
      
      await assetTransferApi.approveTransfer(transfer.id, approvalNotes)
      setSuccess(`Transfer request for ${transfer.assetCode} approved`)
      handleApproveDialogClose()
      loadTransferDetails()
    } catch (error) {
      console.error('Error approving transfer:', error)
      setError('Failed to approve transfer request')
    } finally {
      setActionLoading(false)
    }
  }
  
  // Handle reject dialog open
  const handleRejectDialogOpen = () => {
    setRejectionReason('')
    setRejectDialogOpen(true)
  }
  
  // Handle reject dialog close
  const handleRejectDialogClose = () => {
    setRejectDialogOpen(false)
    setRejectionReason('')
  }
  
  // Handle reject transfer
  const handleRejectTransfer = async () => {
    if (!transfer || !rejectionReason) return
    
    try {
      setActionLoading(true)
      
      await assetTransferApi.rejectTransfer(transfer.id, rejectionReason)
      setSuccess(`Transfer request for ${transfer.assetCode} rejected`)
      handleRejectDialogClose()
      loadTransferDetails()
    } catch (error) {
      console.error('Error rejecting transfer:', error)
      setError('Failed to reject transfer request')
    } finally {
      setActionLoading(false)
    }
  }
  
  // Handle complete dialog open
  const handleCompleteDialogOpen = () => {
    setCompletionNotes('')
    setCompleteDialogOpen(true)
  }
  
  // Handle complete dialog close
  const handleCompleteDialogClose = () => {
    setCompleteDialogOpen(false)
    setCompletionNotes('')
  }
  
  // Handle complete transfer
  const handleCompleteTransfer = async () => {
    if (!transfer) return
    
    try {
      setActionLoading(true)
      
      await assetTransferApi.completeTransfer(transfer.id, completionNotes)
      setSuccess(`Transfer for ${transfer.assetCode} marked as completed`)
      handleCompleteDialogClose()
      loadTransferDetails()
    } catch (error) {
      console.error('Error completing transfer:', error)
      setError('Failed to complete transfer')
    } finally {
      setActionLoading(false)
    }
  }
  
  // Handle cancel dialog open
  const handleCancelDialogOpen = () => {
    setCancellationNotes('')
    setCancelDialogOpen(true)
  }
  
  // Handle cancel dialog close
  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false)
    setCancellationNotes('')
  }
  
  // Handle cancel transfer
  const handleCancelTransfer = async () => {
    if (!transfer) return
    
    try {
      setActionLoading(true)
      
      await assetTransferApi.cancelTransfer(transfer.id, cancellationNotes)
      setSuccess(`Transfer request for ${transfer.assetCode} cancelled`)
      handleCancelDialogClose()
      loadTransferDetails()
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
  
  // Check if user is the requester
  const isRequester = transfer?.requestedById === session?.user?.id
  
  // Check if user is an admin (simplified check - you may need to adjust based on your auth system)
  const isAdmin = session?.user?.role === 'ADMIN'
  
  // Determine if user can perform actions based on status and role
  const canApprove = (transfer?.status === 'REQUESTED') && isAdmin
  const canReject = (transfer?.status === 'REQUESTED') && isAdmin
  const canComplete = (transfer?.status === 'APPROVED') && (isAdmin || isRequester)
  const canCancel = (transfer?.status === 'REQUESTED' || transfer?.status === 'APPROVED') && 
                   (isAdmin || isRequester)
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    
    return format(new Date(dateString), 'MMMM dd, yyyy hh:mm a')
  }
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    )
  }
  
  if (!transfer) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <Typography variant='h6'>Transfer not found or you do not have permission to view it.</Typography>
      </Box>
    )
  }
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h5'>
            Transfer Details: {transfer.assetCode} - {transfer.assetName}
          </Typography>
          <Button 
            variant='outlined' 
            color='secondary'
            onClick={() => router.back()}
            startIcon={<i className='ri-arrow-left-line'></i>}
          >
            Back
          </Button>
        </Box>
      </Grid>
      
      {/* Status Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardHeader 
            title='Status Information' 
            titleTypographyProps={{ variant: 'h6' }}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              backgroundColor: theme => theme.palette.background.default
            }}
          />
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              <ListItem 
                sx={{ 
                  py: 2, 
                  px: 4, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Typography variant='body2' color='text.secondary'>Current Status:</Typography>
                <Chip 
                  label={transfer.status} 
                  color={statusColorMap[transfer.status]} 
                  size='small' 
                />
              </ListItem>
              
              <ListItem 
                sx={{ 
                  py: 2, 
                  px: 4, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Typography variant='body2' color='text.secondary'>Requested By:</Typography>
                <Typography variant='body2'>{transfer.requestedByName}</Typography>
              </ListItem>
              
              {transfer.approvedById && (
                <ListItem 
                  sx={{ 
                    py: 2, 
                    px: 4, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    borderBottom: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>Approved By:</Typography>
                  <Typography variant='body2'>{transfer.approvedByName}</Typography>
                </ListItem>
              )}
              
              <ListItem 
                sx={{ 
                  py: 2, 
                  px: 4, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Typography variant='body2' color='text.secondary'>Created Date:</Typography>
                <Typography variant='body2'>{formatDate(transfer.createdAt)}</Typography>
              </ListItem>
              
              {transfer.transferDate && (
                <ListItem 
                  sx={{ 
                    py: 2, 
                    px: 4, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    borderBottom: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>Transfer Date:</Typography>
                  <Typography variant='body2'>{formatDate(transfer.transferDate)}</Typography>
                </ListItem>
              )}
              
              {transfer.approvedDate && (
                <ListItem 
                  sx={{ 
                    py: 2, 
                    px: 4, 
                    display: 'flex', 
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>Approved Date:</Typography>
                  <Typography variant='body2'>{formatDate(transfer.approvedDate)}</Typography>
                </ListItem>
              )}
            </List>
            
            {/* Action Buttons */}
            {(canApprove || canReject || canComplete || canCancel) && (
              <Box sx={{ p: 4, pt: 3 }}>
                <Typography variant='subtitle2' sx={{ mb: 2 }}>Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {canApprove && (
                    <Button 
                      variant='contained' 
                      color='success' 
                      fullWidth
                      onClick={handleApproveDialogOpen}
                      startIcon={<i className='ri-check-line'></i>}
                    >
                      Approve Transfer
                    </Button>
                  )}
                  
                  {canReject && (
                    <Button 
                      variant='contained' 
                      color='error' 
                      fullWidth
                      onClick={handleRejectDialogOpen}
                      startIcon={<i className='ri-close-line'></i>}
                    >
                      Reject Transfer
                    </Button>
                  )}
                  
                  {canComplete && (
                    <Button 
                      variant='contained' 
                      color='primary' 
                      fullWidth
                      onClick={handleCompleteDialogOpen}
                      startIcon={<i className='ri-check-double-line'></i>}
                    >
                      Mark as Completed
                    </Button>
                  )}
                  
                  {canCancel && (
                    <Button 
                      variant='outlined' 
                      color='warning' 
                      fullWidth
                      onClick={handleCancelDialogOpen}
                      startIcon={<i className='ri-close-circle-line'></i>}
                    >
                      Cancel Transfer
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      {/* Asset Information */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%' }}>
          <CardHeader 
            title='Asset & Transfer Information' 
            titleTypographyProps={{ variant: 'h6' }}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              backgroundColor: theme => theme.palette.background.default
            }}
          />
          <CardContent>
            <Grid container spacing={4}>
              {/* Asset Information */}
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant='subtitle2' 
                  sx={{ 
                    mb: 2, 
                    pb: 1, 
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  Asset Information
                </Typography>
                <List disablePadding>
                  <ListItem 
                    sx={{ 
                      py: 1, 
                      px: 0, 
                      display: 'flex', 
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>Asset Code:</Typography>
                    <Typography variant='body2' fontWeight='medium'>{transfer.assetCode}</Typography>
                  </ListItem>
                  <ListItem 
                    sx={{ 
                      py: 1, 
                      px: 0, 
                      display: 'flex', 
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>Asset Name:</Typography>
                    <Typography variant='body2' fontWeight='medium'>{transfer.assetName}</Typography>
                  </ListItem>
                  <ListItem 
                    sx={{ 
                      py: 1, 
                      px: 0, 
                      display: 'flex', 
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>Asset ID:</Typography>
                    <Typography variant='body2'>{transfer.assetId}</Typography>
                  </ListItem>
                </List>
              </Grid>
              
              {/* Transfer Reason */}
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant='subtitle2' 
                  sx={{ 
                    mb: 2, 
                    pb: 1, 
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  Transfer Reason
                </Typography>
                <Box sx={{ p: 2, backgroundColor: 'background.default', borderRadius: 1, mb: 3 }}>
                  <Typography variant='body2'>{transfer.reason || 'No reason provided'}</Typography>
                </Box>
                
                {transfer.notes && (
                  <>
                    <Typography 
                      variant='subtitle2' 
                      sx={{ 
                        mb: 2, 
                        pb: 1, 
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      Notes
                    </Typography>
                    <Box sx={{ p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                      <Typography variant='body2'>{transfer.notes}</Typography>
                    </Box>
                  </>
                )}
              </Grid>
              
              {/* Source Information */}
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant='subtitle2' 
                  sx={{ 
                    mb: 2, 
                    pb: 1, 
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  Source Information
                </Typography>
                <List disablePadding>
                  <ListItem 
                    sx={{ 
                      py: 1, 
                      px: 0, 
                      display: 'flex', 
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>Branch:</Typography>
                    <Typography variant='body2' fontWeight='medium'>{transfer.sourceBranchName}</Typography>
                  </ListItem>
                  <ListItem 
                    sx={{ 
                      py: 1, 
                      px: 0, 
                      display: 'flex', 
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>Location:</Typography>
                    <Typography variant='body2'>{transfer.sourceLocationName}</Typography>
                  </ListItem>
                  <ListItem 
                    sx={{ 
                      py: 1, 
                      px: 0, 
                      display: 'flex', 
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>Department:</Typography>
                    <Typography variant='body2'>{transfer.sourceDepartmentName}</Typography>
                  </ListItem>
                </List>
              </Grid>
              
              {/* Destination Information */}
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant='subtitle2' 
                  sx={{ 
                    mb: 2, 
                    pb: 1, 
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  Destination Information
                </Typography>
                <List disablePadding>
                  <ListItem 
                    sx={{ 
                      py: 1, 
                      px: 0, 
                      display: 'flex', 
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>Branch:</Typography>
                    <Typography variant='body2' fontWeight='medium'>{transfer.destinationBranchName}</Typography>
                  </ListItem>
                  <ListItem 
                    sx={{ 
                      py: 1, 
                      px: 0, 
                      display: 'flex', 
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>Location:</Typography>
                    <Typography variant='body2'>{transfer.destinationLocationName}</Typography>
                  </ListItem>
                  <ListItem 
                    sx={{ 
                      py: 1, 
                      px: 0, 
                      display: 'flex', 
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>Department:</Typography>
                    <Typography variant='body2'>{transfer.destinationDepartmentName}</Typography>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Timeline */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Transfer Timeline' 
            titleTypographyProps={{ variant: 'h6' }}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              backgroundColor: theme => theme.palette.background.default
            }}
          />
          <CardContent>
            <Timeline position='alternate'>
              <TimelineItem>
                <TimelineOppositeContent color='text.secondary'>
                  {formatDate(transfer.createdAt)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color='info' />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant='subtitle1' fontWeight='medium'>Transfer Requested</Typography>
                  <Typography variant='body2'>
                    {transfer.requestedByName} requested to transfer {transfer.assetName} from {transfer.sourceBranchName} to {transfer.destinationBranchName}
                  </Typography>
                  {transfer.reason && (
                    <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                      Reason: {transfer.reason}
                    </Typography>
                  )}
                </TimelineContent>
              </TimelineItem>
              
              {transfer.status !== 'REQUESTED' && (
                <TimelineItem>
                  <TimelineOppositeContent color='text.secondary'>
                    {formatDate(transfer.approvedDate || transfer.updatedAt)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={
                      transfer.status === 'APPROVED' || transfer.status === 'COMPLETED' 
                        ? 'success' 
                        : transfer.status === 'REJECTED' 
                          ? 'error' 
                          : 'warning'
                    } />
                    {transfer.status === 'COMPLETED' && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant='subtitle1' fontWeight='medium'>
                      {transfer.status === 'APPROVED' && 'Transfer Approved'}
                      {transfer.status === 'REJECTED' && 'Transfer Rejected'}
                      {transfer.status === 'CANCELLED' && 'Transfer Cancelled'}
                      {transfer.status === 'COMPLETED' && 'Transfer Approved'}
                    </Typography>
                    <Typography variant='body2'>
                      {transfer.status === 'APPROVED' && `Approved by ${transfer.approvedByName}`}
                      {transfer.status === 'REJECTED' && 'The transfer request was rejected'}
                      {transfer.status === 'CANCELLED' && 'The transfer request was cancelled'}
                      {transfer.status === 'COMPLETED' && `Approved by ${transfer.approvedByName}`}
                    </Typography>
                    {transfer.notes && (
                      <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                        Note: {transfer.notes}
                      </Typography>
                    )}
                  </TimelineContent>
                </TimelineItem>
              )}
              
              {transfer.status === 'COMPLETED' && (
                <TimelineItem>
                  <TimelineOppositeContent color='text.secondary'>
                    {formatDate(transfer.transferDate)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color='success' />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant='subtitle1' fontWeight='medium'>Transfer Completed</Typography>
                    <Typography variant='body2'>
                      The asset has been successfully transferred to {transfer.destinationBranchName}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}
            </Timeline>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={handleApproveDialogClose}>
        <DialogTitle>Approve Transfer Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve the transfer request for asset{' '}
            <strong>{transfer?.assetCode} - {transfer?.assetName}</strong>?
          </DialogContentText>
          <TextField
            label='Approval Notes'
            fullWidth
            multiline
            rows={3}
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            sx={{ mt: 2 }}
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
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleRejectDialogClose}>
        <DialogTitle>Reject Transfer Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject the transfer request for asset{' '}
            <strong>{transfer?.assetCode} - {transfer?.assetName}</strong>?
          </DialogContentText>
          <TextField
            label='Rejection Reason'
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
            error={!rejectionReason}
            helperText={!rejectionReason ? 'Rejection reason is required' : ''}
            sx={{ mt: 2 }}
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
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Complete Dialog */}
      <Dialog open={completeDialogOpen} onClose={handleCompleteDialogClose}>
        <DialogTitle>Complete Transfer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this transfer as completed? This will update the asset&apos;s location to{' '}
            <strong>{transfer?.destinationBranchName}</strong>.
          </DialogContentText>
          <TextField
            label='Completion Notes'
            fullWidth
            multiline
            rows={3}
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCompleteDialogClose} color='secondary'>
            Cancel
          </Button>
          <Button 
            onClick={handleCompleteTransfer} 
            color='primary' 
            variant='contained'
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Complete Transfer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleCancelDialogClose}>
        <DialogTitle>Cancel Transfer Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel the transfer request for asset{' '}
            <strong>{transfer?.assetCode} - {transfer?.assetName}</strong>?
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
            color='warning' 
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

export default TransferDetails
