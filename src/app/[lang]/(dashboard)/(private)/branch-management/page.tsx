'use client'

import { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

// MUI Components
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material'

// Types
import type { Branch } from '@/types/assets'

// API
import { branchApi } from '@/utils/api'

const BranchManagementPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  
  // State for branch data
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  
  // Filter state
  const [nameFilter, setNameFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('true')
  const [sortField, setSortField] = useState<string>('name,asc')
  
  // Fetch branches with current filters and pagination
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true)
        
        const response = await branchApi.getBranches({
          name: nameFilter || undefined,
          isActive: activeFilter === 'all' ? undefined : activeFilter === 'true',
          page,
          size: rowsPerPage,
          sort: sortField
        })
        
        setBranches(response.content)
        setTotalItems(response.totalElements)
        setError(null)
      } catch (err) {
        console.error('Error fetching branches:', err)
        setError('Failed to load branches. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    if (session?.user?.token) {
      fetchBranches()
    }
  }, [session?.user?.token, page, rowsPerPage, nameFilter, activeFilter, sortField])
  
  // Handle page change
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  
  // Handle name filter change
  const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value)
    setPage(0)
  }
  
  // Handle active filter change
  const handleActiveFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setActiveFilter(event.target.value as string)
    setPage(0)
  }
  
  // Handle sort field change
  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortField(event.target.value as string)
    setPage(0)
  }
  
  // Handle create new branch
  const handleCreateBranch = () => {
    // Navigate to create branch page or open create dialog
    console.log('Create new branch')
  }
  
  // Handle edit branch
  const handleEditBranch = (branchId: number) => {
    // Navigate to edit branch page or open edit dialog
    console.log('Edit branch', branchId)
  }
  
  // Handle view branch details
  const handleViewBranch = (branchId: number) => {
    // Navigate to branch details page
    router.push(`/${params?.lang}/branch-management/${branchId}`)
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Branch Management</Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<i className="ri-add-line" />}
          onClick={handleCreateBranch}
        >
          Add New Branch
        </Button>
      </Box>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search by Branch Name"
                variant="outlined"
                value={nameFilter}
                onChange={handleNameFilterChange}
                InputProps={{
                  startAdornment: <i className="ri-search-line" style={{ marginRight: 8 }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={activeFilter}
                  onChange={handleActiveFilterChange}
                  label="Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortField}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="name,asc">Name (A-Z)</MenuItem>
                  <MenuItem value="name,desc">Name (Z-A)</MenuItem>
                  <MenuItem value="code,asc">Code (A-Z)</MenuItem>
                  <MenuItem value="code,desc">Code (Z-A)</MenuItem>
                  <MenuItem value="createdAt,desc">Newest First</MenuItem>
                  <MenuItem value="createdAt,asc">Oldest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {error ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Paper>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Contact Email</TableCell>
                  <TableCell>Contact Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <i className="ri-loader-4-line ri-spin" style={{ fontSize: 24, marginRight: 8 }} />
                        <Typography>Loading branches...</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : branches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography>No branches found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell>{branch.code}</TableCell>
                      <TableCell>{branch.name}</TableCell>
                      <TableCell>{branch.contactPerson}</TableCell>
                      <TableCell>{branch.contactEmail}</TableCell>
                      <TableCell>{branch.contactPhone}</TableCell>
                      <TableCell>
                        <Chip 
                          label={branch.isActive ? 'Active' : 'Inactive'} 
                          color={branch.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewBranch(branch.id)}
                            title="View Details"
                          >
                            <i className="ri-eye-line" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="info"
                            onClick={() => handleEditBranch(branch.id)}
                            title="Edit"
                          >
                            <i className="ri-edit-line" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  )
}

export default BranchManagementPage
