'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Divider from '@mui/material/Divider'

// Custom Components
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Table Imports
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef
} from '@tanstack/react-table'

// Styles Import
import tableStyles from '@core/styles/table.module.css'

// Types
interface TransferRequest {
  id: string
  assetName: string
  assetCode: string
  currentLocation: string
  requestedLocation: string
  requestedBy: string
  requestDate: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed'
  priority: 'High' | 'Medium' | 'Low' | 'Normal'
  reason: string
  approvalSteps: ApprovalStep[]
}

interface ApprovalStep {
  step: string
  status: 'Pending' | 'Approved' | 'Rejected'
  approver: string
  date: string | null
  comments: string
}

// Dummy data for transfer requests
const transferRequests: TransferRequest[] = [
  {
    id: 'TR001',
    assetName: 'Commercial Kitchen Range',
    assetCode: 'EQ-001',
    currentLocation: 'Main Kitchen',
    requestedLocation: 'Prep Kitchen',
    requestedBy: 'Chef Michael Brown',
    requestDate: '2024-02-20',
    status: 'Pending',
    priority: 'High',
    reason: 'Need additional cooking capacity in prep kitchen for event preparations',
    approvalSteps: [
      {
        step: 'Kitchen Manager Review',
        status: 'Approved',
        approver: 'Chef Michael Brown',
        date: '2024-02-20',
        comments: 'Equipment needed for upcoming events'
      },
      {
        step: 'Operations Manager Review',
        status: 'Pending',
        approver: 'Robert Martinez',
        date: null,
        comments: ''
      },
      {
        step: 'Maintenance Team Review',
        status: 'Pending',
        approver: 'Technical Team',
        date: null,
        comments: ''
      }
    ]
  },
  {
    id: 'TR002',
    assetName: 'Industrial Food Processor',
    assetCode: 'EQ-008',
    currentLocation: 'Prep Kitchen',
    requestedLocation: 'Main Kitchen',
    requestedBy: 'Sous Chef Sarah Lee',
    requestDate: '2024-02-22',
    status: 'Approved',
    priority: 'Medium',
    reason: 'Equipment needed for main kitchen food preparation',
    approvalSteps: [
      {
        step: 'Kitchen Manager Review',
        status: 'Approved',
        approver: 'Chef Michael Brown',
        date: '2024-02-22',
        comments: 'Approved for main kitchen operations'
      },
      {
        step: 'Operations Manager Review',
        status: 'Approved',
        approver: 'Robert Martinez',
        date: '2024-02-23',
        comments: 'Transfer approved, schedule with maintenance team'
      },
      {
        step: 'Maintenance Team Review',
        status: 'Approved',
        approver: 'Technical Team',
        date: '2024-02-23',
        comments: 'Equipment checked and ready for transfer'
      }
    ]
  },
  {
    id: 'TR003',
    assetName: 'Bar Equipment Set',
    assetCode: 'EQ-005',
    currentLocation: 'Storage Room',
    requestedLocation: 'Bar Area',
    requestedBy: 'James Wilson',
    requestDate: '2024-02-23',
    status: 'Completed',
    priority: 'Normal',
    reason: 'Setting up new bar station for weekend service',
    approvalSteps: [
      {
        step: 'Bar Manager Review',
        status: 'Approved',
        approver: 'James Wilson',
        date: '2024-02-23',
        comments: 'Required for new bar setup'
      },
      {
        step: 'Operations Manager Review',
        status: 'Approved',
        approver: 'Robert Martinez',
        date: '2024-02-23',
        comments: 'Approved for bar expansion'
      },
      {
        step: 'Maintenance Team Review',
        status: 'Approved',
        approver: 'Technical Team',
        date: '2024-02-24',
        comments: 'Equipment tested and installed'
      }
    ]
  },
  {
    id: 'TR004',
    assetName: 'Dining Room Set',
    assetCode: 'EQ-004',
    currentLocation: 'Storage Room',
    requestedLocation: 'Dining Area',
    requestedBy: 'Emily Davis',
    requestDate: '2024-02-24',
    status: 'Pending',
    priority: 'High',
    reason: 'Expanding dining area capacity for upcoming events',
    approvalSteps: [
      {
        step: 'Front of House Manager Review',
        status: 'Approved',
        approver: 'Emily Davis',
        date: '2024-02-24',
        comments: 'Required for dining area expansion'
      },
      {
        step: 'Operations Manager Review',
        status: 'Pending',
        approver: 'Robert Martinez',
        date: null,
        comments: ''
      },
      {
        step: 'Maintenance Team Review',
        status: 'Pending',
        approver: 'Technical Team',
        date: null,
        comments: ''
      }
    ]
  }
]

const TransferRequests = () => {
  // States
  const [filtering, setFiltering] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<TransferRequest | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [newRequestOpen, setNewRequestOpen] = useState(false)
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)

  // New Request Form States
  const [newRequest, setNewRequest] = useState({
    assetName: '',
    assetCode: '',
    currentLocation: '',
    requestedLocation: '',
    requestedBy: '',
    requestDate: '',
    priority: '',
    reason: ''
  })

  // Column Definitions
  const columns: ColumnDef<TransferRequest>[] = [
    {
      header: 'Asset Name',
      accessorKey: 'assetName'
    },
    {
      header: 'Asset Code',
      accessorKey: 'assetCode'
    },
    {
      header: 'Current Location',
      accessorKey: 'currentLocation'
    },
    {
      header: 'Requested Location',
      accessorKey: 'requestedLocation'
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Chip
          label={row.original.status}
          color={
            row.original.status === 'Approved'
              ? 'success'
              : row.original.status === 'Rejected'
              ? 'error'
              : row.original.status === 'Completed'
              ? 'info'
              : 'warning'
          }
          size="small"
        />
      )
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: ({ row }) => (
        <Chip
          label={row.original.priority}
          color={
            row.original.priority === 'High'
              ? 'error'
              : row.original.priority === 'Medium'
              ? 'warning'
              : row.original.priority === 'Normal'
              ? 'info'
              : 'success'
          }
          size="small"
        />
      )
    },
    {
      header: 'Request Date',
      accessorKey: 'requestDate'
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <IconButton
          onClick={(e) => {
            setActionMenuAnchor(e.currentTarget)
            setSelectedRequestId(row.original.id)
          }}
        >
          <i className="ri-more-2-fill" />
        </IconButton>
      )
    }
  ]

  // Table Instance
  const table = useReactTable({
    data: transferRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: filtering
    },
    onGlobalFilterChange: setFiltering
  })

  // Handlers
  const handleViewDetails = () => {
    const request = transferRequests.find(r => r.id === selectedRequestId)
    if (request) {
      setSelectedRequest(request)
      setDetailsOpen(true)
    }
    setActionMenuAnchor(null)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
    setSelectedRequest(null)
  }

  const handleApproveRequest = (id: string) => {
    // TO DO: Implement approval logic
  }

  const handleRejectRequest = (id: string) => {
    // TO DO: Implement rejection logic
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Transfer Requests'
            action={
              <Button
                variant='contained'
                onClick={() => setNewRequestOpen(true)}
                startIcon={<i className="ri-add-line" />}
              >
                New Transfer
              </Button>
            }
          />
          <CardContent>
            {/* Search Bar */}
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
                placeholder='Search Transfer Requests...'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-search-line' />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* Table */}
            <TableContainer>
              <Table className={tableStyles.table}>
                <TableHead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <TableCell key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={table.getFilteredRowModel().rows.length}
              rowsPerPage={table.getState().pagination.pageSize}
              page={table.getState().pagination.pageIndex}
              onPageChange={(_, page) => table.setPageIndex(page)}
              onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={() => setActionMenuAnchor(null)}
      >
        <MenuItem onClick={handleViewDetails}>
          <i className="ri-eye-line me-2" /> View Details
        </MenuItem>
        <MenuItem onClick={() => setActionMenuAnchor(null)}>
          <i className="ri-check-line me-2" /> Approve Request
        </MenuItem>
        <MenuItem onClick={() => setActionMenuAnchor(null)}>
          <i className="ri-close-line me-2" /> Reject Request
        </MenuItem>
      </Menu>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Transfer Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={4}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Request Information</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Asset Name"
                      value={selectedRequest.assetName}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Asset Code"
                      value={selectedRequest.assetCode}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Current Location"
                      value={selectedRequest.currentLocation}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Requested Location"
                      value={selectedRequest.requestedLocation}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Requested By"
                      value={selectedRequest.requestedBy}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Request Date"
                      value={selectedRequest.requestDate}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Status"
                      value={selectedRequest.status}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Priority"
                      value={selectedRequest.priority}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Reason */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Reason for Transfer</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Reason"
                  value={selectedRequest.reason}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Approval Steps */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Approval Workflow</Typography>
                <Stepper orientation="vertical">
                  {selectedRequest.approvalSteps.map((step, index) => (
                    <Step key={index} active={true} completed={step.status === 'Approved'}>
                      <StepLabel>
                        <Typography variant="subtitle2">{step.step}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {step.approver} - {step.status}
                          {step.date && ` (${step.date})`}
                        </Typography>
                        {step.comments && (
                          <Typography variant="body2" color="textSecondary">
                            Comments: {step.comments}
                          </Typography>
                        )}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
          {selectedRequest?.status === 'Pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleApproveRequest(selectedRequest.id)}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleRejectRequest(selectedRequest.id)}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* New Transfer Request Dialog */}
      <Dialog
        open={newRequestOpen}
        onClose={() => setNewRequestOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Transfer Request</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Asset Information */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Asset Name</InputLabel>
                <Select
                  label="Asset Name"
                  value={newRequest.assetName}
                  onChange={(e) => setNewRequest({ ...newRequest, assetName: e.target.value })}
                >
                  <MenuItem value="Commercial Kitchen Range">Commercial Kitchen Range</MenuItem>
                  <MenuItem value="Industrial Food Processor">Industrial Food Processor</MenuItem>
                  <MenuItem value="Bar Equipment Set">Bar Equipment Set</MenuItem>
                  <MenuItem value="Dining Room Set">Dining Room Set</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Asset Code */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Asset Code</InputLabel>
                <Select
                  label="Asset Code"
                  value={newRequest.assetCode}
                  onChange={(e) => setNewRequest({ ...newRequest, assetCode: e.target.value })}
                >
                  <MenuItem value="EQ-001">EQ-001</MenuItem>
                  <MenuItem value="EQ-008">EQ-008</MenuItem>
                  <MenuItem value="EQ-005">EQ-005</MenuItem>
                  <MenuItem value="EQ-004">EQ-004</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Current Location */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Current Location</InputLabel>
                <Select
                  label="Current Location"
                  value={newRequest.currentLocation}
                  onChange={(e) => setNewRequest({ ...newRequest, currentLocation: e.target.value })}
                >
                  <MenuItem value="Main Kitchen">Main Kitchen</MenuItem>
                  <MenuItem value="Prep Kitchen">Prep Kitchen</MenuItem>
                  <MenuItem value="Storage Room">Storage Room</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Requested Location */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Requested Location</InputLabel>
                <Select
                  label="Requested Location"
                  value={newRequest.requestedLocation}
                  onChange={(e) => setNewRequest({ ...newRequest, requestedLocation: e.target.value })}
                >
                  <MenuItem value="Main Kitchen">Main Kitchen</MenuItem>
                  <MenuItem value="Prep Kitchen">Prep Kitchen</MenuItem>
                  <MenuItem value="Bar Area">Bar Area</MenuItem>
                  <MenuItem value="Dining Area">Dining Area</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Requested By */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Requested By</InputLabel>
                <Select
                  label="Requested By"
                  value={newRequest.requestedBy}
                  onChange={(e) => setNewRequest({ ...newRequest, requestedBy: e.target.value })}
                >
                  <MenuItem value="Chef Michael Brown">Chef Michael Brown</MenuItem>
                  <MenuItem value="Sous Chef Sarah Lee">Sous Chef Sarah Lee</MenuItem>
                  <MenuItem value="James Wilson">James Wilson</MenuItem>
                  <MenuItem value="Emily Davis">Emily Davis</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Request Date */}
            <Grid item xs={12} sm={6}>
              <AppReactDatepicker
                selected={newRequest.requestDate}
                onChange={(date) => setNewRequest({ ...newRequest, requestDate: date })}
                customInput={
                  <TextField
                    fullWidth
                    label="Request Date"
                  />
                }
              />
            </Grid>

            {/* Priority */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  label="Priority"
                  value={newRequest.priority}
                  onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Reason */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Reason for Transfer"
                placeholder="Provide a detailed reason for the transfer request..."
                value={newRequest.reason}
                onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewRequestOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => setNewRequestOpen(false)}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default TransferRequests
