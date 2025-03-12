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
import Typography from '@mui/material/Typography'

// MUI Lab Imports
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
interface TransferHistory {
  id: string
  assetName: string
  assetCode: string
  fromLocation: string
  toLocation: string
  transferredBy: string
  transferDate: string
  status: 'Completed' | 'In Progress' | 'Cancelled'
  notes: string
  approvalFlow: ApprovalEvent[]
}

interface ApprovalEvent {
  date: string
  action: string
  user: string
  role: string
  notes: string
}

// Dummy data for transfer history
const transferHistoryData: TransferHistory[] = [
  {
    id: 'TH001',
    assetName: 'Pizza Oven',
    assetCode: 'EQ-003',
    fromLocation: 'Storage Room',
    toLocation: 'Main Kitchen',
    transferredBy: 'Robert Martinez',
    transferDate: '2024-02-15',
    status: 'Completed',
    notes: 'Installation completed and equipment tested',
    approvalFlow: [
      {
        date: '2024-02-14 09:00',
        action: 'Request Created',
        user: 'Chef Michael Brown',
        role: 'Kitchen Manager',
        notes: 'Requested pizza oven installation in main kitchen'
      },
      {
        date: '2024-02-14 11:30',
        action: 'Kitchen Review',
        user: 'Chef Michael Brown',
        role: 'Kitchen Manager',
        notes: 'Approved installation location and requirements'
      },
      {
        date: '2024-02-14 14:00',
        action: 'Operations Review',
        user: 'Robert Martinez',
        role: 'Operations Manager',
        notes: 'Approved transfer and scheduled installation'
      },
      {
        date: '2024-02-15 10:00',
        action: 'Installation Complete',
        user: 'Technical Team',
        role: 'Maintenance',
        notes: 'Equipment installed and tested successfully'
      }
    ]
  },
  {
    id: 'TH002',
    assetName: 'Industrial Dishwasher',
    assetCode: 'EQ-007',
    fromLocation: 'Prep Kitchen',
    toLocation: 'Main Kitchen',
    transferredBy: 'Robert Martinez',
    transferDate: '2024-02-18',
    status: 'Completed',
    notes: 'Transferred to main kitchen for better workflow efficiency',
    approvalFlow: [
      {
        date: '2024-02-17 08:00',
        action: 'Request Created',
        user: 'Sous Chef Sarah Lee',
        role: 'Kitchen Staff',
        notes: 'Requested dishwasher relocation for efficiency'
      },
      {
        date: '2024-02-17 10:00',
        action: 'Kitchen Review',
        user: 'Chef Michael Brown',
        role: 'Kitchen Manager',
        notes: 'Approved new location for improved workflow'
      },
      {
        date: '2024-02-17 13:00',
        action: 'Operations Review',
        user: 'Robert Martinez',
        role: 'Operations Manager',
        notes: 'Approved transfer plan'
      },
      {
        date: '2024-02-18 09:00',
        action: 'Transfer Complete',
        user: 'Technical Team',
        role: 'Maintenance',
        notes: 'Equipment relocated and tested'
      }
    ]
  },
  {
    id: 'TH003',
    assetName: 'Bar Equipment Set',
    assetCode: 'EQ-005',
    fromLocation: 'Storage Room',
    toLocation: 'Bar Area',
    transferredBy: 'James Wilson',
    transferDate: '2024-02-23',
    status: 'Completed',
    notes: 'Bar equipment setup completed and tested',
    approvalFlow: [
      {
        date: '2024-02-22 09:00',
        action: 'Request Created',
        user: 'James Wilson',
        role: 'Bar Manager',
        notes: 'Requested bar equipment setup'
      },
      {
        date: '2024-02-22 11:00',
        action: 'Bar Review',
        user: 'James Wilson',
        role: 'Bar Manager',
        notes: 'Confirmed equipment specifications and layout'
      },
      {
        date: '2024-02-22 14:00',
        action: 'Operations Review',
        user: 'Robert Martinez',
        role: 'Operations Manager',
        notes: 'Approved setup plan'
      },
      {
        date: '2024-02-23 10:00',
        action: 'Setup Complete',
        user: 'Technical Team',
        role: 'Maintenance',
        notes: 'Bar equipment installed and tested'
      }
    ]
  },
  {
    id: 'TH004',
    assetName: 'Industrial Refrigerator',
    assetCode: 'EQ-002',
    fromLocation: 'Prep Kitchen',
    toLocation: 'Main Kitchen',
    transferredBy: 'Chef Michael Brown',
    transferDate: '2024-02-24',
    status: 'In Progress',
    notes: 'Moving refrigerator to optimize kitchen layout',
    approvalFlow: [
      {
        date: '2024-02-23 15:00',
        action: 'Request Created',
        user: 'Chef Michael Brown',
        role: 'Kitchen Manager',
        notes: 'Requested refrigerator relocation'
      },
      {
        date: '2024-02-23 16:00',
        action: 'Kitchen Review',
        user: 'Chef Michael Brown',
        role: 'Kitchen Manager',
        notes: 'Approved new location and timing'
      },
      {
        date: '2024-02-24 09:00',
        action: 'Operations Review',
        user: 'Robert Martinez',
        role: 'Operations Manager',
        notes: 'Approved transfer plan'
      },
      {
        date: '2024-02-24 10:00',
        action: 'In Progress',
        user: 'Technical Team',
        role: 'Maintenance',
        notes: 'Transfer in progress'
      }
    ]
  }
]

const TransferHistory = () => {
  // States
  const [filtering, setFiltering] = useState('')
  const [selectedTransfer, setSelectedTransfer] = useState<TransferHistory | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null)

  // Column Definitions
  const columns: ColumnDef<TransferHistory>[] = [
    {
      header: 'Asset Name',
      accessorKey: 'assetName'
    },
    {
      header: 'Asset Code',
      accessorKey: 'assetCode'
    },
    {
      header: 'From',
      accessorKey: 'fromLocation'
    },
    {
      header: 'To',
      accessorKey: 'toLocation'
    },
    {
      header: 'Transferred By',
      accessorKey: 'transferredBy'
    },
    {
      header: 'Transfer Date',
      accessorKey: 'transferDate'
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Chip
          label={row.original.status}
          color={
            row.original.status === 'Completed'
              ? 'success'
              : row.original.status === 'In Progress'
              ? 'warning'
              : 'error'
          }
          size="small"
        />
      )
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <IconButton
          onClick={(e) => {
            setActionMenuAnchor(e.currentTarget)
            setSelectedTransferId(row.original.id)
          }}
        >
          <i className="ri-more-2-fill" />
        </IconButton>
      )
    }
  ]

  // Table Instance
  const table = useReactTable({
    data: transferHistoryData,
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
    const transfer = transferHistoryData.find(t => t.id === selectedTransferId)
    if (transfer) {
      setSelectedTransfer(transfer)
      setDetailsOpen(true)
    }
    setActionMenuAnchor(null)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
    setSelectedTransfer(null)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Transfer History' />
          <CardContent>
            {/* Search Bar */}
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
                placeholder='Search Transfer History...'
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
          <i className="ri-file-download-line me-2" /> Download Report
        </MenuItem>
      </Menu>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Transfer History Details</DialogTitle>
        <DialogContent>
          {selectedTransfer && (
            <Grid container spacing={4}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Transfer Information</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Asset Name"
                      value={selectedTransfer.assetName}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Asset Code"
                      value={selectedTransfer.assetCode}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="From Location"
                      value={selectedTransfer.fromLocation}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="To Location"
                      value={selectedTransfer.toLocation}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Transferred By"
                      value={selectedTransfer.transferredBy}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Transfer Date"
                      value={selectedTransfer.transferDate}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Notes"
                      value={selectedTransfer.notes}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Approval Flow Timeline */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Transfer Timeline</Typography>
                <Timeline>
                  {selectedTransfer.approvalFlow.map((event, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary">
                        {event.date}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={
                          event.action === 'Request Created' ? 'info' :
                          event.action.includes('Review') ? 'warning' :
                          event.action.includes('Complete') ? 'success' :
                          event.action === 'In Progress' ? 'primary' :
                          'grey'
                        } />
                        {index < selectedTransfer.approvalFlow.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="subtitle2">{event.action}</Typography>
                        <Typography variant="body2">{event.notes}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          By {event.user} ({event.role})
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
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default TransferHistory
