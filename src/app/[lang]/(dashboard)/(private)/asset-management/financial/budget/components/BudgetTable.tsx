'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import type { SelectChangeEvent } from '@mui/material'

// Dummy Data
const budgetItems = [
  {
    id: 1,
    category: 'Kitchen Equipment',
    department: 'Kitchen Operations',
    fiscalYear: '2025',
    allocated: 85000000,
    spent: 72500000,
    remaining: 12500000,
    status: 'ACTIVE',
    lastUpdated: '2025-02-15'
  },
  {
    id: 2,
    category: 'Kitchen Equipment',
    department: 'Food Preparation',
    fiscalYear: '2025',
    allocated: 65000000,
    spent: 47500000,
    remaining: 17500000,
    status: 'ACTIVE',
    lastUpdated: '2025-02-20'
  },
  {
    id: 3,
    category: 'Dining Furniture',
    department: 'Front of House',
    fiscalYear: '2025',
    allocated: 80000000,
    spent: 65000000,
    remaining: 15000000,
    status: 'ACTIVE',
    lastUpdated: '2025-01-30'
  },
  {
    id: 4,
    category: 'Food Inventory',
    department: 'Inventory Management',
    fiscalYear: '2025',
    allocated: 120000000,
    spent: 105000000,
    remaining: 15000000,
    status: 'ACTIVE',
    lastUpdated: '2025-03-05'
  },
  {
    id: 5,
    category: 'Restaurant Renovation',
    department: 'Facilities',
    fiscalYear: '2025',
    allocated: 200000000,
    spent: 180000000,
    remaining: 20000000,
    status: 'ACTIVE',
    lastUpdated: '2025-01-15'
  },
  {
    id: 6,
    category: 'Marketing',
    department: 'Marketing',
    fiscalYear: '2025',
    allocated: 50000000,
    spent: 35000000,
    remaining: 15000000,
    status: 'ACTIVE',
    lastUpdated: '2025-02-28'
  }
]

// Categories for filtering
const categories = [
  'Kitchen Equipment',
  'Dining Furniture',
  'Food Inventory',
  'Restaurant Renovation',
  'Marketing'
]

// Departments for filtering
const departments = [
  'Kitchen Operations',
  'Food Preparation',
  'Front of House',
  'Inventory Management',
  'Facilities',
  'Marketing'
]

// Fiscal years for filtering
const fiscalYears = [
  '2025',
  '2024',
  '2023'
]

// Statuses for filtering
const statuses = [
  'ACTIVE',
  'CLOSED',
  'PENDING'
]

// Function to format currency in IDR
const formatCurrency = (amount: number) => {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

const BudgetTable = () => {
  // States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  // Filtered data
  const filteredData = budgetItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === '' || 
      item.category === selectedCategory
    
    const matchesDepartment = selectedDepartment === '' || 
      item.department === selectedDepartment
    
    const matchesFiscalYear = selectedFiscalYear === '' || 
      item.fiscalYear === selectedFiscalYear
    
    const matchesStatus = selectedStatus === '' || 
      item.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesDepartment && matchesFiscalYear && matchesStatus
  })

  // Paginated data
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  // Handle category change
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value)
    setPage(0)
  }

  // Handle department change
  const handleDepartmentChange = (event: SelectChangeEvent) => {
    setSelectedDepartment(event.target.value)
    setPage(0)
  }

  // Handle fiscal year change
  const handleFiscalYearChange = (event: SelectChangeEvent) => {
    setSelectedFiscalYear(event.target.value)
    setPage(0)
  }

  // Handle status change
  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value)
    setPage(0)
  }

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedDepartment('')
    setSelectedFiscalYear('')
    setSelectedStatus('')
    setPage(0)
  }

  return (
    <>
      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <i className="ri-search-line"></i>
              </InputAdornment>
            )
          }}
        />
        
        <FormControl sx={{ minWidth: '150px' }} size="small">
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: '150px' }} size="small">
          <InputLabel id="department-filter-label">Department</InputLabel>
          <Select
            labelId="department-filter-label"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            label="Department"
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map(department => (
              <MenuItem key={department} value={department}>{department}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: '120px' }} size="small">
          <InputLabel id="fiscal-year-filter-label">Fiscal Year</InputLabel>
          <Select
            labelId="fiscal-year-filter-label"
            value={selectedFiscalYear}
            onChange={handleFiscalYearChange}
            label="Fiscal Year"
          >
            <MenuItem value="">All Years</MenuItem>
            {fiscalYears.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: '120px' }} size="small">
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={selectedStatus}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            {statuses.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button 
          variant="outlined" 
          color="secondary"
          onClick={handleResetFilters}
          size="small"
          startIcon={<i className="ri-refresh-line"></i>}
        >
          Reset
        </Button>
      </Box>
      
      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="budget table">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Fiscal Year</TableCell>
              <TableCell align="right">Allocated (Rp)</TableCell>
              <TableCell align="right">Spent (Rp)</TableCell>
              <TableCell align="right">Remaining (Rp)</TableCell>
              <TableCell>Utilization</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              // Calculate utilization percentage
              const utilizationPercentage = (row.spent / row.allocated) * 100
              
              return (
                <TableRow key={row.id}>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.fiscalYear}</TableCell>
                  <TableCell align="right">{formatCurrency(row.allocated)}</TableCell>
                  <TableCell align="right">{formatCurrency(row.spent)}</TableCell>
                  <TableCell align="right">{formatCurrency(row.remaining)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={utilizationPercentage} 
                          color={
                            utilizationPercentage > 90 ? 'error' : 
                            utilizationPercentage > 70 ? 'warning' : 
                            'primary'
                          }
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                      </Box>
                      <Typography variant="body2">
                        {utilizationPercentage.toFixed(0)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={
                        row.status === 'ACTIVE' ? 'success' : 
                        row.status === 'CLOSED' ? 'default' : 
                        'info'
                      } 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{row.lastUpdated}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton 
                        color="primary" 
                        size="small"
                        title="Edit Budget"
                        disabled={row.status === 'CLOSED'}
                      >
                        <i className="ri-edit-line"></i>
                      </IconButton>
                      <IconButton 
                        color="info" 
                        size="small"
                        title="View Details"
                      >
                        <i className="ri-eye-line"></i>
                      </IconButton>
                      <IconButton 
                        color="warning" 
                        size="small"
                        title="Adjust Budget"
                        disabled={row.status === 'CLOSED'}
                      >
                        <i className="ri-money-dollar-circle-line"></i>
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
            
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">No budget items found</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Try adjusting your filters or create a new budget
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default BudgetTable
