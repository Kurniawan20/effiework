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
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import type { SelectChangeEvent } from '@mui/material'

// Dummy Data for Reconciliation Records
const dummyReconciliationData = [
  {
    id: 1,
    reconciliationId: 'REC-2025-001',
    auditId: 'AUD-2025-001',
    startDate: '2025-01-21',
    endDate: '2025-01-25',
    status: 'COMPLETED',
    totalDiscrepancies: 2,
    resolvedDiscrepancies: 2,
    createdBy: 'John Smith',
    notes: 'All discrepancies from January audit resolved'
  },
  {
    id: 2,
    reconciliationId: 'REC-2025-002',
    auditId: 'AUD-2025-003',
    startDate: '2025-03-05',
    endDate: null,
    status: 'IN_PROGRESS',
    totalDiscrepancies: 3,
    resolvedDiscrepancies: 1,
    createdBy: 'Michael Brown',
    notes: 'Reconciliation in progress for March audit'
  }
]

// Dummy Data for Reconciliation Actions
const dummyReconciliationActions = [
  {
    id: 1,
    reconciliationId: 'REC-2025-001',
    assetCode: 'AST-045',
    assetName: 'Dell Monitor P2419H',
    discrepancyType: 'LOCATION',
    action: 'UPDATE_LOCATION',
    previousValue: 'Main Office',
    newValue: 'Storage Room',
    status: 'COMPLETED',
    actionDate: '2025-01-22',
    actionBy: 'John Smith'
  },
  {
    id: 2,
    reconciliationId: 'REC-2025-001',
    assetCode: 'AST-078',
    assetName: 'Logitech Wireless Keyboard',
    discrepancyType: 'ASSIGNMENT',
    action: 'UPDATE_ASSIGNMENT',
    previousValue: 'IT Department',
    newValue: 'Design Department',
    status: 'COMPLETED',
    actionDate: '2025-01-23',
    actionBy: 'John Smith'
  },
  {
    id: 3,
    reconciliationId: 'REC-2025-002',
    assetCode: 'AST-089',
    assetName: 'Cisco IP Phone',
    discrepancyType: 'STATUS',
    action: 'UPDATE_STATUS',
    previousValue: 'ASSIGNED',
    newValue: 'MAINTENANCE',
    status: 'COMPLETED',
    actionDate: '2025-03-06',
    actionBy: 'Michael Brown'
  },
  {
    id: 4,
    reconciliationId: 'REC-2025-002',
    assetCode: 'AST-112',
    assetName: 'HP LaserJet Printer',
    discrepancyType: 'LOCATION',
    action: 'MARK_MISSING',
    previousValue: 'Admin Department',
    newValue: 'MISSING',
    status: 'PENDING',
    actionDate: null,
    actionBy: null
  },
  {
    id: 5,
    reconciliationId: 'REC-2025-002',
    assetCode: 'AST-156',
    assetName: 'Projector Screen',
    discrepancyType: 'LOCATION',
    action: 'UPDATE_LOCATION',
    previousValue: 'Conference Room',
    newValue: 'Storage Room',
    status: 'PENDING',
    actionDate: null,
    actionBy: null
  }
]

// Interface for tab panel props
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

// Tab Panel Component
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`reconciliation-tabpanel-${index}`}
      aria-labelledby={`reconciliation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const ReconciliationPage = () => {
  // State
  const [reconciliationData, setReconciliationData] = useState<typeof dummyReconciliationData>([])
  const [reconciliationActions, setReconciliationActions] = useState<typeof dummyReconciliationActions>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [selectedReconciliation, setSelectedReconciliation] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [selectedAction, setSelectedAction] = useState<(typeof dummyReconciliationActions)[0] | null>(null)
  const [actionNotes, setActionNotes] = useState<string>('')
  const [tabValue, setTabValue] = useState<number>(0)
  const [actionDialogOpen, setActionDialogOpen] = useState<boolean>(false)
  const [selectedActionType, setSelectedActionType] = useState<string>('')
  const [actionValue, setActionValue] = useState<string>('')

  // Load data on component mount
  useEffect(() => {
    loadReconciliationData()
  }, [])

  // Load reconciliation data (simulated)
  const loadReconciliationData = () => {
    setLoading(true)
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      setReconciliationData([...dummyReconciliationData])
      setReconciliationActions([...dummyReconciliationActions])
      setTotalElements(dummyReconciliationData.length)
      setLoading(false)
    }, 1000)
  }

  // Filter actions based on selected reconciliation
  const filteredActions = reconciliationActions.filter(item => {
    if (!selectedReconciliation) return true
    return item.reconciliationId === selectedReconciliation
  }).filter(item => {
    if (!selectedStatus) return true
    return item.status === selectedStatus
  })

  // Handle page change
  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle reconciliation filter change
  const handleReconciliationChange = (event: SelectChangeEvent) => {
    setSelectedReconciliation(event.target.value)
    setPage(0)
  }

  // Handle status filter change
  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value)
    setPage(0)
  }

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedReconciliation('')
    setSelectedStatus('')
    setPage(0)
  }

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Handle view actions
  const handleViewActions = (reconciliationId: string) => {
    setSelectedReconciliation(reconciliationId)
    setTabValue(1) // Switch to Actions tab
  }

  // Handle action dialog open
  const handleActionDialogOpen = (action: (typeof dummyReconciliationActions)[0]) => {
    setSelectedAction(action)
    setActionNotes('')
    setDialogOpen(true)
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedAction(null)
    setActionNotes('')
  }

  // Handle complete action
  const handleCompleteAction = () => {
    if (!selectedAction) return
    
    // Update the action in the dummy data
    const updatedData = reconciliationActions.map(item => {
      if (item.id === selectedAction.id) {
        return {
          ...item,
          status: 'COMPLETED',
          actionDate: new Date().toISOString().split('T')[0],
          actionBy: 'Current User' // In a real app, this would be the logged-in user
        }
      }
      return item
    })
    
    setReconciliationActions(updatedData)
    
    // Update the reconciliation record
    const updatedReconciliations = reconciliationData.map(item => {
      if (item.reconciliationId === selectedAction.reconciliationId) {
        return {
          ...item,
          resolvedDiscrepancies: item.resolvedDiscrepancies + 1
        }
      }
      return item
    })
    
    setReconciliationData(updatedReconciliations)
    
    setSuccess(`Action for asset ${selectedAction.assetCode} has been completed`)
    handleDialogClose()
  }

  // Handle new action dialog open
  const handleNewActionDialogOpen = () => {
    setSelectedActionType('')
    setActionValue('')
    setActionDialogOpen(true)
  }

  // Handle new action dialog close
  const handleNewActionDialogClose = () => {
    setActionDialogOpen(false)
    setSelectedActionType('')
    setActionValue('')
  }

  // Handle create new action
  const handleCreateNewAction = () => {
    // In a real app, this would create a new action
    setSuccess('New reconciliation action created')
    handleNewActionDialogClose()
  }

  // Handle error close
  const handleErrorClose = () => {
    setError(null)
  }

  // Handle success close
  const handleSuccessClose = () => {
    setSuccess(null)
  }

  // Start new reconciliation
  const handleStartNewReconciliation = () => {
    // In a real app, this would create a new reconciliation record
    const newReconciliationId = `REC-2025-${String(reconciliationData.length + 1).padStart(3, '0')}`
    const today = new Date().toISOString().split('T')[0]
    
    const newReconciliation = {
      id: reconciliationData.length + 1,
      reconciliationId: newReconciliationId,
      auditId: 'AUD-2025-003', // In a real app, this would be selected by the user
      startDate: today,
      endDate: null,
      status: 'IN_PROGRESS',
      totalDiscrepancies: 0,
      resolvedDiscrepancies: 0,
      createdBy: 'Current User', // In a real app, this would be the logged-in user
      notes: 'New reconciliation initiated'
    }
    
    setReconciliationData([newReconciliation, ...reconciliationData])
    setSuccess(`New reconciliation ${newReconciliationId} has been initiated`)
  }

  // Complete reconciliation
  const handleCompleteReconciliation = (reconciliationId: string) => {
    // Check if all actions are completed
    const pendingActions = reconciliationActions.filter(
      action => action.reconciliationId === reconciliationId && action.status === 'PENDING'
    )
    
    if (pendingActions.length > 0) {
      setError(`Cannot complete reconciliation. ${pendingActions.length} actions are still pending.`)
      return
    }
    
    // Update the reconciliation record
    const updatedReconciliations = reconciliationData.map(item => {
      if (item.reconciliationId === reconciliationId) {
        return {
          ...item,
          status: 'COMPLETED',
          endDate: new Date().toISOString().split('T')[0]
        }
      }
      return item
    })
    
    setReconciliationData(updatedReconciliations)
    setSuccess(`Reconciliation ${reconciliationId} has been completed`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Asset Reconciliation' 
            action={
              <Button 
                variant='contained' 
                color='primary'
                onClick={handleStartNewReconciliation}
                startIcon={<i className='ri-add-line'></i>}
              >
                Start New Reconciliation
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label='reconciliation tabs'>
                <Tab label='Reconciliation Records' id='reconciliation-tab-0' aria-controls='reconciliation-tabpanel-0' />
                <Tab label='Reconciliation Actions' id='reconciliation-tab-1' aria-controls='reconciliation-tabpanel-1' />
              </Tabs>
            </Box>
            
            {/* Reconciliation Records Tab */}
            <TabPanel value={tabValue} index={0}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer>
                    <Table stickyHeader aria-label='reconciliation records table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Reconciliation ID</TableCell>
                          <TableCell>Audit ID</TableCell>
                          <TableCell>Date Range</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created By</TableCell>
                          <TableCell>Progress</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reconciliationData.length > 0 ? (
                          reconciliationData.map((record) => (
                            <TableRow hover key={record.id}>
                              <TableCell>{record.reconciliationId}</TableCell>
                              <TableCell>{record.auditId}</TableCell>
                              <TableCell>
                                {record.startDate} {record.endDate ? `to ${record.endDate}` : '(In Progress)'}
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={record.status === 'COMPLETED' ? 'Completed' : 'In Progress'} 
                                  color={record.status === 'COMPLETED' ? 'success' : 'warning'} 
                                  size='small' 
                                />
                              </TableCell>
                              <TableCell>{record.createdBy}</TableCell>
                              <TableCell>
                                <Typography variant='body2'>
                                  {record.resolvedDiscrepancies} / {record.totalDiscrepancies} resolved
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                  <Box sx={{ width: '100%', mr: 1 }}>
                                    <div style={{ 
                                      height: 4, 
                                      borderRadius: 2, 
                                      backgroundColor: '#e0e0e0',
                                      position: 'relative'
                                    }}>
                                      <div style={{
                                        height: '100%',
                                        width: `${record.totalDiscrepancies > 0 ? (record.resolvedDiscrepancies / record.totalDiscrepancies) * 100 : 0}%`,
                                        borderRadius: 2,
                                        backgroundColor: record.resolvedDiscrepancies < record.totalDiscrepancies ? '#ff9800' : '#4caf50',
                                        transition: 'width 0.3s ease'
                                      }} />
                                    </div>
                                  </Box>
                                  <Box sx={{ minWidth: 35 }}>
                                    <Typography variant='body2' color='text.secondary'>
                                      {record.totalDiscrepancies > 0 
                                        ? `${Math.round((record.resolvedDiscrepancies / record.totalDiscrepancies) * 100)}%` 
                                        : '0%'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <IconButton 
                                    color='primary' 
                                    size='small'
                                    onClick={() => handleViewActions(record.reconciliationId)}
                                    title='View Actions'
                                  >
                                    <i className='ri-list-check'></i>
                                  </IconButton>
                                  <IconButton 
                                    color='info' 
                                    size='small'
                                    title='View Details'
                                  >
                                    <i className='ri-eye-line'></i>
                                  </IconButton>
                                  {record.status === 'IN_PROGRESS' && (
                                    <IconButton 
                                      color='success' 
                                      size='small'
                                      onClick={() => handleCompleteReconciliation(record.reconciliationId)}
                                      title='Complete Reconciliation'
                                      disabled={record.resolvedDiscrepancies < record.totalDiscrepancies}
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
                              <Typography variant='body1'>No reconciliation records found</Typography>
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
            </TabPanel>
            
            {/* Reconciliation Actions Tab */}
            <TabPanel value={tabValue} index={1}>
              {/* Filters */}
              <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  <FormControl sx={{ minWidth: '200px' }} size='small'>
                    <InputLabel id='reconciliation-filter-label'>Reconciliation</InputLabel>
                    <Select
                      labelId='reconciliation-filter-label'
                      value={selectedReconciliation}
                      onChange={handleReconciliationChange}
                      label='Reconciliation'
                    >
                      <MenuItem value=''>All Reconciliations</MenuItem>
                      {reconciliationData.map(record => (
                        <MenuItem key={record.id} value={record.reconciliationId}>{record.reconciliationId}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl sx={{ minWidth: '200px' }} size='small'>
                    <InputLabel id='status-filter-label'>Status</InputLabel>
                    <Select
                      labelId='status-filter-label'
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      label='Status'
                    >
                      <MenuItem value=''>All Statuses</MenuItem>
                      <MenuItem value='PENDING'>Pending</MenuItem>
                      <MenuItem value='COMPLETED'>Completed</MenuItem>
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
                
                <Button 
                  variant='contained' 
                  color='primary'
                  onClick={handleNewActionDialogOpen}
                  startIcon={<i className='ri-add-line'></i>}
                >
                  New Action
                </Button>
              </Box>
              
              {/* Actions Table */}
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                  <Table stickyHeader aria-label='reconciliation actions table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Reconciliation ID</TableCell>
                        <TableCell>Asset</TableCell>
                        <TableCell>Discrepancy Type</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Previous Value</TableCell>
                        <TableCell>New Value</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredActions.length > 0 ? (
                        filteredActions.map((action) => (
                          <TableRow hover key={action.id}>
                            <TableCell>{action.reconciliationId}</TableCell>
                            <TableCell>
                              <Typography variant='body2'>{action.assetName}</Typography>
                              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                {action.assetCode}
                              </Typography>
                            </TableCell>
                            <TableCell>{action.discrepancyType}</TableCell>
                            <TableCell>{action.action}</TableCell>
                            <TableCell>{action.previousValue}</TableCell>
                            <TableCell>{action.newValue}</TableCell>
                            <TableCell>
                              <Chip 
                                label={action.status} 
                                color={action.status === 'COMPLETED' ? 'success' : 'warning'} 
                                size='small' 
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                {action.status === 'PENDING' && (
                                  <IconButton 
                                    color='primary' 
                                    size='small'
                                    onClick={() => handleActionDialogOpen(action)}
                                    title='Complete Action'
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
                            <Typography variant='body1'>No actions found</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </TabPanel>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Complete Action Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Complete Reconciliation Action</DialogTitle>
        <DialogContent>
          {selectedAction && (
            <Box sx={{ mt: 2 }}>
              <Typography variant='subtitle1'>{selectedAction.assetName}</Typography>
              <Typography variant='body2'>Asset Code: {selectedAction.assetCode}</Typography>
              <Typography variant='body2'>Action: {selectedAction.action}</Typography>
              <Typography variant='body2'>
                Change: {selectedAction.previousValue} → {selectedAction.newValue}
              </Typography>
            </Box>
          )}
          <TextField
            autoFocus
            margin='dense'
            id='action-notes'
            label='Notes'
            type='text'
            fullWidth
            multiline
            rows={3}
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleCompleteAction} color='primary' variant='contained'>
            Complete Action
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* New Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={handleNewActionDialogClose}>
        <DialogTitle>Create New Reconciliation Action</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id='reconciliation-select-label'>Reconciliation</InputLabel>
            <Select
              labelId='reconciliation-select-label'
              value={selectedReconciliation || ''}
              onChange={handleReconciliationChange}
              label='Reconciliation'
            >
              {reconciliationData
                .filter(record => record.status === 'IN_PROGRESS')
                .map(record => (
                  <MenuItem key={record.id} value={record.reconciliationId}>{record.reconciliationId}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          
          <TextField
            margin='dense'
            id='asset-code'
            label='Asset Code'
            type='text'
            fullWidth
            sx={{ mt: 2 }}
          />
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id='action-type-label'>Action Type</InputLabel>
            <Select
              labelId='action-type-label'
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
              label='Action Type'
            >
              <MenuItem value='UPDATE_LOCATION'>Update Location</MenuItem>
              <MenuItem value='UPDATE_STATUS'>Update Status</MenuItem>
              <MenuItem value='UPDATE_ASSIGNMENT'>Update Assignment</MenuItem>
              <MenuItem value='MARK_MISSING'>Mark as Missing</MenuItem>
              <MenuItem value='MARK_FOUND'>Mark as Found</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin='dense'
            id='action-value'
            label='New Value'
            type='text'
            fullWidth
            value={actionValue}
            onChange={(e) => setActionValue(e.target.value)}
            sx={{ mt: 2 }}
          />
          
          <TextField
            margin='dense'
            id='action-notes'
            label='Notes'
            type='text'
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewActionDialogClose} color='secondary'>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateNewAction} 
            color='primary' 
            variant='contained'
            disabled={!selectedReconciliation || !selectedActionType || !actionValue}
          >
            Create Action
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

export default ReconciliationPage
