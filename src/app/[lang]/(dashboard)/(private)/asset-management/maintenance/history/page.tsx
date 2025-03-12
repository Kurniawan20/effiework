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
interface MaintenanceRecord {
  id: string
  assetId: string
  assetName: string
  maintenanceType: string
  status: string
  technician: string
  completedDate: string
  cost: number
  description: string
  nextMaintenanceDate: string
}

// Dummy Data
const maintenanceData: MaintenanceRecord[] = [
  {
    id: '1',
    assetId: 'AST001',
    assetName: 'Laptop Dell XPS 15',
    maintenanceType: 'Preventive',
    status: 'Completed',
    technician: 'John Smith',
    completedDate: '2025-02-20',
    cost: 150.00,
    description: 'Regular system checkup and cleaning',
    nextMaintenanceDate: '2025-05-20'
  },
  {
    id: '2',
    assetId: 'AST002',
    assetName: 'HP LaserJet Printer',
    maintenanceType: 'Corrective',
    status: 'Completed',
    technician: 'Sarah Johnson',
    completedDate: '2025-02-18',
    cost: 350.00,
    description: 'Replaced paper feed mechanism and calibrated',
    nextMaintenanceDate: '2025-04-18'
  },
  {
    id: '3',
    assetId: 'AST003',
    assetName: 'Industrial AC Unit',
    maintenanceType: 'Preventive',
    status: 'Completed',
    technician: 'Mike Brown',
    completedDate: '2025-02-15',
    cost: 200.00,
    description: 'Filter replacement and coil cleaning',
    nextMaintenanceDate: '2025-05-15'
  }
]

const MaintenanceHistory = () => {
  // States
  const [filtering, setFiltering] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  // Column Definitions
  const columns: ColumnDef<MaintenanceRecord>[] = [
    {
      header: 'Asset ID',
      accessorKey: 'assetId'
    },
    {
      header: 'Asset Name',
      accessorKey: 'assetName'
    },
    {
      header: 'Maintenance Type',
      accessorKey: 'maintenanceType',
      cell: ({ row }) => (
        <Chip
          label={row.original.maintenanceType}
          color={row.original.maintenanceType === 'Preventive' ? 'info' : 'warning'}
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
          color="success"
          size="small"
        />
      )
    },
    {
      header: 'Technician',
      accessorKey: 'technician'
    },
    {
      header: 'Completed Date',
      accessorKey: 'completedDate'
    },
    {
      header: 'Cost',
      accessorKey: 'cost',
      cell: ({ row }) => `$${row.original.cost.toFixed(2)}`
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <IconButton
          onClick={(e) => {
            setActionMenuAnchor(e.currentTarget)
            setSelectedRecordId(row.original.id)
          }}
        >
          <i className="ri-more-2-fill" />
        </IconButton>
      )
    }
  ]

  // Table Instance
  const table = useReactTable({
    data: maintenanceData,
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
    const record = maintenanceData.find(r => r.id === selectedRecordId)
    if (record) {
      setSelectedRecord(record)
      setDetailsOpen(true)
    }
    setActionMenuAnchor(null)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
    setSelectedRecord(null)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Maintenance History' />
          <CardContent>
            {/* Search Bar */}
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
                placeholder='Search Maintenance Records...'
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
        <DialogTitle>Maintenance Record Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Asset ID"
                  value={selectedRecord.assetId}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Asset Name"
                  value={selectedRecord.assetName}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maintenance Type"
                  value={selectedRecord.maintenanceType}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Status"
                  value={selectedRecord.status}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Technician"
                  value={selectedRecord.technician}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Completed Date"
                  value={selectedRecord.completedDate}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cost"
                  value={`$${selectedRecord.cost.toFixed(2)}`}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Next Maintenance Date"
                  value={selectedRecord.nextMaintenanceDate}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={selectedRecord.description}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
          <Button variant="contained" onClick={handleCloseDetails}>
            Download Report
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default MaintenanceHistory
