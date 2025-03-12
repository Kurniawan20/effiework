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
import Divider from '@mui/material/Divider'

// MUI Lab Imports
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'

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
interface AssetAssignment {
  id: string
  assetName: string
  assetCode: string
  assignedTo: string
  department: string
  location: string
  assignmentDate: string
  status: string
  responsibility: string
}

// Dummy data for asset assignments
const assetAssignments: AssetAssignment[] = [
  {
    id: 'AS001',
    assetName: 'Commercial Kitchen Range',
    assetCode: 'EQ-001',
    assignedTo: 'Chef Michael Brown',
    department: 'Kitchen Operations',
    location: 'Main Kitchen',
    assignmentDate: '2024-01-15',
    status: 'Active',
    responsibility: 'Primary equipment operator and maintenance oversight'
  },
  {
    id: 'AS002',
    assetName: 'Bar Equipment Set',
    assetCode: 'EQ-005',
    assignedTo: 'James Wilson',
    department: 'Bar Operations',
    location: 'Bar Area',
    assignmentDate: '2024-02-10',
    status: 'Active',
    responsibility: 'Bar equipment management and maintenance'
  },
  {
    id: 'AS003',
    assetName: 'Pizza Oven',
    assetCode: 'EQ-003',
    assignedTo: 'Sous Chef Sarah Lee',
    department: 'Kitchen Operations',
    location: 'Main Kitchen',
    assignmentDate: '2024-02-01',
    status: 'Active',
    responsibility: 'Equipment operation and daily cleaning'
  },
  {
    id: 'AS004',
    assetName: 'Industrial Refrigerator',
    assetCode: 'EQ-002',
    assignedTo: 'Kitchen Team',
    department: 'Kitchen Operations',
    location: 'Main Kitchen',
    assignmentDate: '2024-01-20',
    status: 'Active',
    responsibility: 'Temperature monitoring and inventory management'
  },
  {
    id: 'AS005',
    assetName: 'Dining Room Set',
    assetCode: 'EQ-004',
    assignedTo: 'Emily Davis',
    department: 'Front of House',
    location: 'Dining Area',
    assignmentDate: '2024-01-25',
    status: 'Active',
    responsibility: 'Furniture arrangement and maintenance oversight'
  }
]

const AssetAssignments = () => {
  // States
  const [filtering, setFiltering] = useState('')
  const [selectedAssignment, setSelectedAssignment] = useState<AssetAssignment | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [newAssignmentOpen, setNewAssignmentOpen] = useState(false)
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null)

  // New Assignment Form States
  const [newAssignment, setNewAssignment] = useState({
    assetName: '',
    assetCode: '',
    assignedTo: '',
    department: '',
    location: '',
    assignmentDate: null as Date | null,
    status: '',
    responsibility: ''
  })

  // Column Definitions
  const columns: ColumnDef<AssetAssignment>[] = [
    {
      header: 'Asset Name',
      accessorKey: 'assetName'
    },
    {
      header: 'Asset Code',
      accessorKey: 'assetCode'
    },
    {
      header: 'Assigned To',
      accessorKey: 'assignedTo'
    },
    {
      header: 'Department',
      accessorKey: 'department'
    },
    {
      header: 'Location',
      accessorKey: 'location'
    },
    {
      header: 'Assignment Date',
      accessorKey: 'assignmentDate'
    },
    {
      header: 'Status',
      accessorKey: 'status'
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <IconButton
          onClick={(e) => {
            setActionMenuAnchor(e.currentTarget)
            setSelectedAssignmentId(row.original.id)
          }}
        >
          <i className="ri-more-2-fill" />
        </IconButton>
      )
    }
  ]

  // Table Instance
  const table = useReactTable({
    data: assetAssignments,
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
    const assignment = assetAssignments.find(a => a.id === selectedAssignmentId)
    if (assignment) {
      setSelectedAssignment(assignment)
      setDetailsOpen(true)
    }
    setActionMenuAnchor(null)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
    setSelectedAssignment(null)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Asset Assignments'
            action={
              <Button
                variant='contained'
                onClick={() => setNewAssignmentOpen(true)}
                startIcon={<i className="ri-add-line" />}
              >
                New Assignment
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
                placeholder='Search Assignments...'
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
          <i className="ri-arrow-go-back-line me-2" /> Return Asset
        </MenuItem>
        <MenuItem onClick={() => setActionMenuAnchor(null)}>
          <i className="ri-tools-line me-2" /> Mark for Maintenance
        </MenuItem>
      </Menu>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Assignment Details</DialogTitle>
        <DialogContent>
          {selectedAssignment && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Asset Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Asset Information</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Asset Name"
                      value={selectedAssignment.assetName}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Asset Code"
                      value={selectedAssignment.assetCode}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Assigned To"
                      value={selectedAssignment.assignedTo}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={selectedAssignment.department}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={selectedAssignment.location}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Assignment Date"
                      value={selectedAssignment.assignmentDate}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Status"
                      value={selectedAssignment.status}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Responsibility"
                      value={selectedAssignment.responsibility}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* New Assignment Dialog */}
      <Dialog
        open={newAssignmentOpen}
        onClose={() => setNewAssignmentOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Assignment</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Asset Information */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Asset Name"
                value={newAssignment.assetName}
                onChange={(e) => setNewAssignment({ ...newAssignment, assetName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Asset Code"
                value={newAssignment.assetCode}
                onChange={(e) => setNewAssignment({ ...newAssignment, assetCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  label="Assigned To"
                  value={newAssignment.assignedTo}
                  onChange={(e) => setNewAssignment({ ...newAssignment, assignedTo: e.target.value })}
                >
                  <MenuItem value="Chef Michael Brown">Chef Michael Brown</MenuItem>
                  <MenuItem value="James Wilson">James Wilson</MenuItem>
                  <MenuItem value="Sous Chef Sarah Lee">Sous Chef Sarah Lee</MenuItem>
                  <MenuItem value="Kitchen Team">Kitchen Team</MenuItem>
                  <MenuItem value="Emily Davis">Emily Davis</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  value={newAssignment.department}
                  onChange={(e) => setNewAssignment({ ...newAssignment, department: e.target.value })}
                >
                  <MenuItem value="Kitchen Operations">Kitchen Operations</MenuItem>
                  <MenuItem value="Bar Operations">Bar Operations</MenuItem>
                  <MenuItem value="Front of House">Front of House</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  label="Location"
                  value={newAssignment.location}
                  onChange={(e) => setNewAssignment({ ...newAssignment, location: e.target.value })}
                >
                  <MenuItem value="Main Kitchen">Main Kitchen</MenuItem>
                  <MenuItem value="Bar Area">Bar Area</MenuItem>
                  <MenuItem value="Dining Area">Dining Area</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppReactDatepicker
                selected={newAssignment.assignmentDate}
                onChange={(date) => setNewAssignment({ ...newAssignment, assignmentDate: date })}
                customInput={
                  <TextField
                    fullWidth
                    label="Assignment Date"
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={newAssignment.status}
                  onChange={(e) => setNewAssignment({ ...newAssignment, status: e.target.value })}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Responsibility"
                placeholder="Add any additional notes about this assignment..."
                value={newAssignment.responsibility}
                onChange={(e) => setNewAssignment({ ...newAssignment, responsibility: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewAssignmentOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => setNewAssignmentOpen(false)}
          >
            Create Assignment
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default AssetAssignments
