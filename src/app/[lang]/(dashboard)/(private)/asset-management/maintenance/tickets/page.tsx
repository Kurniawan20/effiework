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
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'

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
interface RepairTicket {
  id: string
  ticketNumber: string
  assetId: string
  assetName: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed'
  issueType: string
  description: string
  reportedBy: string
  assignedTo: string | null
  createdDate: string
  updatedDate: string
  timeline: TicketTimeline[]
}

interface TicketTimeline {
  date: string
  status: string
  description: string
  updatedBy: string
}

// Dummy Data
const ticketData: RepairTicket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-2025-001',
    assetId: 'AST001',
    assetName: 'Laptop Dell XPS 15',
    priority: 'High',
    status: 'In Progress',
    issueType: 'Hardware',
    description: 'Laptop not charging when plugged in. Battery drains quickly.',
    reportedBy: 'Jane Cooper',
    assignedTo: 'John Smith',
    createdDate: '2025-02-24',
    updatedDate: '2025-02-25',
    timeline: [
      {
        date: '2025-02-24 09:00',
        status: 'Open',
        description: 'Ticket created',
        updatedBy: 'Jane Cooper'
      },
      {
        date: '2025-02-24 10:30',
        status: 'Assigned',
        description: 'Assigned to John Smith',
        updatedBy: 'Mike Wilson'
      },
      {
        date: '2025-02-25 11:00',
        status: 'In Progress',
        description: 'Initial diagnosis: Faulty power adapter or charging port',
        updatedBy: 'John Smith'
      }
    ]
  },
  {
    id: '2',
    ticketNumber: 'TKT-2025-002',
    assetId: 'AST002',
    assetName: 'HP LaserJet Printer',
    priority: 'Medium',
    status: 'Open',
    issueType: 'Hardware',
    description: 'Paper jam error persists after clearing all visible paper.',
    reportedBy: 'Robert Fox',
    assignedTo: null,
    createdDate: '2025-02-25',
    updatedDate: '2025-02-25',
    timeline: [
      {
        date: '2025-02-25 14:00',
        status: 'Open',
        description: 'Ticket created',
        updatedBy: 'Robert Fox'
      }
    ]
  },
  {
    id: '3',
    ticketNumber: 'TKT-2025-003',
    assetId: 'AST003',
    assetName: 'Industrial AC Unit',
    priority: 'Low',
    status: 'Resolved',
    issueType: 'Maintenance',
    description: 'Regular maintenance check and filter replacement needed',
    reportedBy: 'Sarah Johnson',
    assignedTo: 'Mike Brown',
    createdDate: '2025-02-23',
    updatedDate: '2025-02-24',
    timeline: [
      {
        date: '2025-02-23 11:00',
        status: 'Open',
        description: 'Ticket created',
        updatedBy: 'Sarah Johnson'
      },
      {
        date: '2025-02-23 13:30',
        status: 'Assigned',
        description: 'Assigned to Mike Brown',
        updatedBy: 'Mike Wilson'
      },
      {
        date: '2025-02-24 15:00',
        status: 'Resolved',
        description: 'Maintenance completed: Filters replaced, system cleaned',
        updatedBy: 'Mike Brown'
      }
    ]
  }
]

const RepairTickets = () => {
  // States
  const [filtering, setFiltering] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [newTicketOpen, setNewTicketOpen] = useState(false)
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  // Column Definitions
  const columns: ColumnDef<RepairTicket>[] = [
    {
      header: 'Ticket #',
      accessorKey: 'ticketNumber'
    },
    {
      header: 'Asset',
      accessorKey: 'assetName'
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
              : 'info'
          }
          size="small"
        />
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Chip
          label={row.original.status}
          color={
            row.original.status === 'Open'
              ? 'info'
              : row.original.status === 'In Progress'
              ? 'warning'
              : row.original.status === 'Resolved'
              ? 'success'
              : 'default'
          }
          size="small"
        />
      )
    },
    {
      header: 'Issue Type',
      accessorKey: 'issueType'
    },
    {
      header: 'Reported By',
      accessorKey: 'reportedBy'
    },
    {
      header: 'Created Date',
      accessorKey: 'createdDate'
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <IconButton
          onClick={(e) => {
            setActionMenuAnchor(e.currentTarget)
            setSelectedTicketId(row.original.id)
          }}
        >
          <i className="ri-more-2-fill" />
        </IconButton>
      )
    }
  ]

  // Table Instance
  const table = useReactTable({
    data: ticketData,
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
    const ticket = ticketData.find(t => t.id === selectedTicketId)
    if (ticket) {
      setSelectedTicket(ticket)
      setDetailsOpen(true)
    }
    setActionMenuAnchor(null)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
    setSelectedTicket(null)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Repair Tickets'
            action={
              <Button
                variant='contained'
                onClick={() => setNewTicketOpen(true)}
                startIcon={<i className="ri-add-line" />}
              >
                New Ticket
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
                placeholder='Search Tickets...'
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
          <i className="ri-edit-line me-2" /> Update Status
        </MenuItem>
        <MenuItem onClick={() => setActionMenuAnchor(null)}>
          <i className="ri-user-line me-2" /> Assign Technician
        </MenuItem>
      </Menu>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Repair Ticket Details</DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ticket Number"
                  value={selectedTicket.ticketNumber}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Asset Name"
                  value={selectedTicket.assetName}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Priority"
                  value={selectedTicket.priority}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Status"
                  value={selectedTicket.status}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Issue Type"
                  value={selectedTicket.issueType}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reported By"
                  value={selectedTicket.reportedBy}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={selectedTicket.description}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Timeline */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Ticket Timeline</Typography>
                <Timeline>
                  {selectedTicket.timeline.map((item, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary">
                        {item.date}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={
                          item.status === 'Open' ? 'info' :
                          item.status === 'Assigned' ? 'warning' :
                          item.status === 'In Progress' ? 'primary' :
                          item.status === 'Resolved' ? 'success' : 'grey'
                        } />
                        {index < selectedTicket.timeline.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="subtitle2">{item.status}</Typography>
                        <Typography variant="body2">{item.description}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Updated by {item.updatedBy}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseDetails}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Ticket Dialog */}
      <Dialog
        open={newTicketOpen}
        onClose={() => setNewTicketOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Repair Ticket</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Asset</InputLabel>
                <Select label="Asset">
                  <MenuItem value="AST001">Laptop Dell XPS 15</MenuItem>
                  <MenuItem value="AST002">HP LaserJet Printer</MenuItem>
                  <MenuItem value="AST003">Industrial AC Unit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select label="Priority">
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Issue Type</InputLabel>
                <Select label="Issue Type">
                  <MenuItem value="Hardware">Hardware</MenuItem>
                  <MenuItem value="Software">Software</MenuItem>
                  <MenuItem value="Network">Network</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                placeholder="Describe the issue in detail..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTicketOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => setNewTicketOpen(false)}
          >
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default RepairTickets
