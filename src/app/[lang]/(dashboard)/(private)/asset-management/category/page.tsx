'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

// Type Imports
import { AssetCategory } from '@/types/assets'

// API Imports
import { categoryApi, hasValidToken, setToken } from '@/utils/api'

const CategoryManagement = () => {
  const { data: session } = useSession()
  const router = useRouter()
  
  // States
  const [categories, setCategories] = useState<AssetCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [formErrors, setFormErrors] = useState({ name: '' })
  const [formSubmitting, setFormSubmitting] = useState(false)
  
  // Ensure token is available from session
  useEffect(() => {
    if (session?.user?.accessToken) {
      setToken(session.user.accessToken)
    }
  }, [session])
  
  // Load categories on component mount
  useEffect(() => {
    if (hasValidToken()) {
      loadCategories()
    }
  }, [])
  
  // Load categories
  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryApi.getCategories()
      setCategories(data)
      setError(null)
    } catch (error) {
      console.error('Error loading categories:', error)
      setError('Failed to load categories. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle delete dialog open
  const handleDeleteDialogOpen = (category: AssetCategory) => {
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }
  
  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setSelectedCategory(null)
  }
  
  // Handle category deletion
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return
    
    try {
      setDeleteLoading(true)
      await categoryApi.deleteCategory(selectedCategory.id)
      
      // Remove the deleted category from the list
      setCategories(prevCategories => prevCategories.filter(category => category.id !== selectedCategory.id))
      
      // Show success message
      setSuccess(`Category ${selectedCategory.name} deleted successfully`)
      
      // Close dialog
      handleDeleteDialogClose()
    } catch (error) {
      console.error('Error deleting category:', error)
      setError('Failed to delete category. It may be in use by assets.')
    } finally {
      setDeleteLoading(false)
    }
  }
  
  // Handle edit dialog open
  const handleEditDialogOpen = (category: AssetCategory) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || ''
    })
    setFormErrors({ name: '' })
    setEditDialogOpen(true)
  }
  
  // Handle edit dialog close
  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
    setSelectedCategory(null)
    setFormData({ name: '', description: '' })
  }
  
  // Handle create dialog open
  const handleCreateDialogOpen = () => {
    setFormData({ name: '', description: '' })
    setFormErrors({ name: '' })
    setCreateDialogOpen(true)
  }
  
  // Handle create dialog close
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false)
    setFormData({ name: '', description: '' })
  }
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear validation error when user types
    if (name === 'name' && formErrors.name) {
      setFormErrors(prev => ({ ...prev, name: '' }))
    }
  }
  
  // Generate random restaurant/food category
  const generateRandomCategory = () => {
    const restaurantCategories = [
      // Kitchen Equipment
      { name: 'Cooking Equipment', description: 'Stoves, ovens, grills, fryers, and other cooking appliances used in food preparation.' },
      { name: 'Food Storage', description: 'Refrigerators, freezers, and other storage solutions for preserving food items.' },
      { name: 'Food Preparation', description: 'Mixers, blenders, food processors, and other tools used in preparing ingredients.' },
      { name: 'Serving Equipment', description: 'Plates, utensils, serving trays, and other items used to serve food to customers.' },
      { name: 'Dining Furniture', description: 'Tables, chairs, booths, and other furniture for customer dining areas.' },
      
      // Food Categories
      { name: 'Proteins', description: 'Meat, poultry, fish, and plant-based protein ingredients used in meal preparation.' },
      { name: 'Produce', description: 'Fresh fruits and vegetables used in meal preparation and garnishes.' },
      { name: 'Grains & Starches', description: 'Rice, pasta, bread, and other grain-based food items.' },
      { name: 'Dairy Products', description: 'Milk, cheese, cream, and other dairy-based ingredients.' },
      { name: 'Beverages', description: 'Drinks and drink-making equipment for the restaurant.' },
      
      // Restaurant Areas
      { name: 'Kitchen Area', description: 'Equipment and assets located in the main cooking area.' },
      { name: 'Dining Area', description: 'Furniture and decor in customer-facing dining spaces.' },
      { name: 'Bar Area', description: 'Equipment and furnishings for beverage service areas.' },
      { name: 'Storage Area', description: 'Shelving, containers, and organization systems for food and supply storage.' },
      { name: 'Outdoor Seating', description: 'Patio furniture and equipment for outdoor dining spaces.' },
      
      // Specialized Equipment
      { name: 'Baking Equipment', description: 'Ovens, mixers, and tools specialized for baking bread, pastries, and desserts.' },
      { name: 'Coffee & Tea Service', description: 'Coffee machines, tea brewers, and related accessories.' },
      { name: 'Tableware', description: 'Plates, bowls, glasses, and utensils used for serving customers.' },
      { name: 'Food Transport', description: 'Carts, trays, and containers used to move food within the restaurant.' },
      { name: 'Cleaning Equipment', description: 'Dishwashers, sinks, and cleaning tools for maintaining kitchen hygiene.' },
      
      // Menu Food Categories
      { name: 'Appetizers', description: 'Small dishes served before the main course to stimulate the appetite.' },
      { name: 'Soups & Salads', description: 'Light dishes often served before or alongside the main course.' },
      { name: 'Main Courses', description: 'Primary dishes that form the principal part of a meal.' },
      { name: 'Seafood', description: 'Dishes primarily featuring fish, shellfish, and other seafood items.' },
      { name: 'Poultry', description: 'Dishes featuring chicken, turkey, duck, and other poultry items.' },
      { name: 'Beef & Lamb', description: 'Dishes featuring beef, lamb, and other red meat items.' },
      { name: 'Vegetarian', description: 'Dishes without meat, suitable for vegetarian diners.' },
      { name: 'Vegan', description: 'Dishes without any animal products, suitable for vegan diners.' },
      { name: 'Halal', description: 'Dishes prepared according to Islamic dietary guidelines.' },
      { name: 'Sides', description: 'Smaller dishes served alongside main courses.' },
      { name: 'Desserts', description: 'Sweet dishes typically served at the end of a meal.' },
      { name: 'Breakfast Items', description: 'Foods typically served during morning meal periods.' },
      { name: 'Lunch Specials', description: 'Items featured specifically during lunch service hours.' },
      { name: 'Dinner Entrées', description: 'Main dishes served during evening dining periods.' },
      { name: 'Kids Menu', description: 'Dishes designed and portioned specifically for children.' },
      { name: 'Beverages', description: 'Non-alcoholic and alcoholic drinks available to customers.' },
      { name: 'Specialty Coffees', description: 'Premium coffee drinks and coffee-based beverages.' },
      { name: 'Signature Dishes', description: 'House specialties and unique offerings exclusive to the restaurant.' },
      { name: 'Seasonal Specials', description: 'Limited-time offerings based on seasonal ingredients and themes.' },
      { name: 'Catering Packages', description: 'Pre-set menu combinations designed for events and large groups.' }
    ];
    
    // Pick a random category from the list
    const randomCategory = restaurantCategories[Math.floor(Math.random() * restaurantCategories.length)];
    
    // Update the form data with the random category
    setFormData({
      name: randomCategory.name,
      description: randomCategory.description
    });
    
    // Clear any form errors
    setFormErrors({ name: '' });
  };
  
  // Validate form
  const validateForm = () => {
    let valid = true
    const errors = { name: '' }
    
    if (!formData.name.trim()) {
      errors.name = 'Category name is required'
      valid = false
    }
    
    setFormErrors(errors)
    return valid
  }
  
  // Handle create category
  const handleCreateCategory = async () => {
    if (!validateForm()) return
    
    try {
      setFormSubmitting(true)
      const newCategory = await categoryApi.createCategory({
        name: formData.name,
        description: formData.description
      })
      
      // Add the new category to the list
      setCategories(prev => [...prev, newCategory])
      
      // Show success message
      setSuccess(`Category ${newCategory.name} created successfully`)
      
      // Close dialog
      handleCreateDialogClose()
    } catch (error) {
      console.error('Error creating category:', error)
      setError('Failed to create category. Please try again.')
    } finally {
      setFormSubmitting(false)
    }
  }
  
  // Handle update category
  const handleUpdateCategory = async () => {
    if (!validateForm() || !selectedCategory) return
    
    try {
      setFormSubmitting(true)
      const updatedCategory = await categoryApi.updateCategory(selectedCategory.id, {
        name: formData.name,
        description: formData.description
      })
      
      // Update the category in the list
      setCategories(prev => 
        prev.map(category => 
          category.id === selectedCategory.id ? updatedCategory : category
        )
      )
      
      // Show success message
      setSuccess(`Category ${updatedCategory.name} updated successfully`)
      
      // Close dialog
      handleEditDialogClose()
    } catch (error) {
      console.error('Error updating category:', error)
      setError('Failed to update category. Please try again.')
    } finally {
      setFormSubmitting(false)
    }
  }
  
  if (loading && categories.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h5'>Category Management</Typography>
          <Button 
            variant='contained' 
            color='primary'
            startIcon={<i className='ri-add-line'></i>}
            onClick={handleCreateDialogOpen}
          >
            Add Category
          </Button>
        </Box>
        
        <Card>
          <CardHeader title='Asset Categories' />
          <CardContent>
            {error && (
              <Alert severity='error' sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}
            
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align='right'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.length > 0 ? (
                    categories.map(category => (
                      <TableRow key={category.id}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell align='right'>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <IconButton 
                              color='primary' 
                              size='small'
                              onClick={() => handleEditDialogOpen(category)}
                            >
                              <i className='ri-edit-line'></i>
                            </IconButton>
                            <IconButton 
                              color='error' 
                              size='small'
                              onClick={() => handleDeleteDialogOpen(category)}
                            >
                              <i className='ri-delete-bin-line'></i>
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align='center'>
                        <Typography variant='body1'>No categories found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Success Message */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity='success' 
          variant='filled'
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby='delete-dialog-title'
      >
        <DialogTitle id='delete-dialog-title'>
          Delete Category
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete category "{selectedCategory?.name}"? 
            This action cannot be undone and may affect assets using this category.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color='primary'>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteCategory} 
            color='error' 
            variant='contained'
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <i className='ri-delete-bin-line'></i>}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create Category Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        aria-labelledby='create-dialog-title'
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle id='create-dialog-title'>
          Create New Category
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              name='name'
              label='Category Name'
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              name='description'
              label='Description'
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={generateRandomCategory}
            color='secondary'
            variant='outlined'
            startIcon={<i className='ri-magic-line'></i>}
            sx={{ mr: 'auto' }}
          >
            Generate Restaurant Category
          </Button>
          <Button onClick={handleCreateDialogClose} color='primary'>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateCategory} 
            color='primary' 
            variant='contained'
            disabled={formSubmitting}
            startIcon={formSubmitting ? <CircularProgress size={20} /> : <i className='ri-save-line'></i>}
          >
            {formSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby='edit-dialog-title'
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle id='edit-dialog-title'>
          Edit Category
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              name='name'
              label='Category Name'
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              name='description'
              label='Description'
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={generateRandomCategory}
            color='secondary'
            variant='outlined'
            startIcon={<i className='ri-magic-line'></i>}
            sx={{ mr: 'auto' }}
          >
            Generate Restaurant Category
          </Button>
          <Button onClick={handleEditDialogClose} color='primary'>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateCategory} 
            color='primary' 
            variant='contained'
            disabled={formSubmitting}
            startIcon={formSubmitting ? <CircularProgress size={20} /> : <i className='ri-save-line'></i>}
          >
            {formSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CategoryManagement
