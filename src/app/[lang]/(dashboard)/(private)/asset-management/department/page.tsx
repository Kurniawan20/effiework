'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// MUI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import InputAdornment from '@mui/material/InputAdornment'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CircularProgress from '@mui/material/CircularProgress'

// Type Imports
import { Department } from '@/types/assets'

// API Import
import { departmentApi } from '@/utils/api'

const DepartmentManagement = () => {
  // States
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null)
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
  const [formData, setFormData] = useState<Omit<Department, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: ''
  })
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
  }>({
    open: false,
    message: '',
    severity: 'info'
  })

  // Session
  const { data: session } = useSession()

  // Fetch departments
  const fetchDepartments = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await departmentApi.getDepartments()
      setDepartments(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch departments')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (session) {
      fetchDepartments()
    }
  }, [session])

  // Handle search
  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (department.description && department.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Handle create dialog
  const handleOpenCreateDialog = () => {
    setFormData({
      name: '',
      description: ''
    })
    setOpenCreateDialog(true)
  }

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false)
  }

  // Handle edit dialog
  const handleOpenEditDialog = (department: Department) => {
    setCurrentDepartment(department)
    setFormData({
      name: department.name,
      description: department.description || ''
    })
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
  }

  // Handle delete dialog
  const handleOpenDeleteDialog = (department: Department) => {
    setCurrentDepartment(department)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Generate random restaurant department
  const generateRandomDepartment = () => {
    const restaurantDepartments = [
      // Kitchen Departments
      { name: 'Main Kitchen', description: 'Primary food preparation area responsible for most menu items.' },
      { name: 'Pastry Kitchen', description: 'Specialized kitchen area for preparing desserts, breads, and pastries.' },
      { name: 'Cold Kitchen', description: 'Preparation of cold dishes, salads, and appetizers.' },
      { name: 'Hot Kitchen', description: 'Preparation of hot dishes, grilled items, and main courses.' },
      { name: 'Prep Kitchen', description: 'Responsible for ingredient preparation before cooking.' },
      
      // Service Departments
      { name: 'Dining Service', description: 'Front-of-house staff responsible for customer service in the dining area.' },
      { name: 'Banquet Service', description: 'Specialized team handling large events and catering services.' },
      { name: 'Bar Service', description: 'Responsible for beverage preparation and service.' },
      { name: 'Takeout & Delivery', description: 'Manages orders for pickup and delivery to customers.' },
      { name: 'Drive-Through', description: 'Handles orders from customers in vehicles.' },
      
      // Management Departments
      { name: 'Restaurant Management', description: 'Overall supervision of restaurant operations and staff.' },
      { name: 'Kitchen Management', description: 'Supervision of kitchen operations, menu planning, and food quality.' },
      { name: 'Service Management', description: 'Oversight of front-of-house operations and customer experience.' },
      { name: 'Inventory Management', description: 'Tracking and ordering of food, supplies, and equipment.' },
      { name: 'Quality Control', description: 'Ensures food safety, consistency, and adherence to standards.' },
      
      // Support Departments
      { name: 'Maintenance', description: 'Responsible for facility and equipment upkeep and repairs.' },
      { name: 'Cleaning & Sanitation', description: 'Ensures cleanliness of all restaurant areas and equipment.' },
      { name: 'Purchasing', description: 'Procurement of ingredients, supplies, and equipment.' },
      { name: 'Human Resources', description: 'Staff recruitment, training, and administrative support.' },
      { name: 'Marketing & Events', description: 'Promotion, social media, and special event coordination.' },
      
      // Specialized Departments
      { name: 'Halal Food Preparation', description: 'Specialized kitchen area for preparing halal-certified dishes.' },
      { name: 'Catering', description: 'Handles off-site food service for events and functions.' },
      { name: 'Bakery', description: 'Production of bread, pastries, and baked goods.' },
      { name: 'Butchery', description: 'Meat processing and preparation for kitchen use.' },
      { name: 'Research & Development', description: 'Menu innovation and new recipe development.' }
    ];
    
    // Pick a random department from the list
    const randomDepartment = restaurantDepartments[Math.floor(Math.random() * restaurantDepartments.length)];
    
    // Update the form data with the random department
    setFormData({
      name: randomDepartment.name,
      description: randomDepartment.description
    });
  };

  // Handle create department
  const handleCreateDepartment = async () => {
    try {
      await departmentApi.createDepartment(formData)
      setSnackbar({
        open: true,
        message: 'Department created successfully',
        severity: 'success'
      })
      handleCloseCreateDialog()
      fetchDepartments()
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to create department',
        severity: 'error'
      })
    }
  }

  // Handle update department
  const handleUpdateDepartment = async () => {
    if (!currentDepartment) return

    try {
      await departmentApi.updateDepartment(currentDepartment.id, formData)
      setSnackbar({
        open: true,
        message: 'Department updated successfully',
        severity: 'success'
      })
      handleCloseEditDialog()
      fetchDepartments()
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update department',
        severity: 'error'
      })
    }
  }

  // Handle delete department
  const handleDeleteDepartment = async () => {
    if (!currentDepartment) return

    try {
      await departmentApi.deleteDepartment(currentDepartment.id)
      setSnackbar({
        open: true,
        message: 'Department deleted successfully',
        severity: 'success'
      })
      handleCloseDeleteDialog()
      fetchDepartments()
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete department',
        severity: 'error'
      })
    }
  }

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }))
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Department Management" 
              action={
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleOpenCreateDialog}
                  startIcon={<i className="ri-add-line" />}
                >
                  Add Department
                </Button>
              } 
            />
            <CardContent>
              {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                  size="small"
                  placeholder="Search Departments"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="ri-search-2-line" />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredDepartments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No departments found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDepartments.map((department) => (
                          <TableRow key={department.id} hover>
                            <TableCell>{department.id}</TableCell>
                            <TableCell>{department.name}</TableCell>
                            <TableCell>{department.description || '-'}</TableCell>
                            <TableCell>{department.createdAt ? new Date(department.createdAt).toLocaleString() : '-'}</TableCell>
                            <TableCell>{department.updatedAt ? new Date(department.updatedAt).toLocaleString() : '-'}</TableCell>
                            <TableCell align="center">
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={() => handleOpenEditDialog(department)}
                                title="Edit"
                              >
                                <i className="ri-edit-line" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleOpenDeleteDialog(department)}
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Department Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Department</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Please fill in the department details below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Department Name"
            type="text"
            fullWidth
            required
            value={formData.name}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={generateRandomDepartment}
            color="secondary"
            variant="outlined"
            startIcon={<i className="ri-magic-line" />}
            sx={{ mr: 'auto' }}
          >
            Generate Restaurant Department
          </Button>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateDepartment} 
            variant="contained"
            disabled={!formData.name}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Update the department details below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Department Name"
            type="text"
            fullWidth
            required
            value={formData.name}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={generateRandomDepartment}
            color="secondary"
            variant="outlined"
            startIcon={<i className="ri-magic-line" />}
            sx={{ mr: 'auto' }}
          >
            Generate Restaurant Department
          </Button>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateDepartment} 
            variant="contained"
            disabled={!formData.name}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Department Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Department</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the department "{currentDepartment?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteDepartment} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default DepartmentManagement
