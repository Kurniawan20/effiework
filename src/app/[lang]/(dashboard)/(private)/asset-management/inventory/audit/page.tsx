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
import type { SelectChangeEvent } from '@mui/material'

// Dummy Data
const dummyAuditData = [
  {
    id: 1,
    auditId: 'AUD-2025-001',
    startDate: '2025-01-10',
    endDate: '2025-01-20',
    status: 'COMPLETED',
    auditor: 'John Smith',
    totalAssets: 120,
    matchedAssets: 118,
    discrepancies: 2,
    notes: 'Annual audit completed with minor discrepancies'
  },
  {
    id: 2,
    auditId: 'AUD-2025-002',
    startDate: '2025-02-15',
    endDate: '2025-02-25',
    status: 'COMPLETED',
    auditor: 'Sarah Johnson',
    totalAssets: 85,
    matchedAssets: 85,
    discrepancies: 0,
    notes: 'IT Department audit completed with no discrepancies'
  },
  {
    id: 3,
    auditId: 'AUD-2025-003',
    startDate: '2025-03-01',
    endDate: null,
    status: 'IN_PROGRESS',
    auditor: 'Michael Brown',
    totalAssets: 150,
    matchedAssets: 95,
    discrepancies: 3,
    notes: 'Quarterly audit in progress'
  }
]

// Dummy Discrepancy Data
const dummyDiscrepancyData = [
  {
    id: 1,
    auditId: 'AUD-2025-001',
    assetCode: 'AST-045',
    assetName: 'Dell Monitor P2419H',
    expectedLocation: 'Main Office',
    actualLocation: 'Not Found',
    expectedStatus: 'AVAILABLE',
    actualStatus: 'MISSING',
    resolutionStatus: 'RESOLVED',
    resolutionNotes: 'Asset found in storage room, inventory updated'
  },
  {
    id: 2,
    auditId: 'AUD-2025-001',
    assetCode: 'AST-078',
    assetName: 'Logitech Wireless Keyboard',
    expectedLocation: 'Main Office',
    actualLocation: 'Design Department',
    expectedStatus: 'ASSIGNED',
    actualStatus: 'ASSIGNED',
    resolutionStatus: 'RESOLVED',
    resolutionNotes: 'Asset reassigned to Design Department'
  },
  {
    id: 3,
    auditId: 'AUD-2025-003',
    assetCode: 'AST-112',
    assetName: 'HP LaserJet Printer',
    expectedLocation: 'Admin Department',
    actualLocation: 'Not Found',
    expectedStatus: 'AVAILABLE',
    actualStatus: 'MISSING',
    resolutionStatus: 'PENDING',
    resolutionNotes: 'Investigation ongoing'
  },
  {
    id: 4,
    auditId: 'AUD-2025-003',
    assetCode: 'AST-089',
    assetName: 'Cisco IP Phone',
    expectedLocation: 'Sales Department',
    actualLocation: 'IT Department',
    expectedStatus: 'ASSIGNED',
    actualStatus: 'MAINTENANCE',
    resolutionStatus: 'PENDING',
    resolutionNotes: 'Phone sent for repair, inventory not updated'
  },
  {
    id: 5,
    auditId: 'AUD-2025-003',
    assetCode: 'AST-156',
    assetName: 'Projector Screen',
    expectedLocation: 'Conference Room',
    actualLocation: 'Storage Room',
    expectedStatus: 'AVAILABLE',
    actualStatus: 'AVAILABLE',
    resolutionStatus: 'PENDING',
    resolutionNotes: 'Moved temporarily for room renovation'
  }
]

const AuditPage = () => {
  // State
  const [auditData, setAuditData] = useState<typeof dummyAuditData>([])
  const [discrepancyData, setDiscrepancyData] = useState<typeof dummyDiscrepancyData>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [selectedAudit, setSelectedAudit] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<(typeof dummyDiscrepancyData)[0] | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState<string>('')
  const [viewMode, setViewMode] = useState<'audits' | 'discrepancies'>('audits')

  // Load data on component mount
  useEffect(() => {
    loadAuditData()
  }, [])

  // Load audit data (simulated)
  const loadAuditData = () => {
    setLoading(true)
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      setAuditData([...dummyAuditData])
      setDiscrepancyData([...dummyDiscrepancyData])
      setTotalElements(dummyAuditData.length)
      setLoading(false)
    }, 1000)
  }

  // Filter discrepancies based on selected audit
  const filteredDiscrepancies = discrepancyData.filter(item => {
    if (!selectedAudit) return true
    return item.auditId === selectedAudit
  }).filter(item => {
    if (!selectedStatus) return true
    return item.resolutionStatus === selectedStatus
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

  // Handle audit filter change
  const handleAuditChange = (event: SelectChangeEvent) => {
    setSelectedAudit(event.target.value)
    setPage(0)
  }

  // Handle status filter change
  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value)
    setPage(0)
  }

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedAudit('')
    setSelectedStatus('')
    setPage(0)
  }

  // Handle view discrepancies
  const handleViewDiscrepancies = (auditId: string) => {
    setSelectedAudit(auditId)
    setViewMode('discrepancies')
  }

  // Handle back to audits
  const handleBackToAudits = () => {
    setViewMode('audits')
    setSelectedAudit('')
    setSelectedStatus('')
  }

  // Handle resolve discrepancy dialog open
  const handleResolveDialogOpen = (discrepancy: (typeof dummyDiscrepancyData)[0]) => {
    setSelectedDiscrepancy(discrepancy)
    setResolutionNotes(discrepancy.resolutionNotes || '')
    setDialogOpen(true)
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedDiscrepancy(null)
    setResolutionNotes('')
  }

  // Handle resolve discrepancy
  const handleResolveDiscrepancy = () => {
    if (!selectedDiscrepancy) return
    
    // Update the discrepancy in the dummy data
    const updatedData = discrepancyData.map(item => {
      if (item.id === selectedDiscrepancy.id) {
        return {
          ...item,
          resolutionStatus: 'RESOLVED',
          resolutionNotes: resolutionNotes
        }
      }
      return item
    })
    
    setDiscrepancyData(updatedData)
    setSuccess(`Discrepancy for asset ${selectedDiscrepancy.assetCode} has been resolved`)
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

  // Start new audit
  const handleStartNewAudit = () => {
    const newAuditId = `AUD-2025-${String(auditData.length + 1).padStart(3, '0')}`
    const today = new Date().toISOString().split('T')[0]
    
    const newAudit = {
      id: auditData.length + 1,
      auditId: newAuditId,
      startDate: today,
      endDate: null,
      status: 'IN_PROGRESS',
      auditor: 'Current User', // In a real app, this would be the logged-in user
      totalAssets: 0,
      matchedAssets: 0,
      discrepancies: 0,
      notes: 'New audit initiated'
    }
    
    setAuditData([newAudit, ...auditData])
    setSuccess(`New audit ${newAuditId} has been initiated`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title={viewMode === 'audits' ? 'Asset Audits' : 'Audit Discrepancies'} 
            action={
              viewMode === 'audits' ? (
                <Button 
                  variant='contained' 
                  color='primary'
                  onClick={handleStartNewAudit}
                  startIcon={<i className='ri-add-line'></i>}
                >
                  Start New Audit
                </Button>
              ) : (
                <Button 
                  variant='outlined' 
                  color='secondary'
                  onClick={handleBackToAudits}
                  startIcon={<i className='ri-arrow-left-line'></i>}
                >
                  Back to Audits
                </Button>
              )
            }
          />
          <CardContent>
            {viewMode === 'audits' ? (
              // Audits View
              <>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer>
                      <Table stickyHeader aria-label='audits table'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Audit ID</TableCell>
                            <TableCell>Date Range</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Auditor</TableCell>
                            <TableCell>Assets</TableCell>
                            <TableCell>Discrepancies</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {auditData.length > 0 ? (
                            auditData.map((audit) => (
                              <TableRow hover key={audit.id}>
                                <TableCell>{audit.auditId}</TableCell>
                                <TableCell>
                                  {audit.startDate} {audit.endDate ? `to ${audit.endDate}` : '(In Progress)'}
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={audit.status === 'COMPLETED' ? 'Completed' : 'In Progress'} 
                                    color={audit.status === 'COMPLETED' ? 'success' : 'warning'} 
                                    size='small' 
                                  />
                                </TableCell>
                                <TableCell>{audit.auditor}</TableCell>
                                <TableCell>
                                  <Typography variant='body2'>
                                    {audit.matchedAssets} / {audit.totalAssets} matched
                                  </Typography>
                                  <LinearProgressWithLabel 
                                    value={audit.totalAssets > 0 ? (audit.matchedAssets / audit.totalAssets) * 100 : 0} 
                                  />
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={audit.discrepancies} 
                                    color={audit.discrepancies > 0 ? 'error' : 'success'} 
                                    size='small' 
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton 
                                      color='primary' 
                                      size='small'
                                      onClick={() => handleViewDiscrepancies(audit.auditId)}
                                      title='View Discrepancies'
                                    >
                                      <i className='ri-error-warning-line'></i>
                                    </IconButton>
                                    <IconButton 
                                      color='info' 
                                      size='small'
                                      title='View Details'
                                    >
                                      <i className='ri-eye-line'></i>
                                    </IconButton>
                                    {audit.status === 'IN_PROGRESS' && (
                                      <IconButton 
                                        color='success' 
                                        size='small'
                                        title='Complete Audit'
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
                                <Typography variant='body1'>No audits found</Typography>
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
              </>
            ) : (
              // Discrepancies View
              <>
                {/* Filters */}
                <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  <FormControl sx={{ minWidth: '200px' }} size='small'>
                    <InputLabel id='audit-filter-label'>Audit</InputLabel>
                    <Select
                      labelId='audit-filter-label'
                      value={selectedAudit}
                      onChange={handleAuditChange}
                      label='Audit'
                    >
                      <MenuItem value=''>All Audits</MenuItem>
                      {auditData.map(audit => (
                        <MenuItem key={audit.id} value={audit.auditId}>{audit.auditId}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl sx={{ minWidth: '200px' }} size='small'>
                    <InputLabel id='status-filter-label'>Resolution Status</InputLabel>
                    <Select
                      labelId='status-filter-label'
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      label='Resolution Status'
                    >
                      <MenuItem value=''>All Statuses</MenuItem>
                      <MenuItem value='PENDING'>Pending</MenuItem>
                      <MenuItem value='RESOLVED'>Resolved</MenuItem>
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
                
                {/* Discrepancies Table */}
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer>
                    <Table stickyHeader aria-label='discrepancies table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Audit ID</TableCell>
                          <TableCell>Asset</TableCell>
                          <TableCell>Expected Location</TableCell>
                          <TableCell>Actual Location</TableCell>
                          <TableCell>Expected Status</TableCell>
                          <TableCell>Actual Status</TableCell>
                          <TableCell>Resolution</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredDiscrepancies.length > 0 ? (
                          filteredDiscrepancies.map((discrepancy) => (
                            <TableRow hover key={discrepancy.id}>
                              <TableCell>{discrepancy.auditId}</TableCell>
                              <TableCell>
                                <Typography variant='body2'>{discrepancy.assetName}</Typography>
                                <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                  {discrepancy.assetCode}
                                </Typography>
                              </TableCell>
                              <TableCell>{discrepancy.expectedLocation}</TableCell>
                              <TableCell>{discrepancy.actualLocation}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={discrepancy.expectedStatus} 
                                  color={
                                    discrepancy.expectedStatus === 'AVAILABLE' ? 'success' : 
                                    discrepancy.expectedStatus === 'ASSIGNED' ? 'info' : 
                                    discrepancy.expectedStatus === 'MAINTENANCE' ? 'warning' : 'error'
                                  } 
                                  size='small' 
                                />
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={discrepancy.actualStatus} 
                                  color={
                                    discrepancy.actualStatus === 'AVAILABLE' ? 'success' : 
                                    discrepancy.actualStatus === 'ASSIGNED' ? 'info' : 
                                    discrepancy.actualStatus === 'MAINTENANCE' ? 'warning' : 
                                    discrepancy.actualStatus === 'MISSING' ? 'error' : 'default'
                                  } 
                                  size='small' 
                                />
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={discrepancy.resolutionStatus} 
                                  color={discrepancy.resolutionStatus === 'RESOLVED' ? 'success' : 'warning'} 
                                  size='small' 
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  {discrepancy.resolutionStatus === 'PENDING' && (
                                    <IconButton 
                                      color='primary' 
                                      size='small'
                                      onClick={() => handleResolveDialogOpen(discrepancy)}
                                      title='Resolve Discrepancy'
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
                              <Typography variant='body1'>No discrepancies found</Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      {/* Resolve Discrepancy Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Resolve Discrepancy</DialogTitle>
        <DialogContent>
          {selectedDiscrepancy && (
            <Box sx={{ mt: 2 }}>
              <Typography variant='subtitle1'>{selectedDiscrepancy.assetName}</Typography>
              <Typography variant='body2'>Asset Code: {selectedDiscrepancy.assetCode}</Typography>
              <Typography variant='body2'>
                Location: {selectedDiscrepancy.expectedLocation} → {selectedDiscrepancy.actualLocation}
              </Typography>
              <Typography variant='body2'>
                Status: {selectedDiscrepancy.expectedStatus} → {selectedDiscrepancy.actualStatus}
              </Typography>
            </Box>
          )}
          <TextField
            autoFocus
            margin='dense'
            id='resolution-notes'
            label='Resolution Notes'
            type='text'
            fullWidth
            multiline
            rows={3}
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleResolveDiscrepancy} color='primary' variant='contained'>
            Resolve Discrepancy
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

// Linear progress with label component
const LinearProgressWithLabel = (props: { value: number }) => {
  return (
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
            width: `${props.value}%`,
            borderRadius: 2,
            backgroundColor: props.value < 70 ? '#ff9800' : '#4caf50',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' color='text.secondary'>{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
}

export default AuditPage
