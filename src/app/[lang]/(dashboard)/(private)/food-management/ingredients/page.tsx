'use client'

import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

// Types
import { Ingredient, IngredientListResponse } from '@/types/assets'

// API
import { foodManagementApi } from '@/utils/api'
import { formatRupiah } from '@/utils/formatters'

const IngredientsManagement = () => {
  // State for ingredients data
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [stockFilter, setStockFilter] = useState<string>('all')
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // States for dialogs
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assetId: 0,
    assetCode: '',
    unit: 'kg',
    unitCost: 0,
    currentStock: 0,
    minimumStock: 5,
    shelfLifeDays: 0,
    storageRequirements: '',
    allergenInfo: '',
    supplier: ''
  })
  
  // Available assets for dropdown
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [loadingAssets, setLoadingAssets] = useState(false);
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      description: '',
      assetId: 0,
      assetCode: '',
      unit: 'kg',
      unitCost: 0,
      currentStock: 0,
      minimumStock: 5,
      shelfLifeDays: 0,
      storageRequirements: '',
      allergenInfo: '',
      supplier: ''
    })
    setAssetSearchQuery('');
  }

  // Open create dialog
  const handleOpenCreateDialog = () => {
    resetFormData()
    fetchAvailableAssets()
    setOpenCreateDialog(true)
  }
  
  // Fetch ingredients
  const fetchIngredients = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await foodManagementApi.getIngredients(page, rowsPerPage) as IngredientListResponse
      setIngredients(response.content)
      setTotalElements(response.totalElements)
    } catch (err) {
      setError('Failed to fetch ingredients. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchIngredients()
  }, [page, rowsPerPage])

  // Filter ingredients based on search query and stock filter
  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = 
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ingredient.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ingredient.assetCode.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (stockFilter === 'all') return matchesSearch
    if (stockFilter === 'low' && ingredient.currentStock < 10) return matchesSearch
    if (stockFilter === 'out' && ingredient.currentStock === 0) return matchesSearch
    if (stockFilter === 'available' && ingredient.currentStock > 0) return matchesSearch
    
    return false
  })

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Dialog handlers
  const handleOpenEditDialog = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setFormData({
      name: ingredient.name,
      description: ingredient.description,
      assetId: ingredient.assetId,
      assetCode: ingredient.assetCode,
      unit: ingredient.unit,
      unitCost: ingredient.unitCost,
      currentStock: ingredient.currentStock,
      minimumStock: ingredient.minimumStock,
      shelfLifeDays: ingredient.shelfLifeDays,
      storageRequirements: ingredient.storageRequirements,
      allergenInfo: ingredient.allergenInfo,
      supplier: ingredient.supplier
    })
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
  }

  const handleOpenDeleteDialog = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'unitCost' || name === 'currentStock' || name === 'minimumStock' || name === 'shelfLifeDays' 
        ? parseFloat(value) || 0 
        : value
    })
  }

  // Handle unit selection change
  const handleUnitChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({
      ...formData,
      unit: e.target.value as string
    })
  }

  // Fetch available assets
  const fetchAvailableAssets = async (search = '') => {
    setLoadingAssets(true);
    try {
      const response = await foodManagementApi.getAvailableAssetsForFood(search);
      setAvailableAssets(response.content);
    } catch (error) {
      console.error('Failed to fetch available assets:', error);
      setFormError('Failed to fetch available assets. Please try again.');
    } finally {
      setLoadingAssets(false);
    }
  };
  
  // Handle asset search change
  const handleAssetSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setAssetSearchQuery(query);
    fetchAvailableAssets(query);
  };
  
  // Handle selecting an asset
  const handleAssetSelect = (asset: any) => {
    setFormData({
      ...formData,
      assetId: asset.id,
      assetCode: asset.assetCode,
      name: asset.name,
      description: asset.description || ''
    });
  };

  // Create new ingredient
  const handleCreateIngredient = async () => {
    // Validate required fields
    if (!formData.name || !formData.assetId || !formData.unit) {
      setFormError('Name, Asset, and Unit are required fields')
      return
    }

    setFormSubmitting(true)
    setFormError(null)

    try {
      await foodManagementApi.createIngredient(formData)
      setOpenCreateDialog(false)
      setSuccessMessage('Ingredient created successfully')
      fetchIngredients() // Refresh the ingredients list
    } catch (err) {
      setFormError('Failed to create ingredient. Please try again.')
      console.error(err)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Update existing ingredient
  const handleUpdateIngredient = async () => {
    if (!selectedIngredient) return

    // Validate required fields
    if (!formData.name || !formData.assetId || !formData.unit) {
      setFormError('Name, Asset, and Unit are required fields')
      return
    }

    setFormSubmitting(true)
    setFormError(null)

    try {
      await foodManagementApi.updateIngredient(selectedIngredient.id, formData)
      setOpenEditDialog(false)
      setSuccessMessage('Ingredient updated successfully')
      fetchIngredients() // Refresh the ingredients list
    } catch (err) {
      setFormError('Failed to update ingredient. Please try again.')
      console.error(err)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Delete ingredient
  const handleDeleteIngredient = async () => {
    if (!selectedIngredient) return

    setFormSubmitting(true)
    setFormError(null)

    try {
      await foodManagementApi.deleteIngredient(selectedIngredient.id)
      setOpenDeleteDialog(false)
      setSuccessMessage('Ingredient deleted successfully')
      fetchIngredients() // Refresh the ingredients list
    } catch (err) {
      setFormError('Failed to delete ingredient. Please try again.')
      console.error(err)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Handle success message close
  const handleSuccessClose = () => {
    setSuccessMessage(null)
  }

  // Generate random ingredient data
  const generateRandomIngredientData = () => {
    const ingredientTypes = [
      'Tomatoes', 'Onions', 'Peppers', 'Lettuce', 'Cheese', 'Flour', 'Sugar', 'Salt', 
      'Chicken', 'Beef', 'Pork', 'Fish', 'Rice', 'Pasta', 'Potatoes', 'Carrots', 
      'Garlic', 'Olive Oil', 'Vinegar', 'Butter', 'Milk', 'Eggs', 'Bread'
    ]
    const descriptions = [
      'Fresh organic', 'Premium quality', 'Local farm', 'Imported', 'Frozen', 
      'Processed', 'Wild-caught', 'Free-range', 'Grass-fed', 'Seasonal'
    ]
    const storageTypes = [
      'Refrigerate at 4°C', 'Store in a cool, dry place', 'Freeze at -18°C', 
      'Keep at room temperature', 'Store in airtight container', 
      'Keep away from direct sunlight', 'Refrigerate after opening'
    ]
    const allergens = [
      'None', 'Contains gluten', 'Contains dairy', 'Contains nuts', 
      'Contains eggs', 'Contains soy', 'Contains shellfish'
    ]
    const suppliers = [
      'Local Farm Co.', 'Global Foods Inc.', 'Fresh Direct LLC', 
      'Organic Produce Ltd.', 'Quality Meats', 'Seafood Suppliers'
    ]
    
    const randomIngredient = ingredientTypes[Math.floor(Math.random() * ingredientTypes.length)]
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)]
    const randomStorage = storageTypes[Math.floor(Math.random() * storageTypes.length)]
    const randomAllergen = allergens[Math.floor(Math.random() * allergens.length)]
    const randomSupplier = suppliers[Math.floor(Math.random() * suppliers.length)]
    
    // List of units to randomly select from
    const units = ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'pc', 'ea', 'box', 'pack']
    const randomUnit = units[Math.floor(Math.random() * units.length)]
    
    // Generate random asset code
    const randomCode = 'ING-' + Math.floor(Math.random() * 900 + 100)
    
    return {
      name: randomIngredient,
      description: `${randomDescription} ${randomIngredient.toLowerCase()}`,
      assetId: 0,
      assetCode: randomCode,
      unit: randomUnit,
      unitCost: parseFloat((Math.random() * 20 + 0.5).toFixed(2)),
      currentStock: Math.floor(Math.random() * 100),
      minimumStock: Math.floor(Math.random() * 10 + 5),
      shelfLifeDays: Math.floor(Math.random() * 30 + 1),
      storageRequirements: randomStorage,
      allergenInfo: randomAllergen,
      supplier: randomSupplier
    }
  }

  // Fill form with random data
  const handleFillRandomData = () => {
    setFormData(generateRandomIngredientData())
  }

  // Get status chip based on stock level
  const getStockStatusChip = (stockLevel: number) => {
    if (stockLevel === 0) {
      return <Chip label="Out of Stock" color="error" size="small" />
    } else if (stockLevel < 10) {
      return <Chip label="Low Stock" color="warning" size="small" />
    } else {
      return <Chip label="In Stock" color="success" size="small" />
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Ingredients Management" 
            action={
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpenCreateDialog}
                startIcon={<i className="ri-add-line" />}
              >
                Add Ingredient
              </Button>
            } 
          />
          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 4 }} onClose={handleSuccessClose}>
                {successMessage}
              </Alert>
            )}

            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  placeholder="Search Ingredients"
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
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="stock-filter-label">Stock Filter</InputLabel>
                  <Select
                    labelId="stock-filter-label"
                    id="stock-filter"
                    value={stockFilter}
                    label="Stock Filter"
                    onChange={(e) => setStockFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="low">Low Stock</MenuItem>
                    <MenuItem value="out">Out of Stock</MenuItem>
                    <MenuItem value="available">Available</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                  <Table stickyHeader aria-label="ingredients table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Asset Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Unit Cost</TableCell>
                        <TableCell>Current Stock</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredIngredients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No ingredients found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredIngredients.map((ingredient) => (
                          <TableRow key={ingredient.id} hover>
                            <TableCell>{ingredient.assetCode}</TableCell>
                            <TableCell>{ingredient.name}</TableCell>
                            <TableCell>{ingredient.unit}</TableCell>
                            <TableCell>{formatRupiah(ingredient.unitCost)}</TableCell>
                            <TableCell>{ingredient.currentStock}</TableCell>
                            <TableCell>{getStockStatusChip(ingredient.currentStock)}</TableCell>
                            <TableCell align="center">
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={() => handleOpenEditDialog(ingredient)}
                                title="Edit"
                              >
                                <i className="ri-edit-line" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleOpenDeleteDialog(ingredient)}
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
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalElements}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Create Ingredient Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Ingredient</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Enter the details for the new ingredient.
          </DialogContentText>
          
          {/* Asset Selection */}
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Select Asset
          </Typography>
          <TextField
            fullWidth
            label="Search Available Assets"
            value={assetSearchQuery}
            onChange={handleAssetSearchChange}
            variant="outlined"
            size="small"
            margin="dense"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="ri-search-2-line" />
                </InputAdornment>
              ),
              endAdornment: loadingAssets && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              )
            }}
          />
          
          {availableAssets.length > 0 && (
            <Paper sx={{ mt: 1, mb: 2, maxHeight: 200, overflow: 'auto' }}>
              <List dense>
                {availableAssets.map((asset) => (
                  <ListItem
                    key={asset.id}
                    button
                    selected={formData.assetId === asset.id}
                    onClick={() => handleAssetSelect(asset)}
                  >
                    <ListItemText
                      primary={asset.name}
                      secondary={`${asset.assetCode} - ${asset.description}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
          
          {formData.assetId > 0 && (
            <Alert severity="success" sx={{ mt: 1, mb: 2 }}>
              Selected Asset: {availableAssets.find(a => a.id === formData.assetId)?.name} ({formData.assetCode})
            </Alert>
          )}
          
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
            required
            InputProps={{
              readOnly: formData.assetId > 0
            }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
            InputProps={{
              readOnly: formData.assetId > 0
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150, mb: 2 }}>
            <InputLabel id="unit-label">Unit</InputLabel>
            <Select
              labelId="unit-label"
              id="unit"
              value={formData.unit}
              label="Unit"
              onChange={handleUnitChange}
            >
              <MenuItem value="kg">Kilogram (kg)</MenuItem>
              <MenuItem value="g">Gram (g)</MenuItem>
              <MenuItem value="lb">Pound (lb)</MenuItem>
              <MenuItem value="oz">Ounce (oz)</MenuItem>
              <MenuItem value="l">Liter (l)</MenuItem>
              <MenuItem value="ml">Milliliter (ml)</MenuItem>
              <MenuItem value="gal">Gallon (gal)</MenuItem>
              <MenuItem value="qt">Quart (qt)</MenuItem>
              <MenuItem value="cup">Cup</MenuItem>
              <MenuItem value="tbsp">Tablespoon (tbsp)</MenuItem>
              <MenuItem value="tsp">Teaspoon (tsp)</MenuItem>
              <MenuItem value="pc">Piece (pc)</MenuItem>
              <MenuItem value="ea">Each (ea)</MenuItem>
              <MenuItem value="box">Box</MenuItem>
              <MenuItem value="pack">Pack</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Unit Cost"
            name="unitCost"
            type="number"
            inputProps={{ min: 0, step: 1000 }}
            value={formData.unitCost}
            onChange={handleFormChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
            }}
            helperText="Enter cost in Rupiah (IDR)"
          />
          <TextField
            label="Current Stock"
            name="currentStock"
            value={formData.currentStock}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
            type="number"
          />
          <TextField
            label="Minimum Stock"
            name="minimumStock"
            value={formData.minimumStock}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
            type="number"
          />
          <TextField
            label="Shelf Life Days"
            name="shelfLifeDays"
            value={formData.shelfLifeDays}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
            type="number"
          />
          <TextField
            label="Storage Requirements"
            name="storageRequirements"
            value={formData.storageRequirements}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Allergen Info"
            name="allergenInfo"
            value={formData.allergenInfo}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <Button variant="contained" onClick={handleFillRandomData} sx={{ mt: 2 }}>
            Fill with Random Data
          </Button>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
              {formError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateIngredient} disabled={formSubmitting}>
            {formSubmitting ? (
              <CircularProgress size={24} />
            ) : (
              'Add Ingredient'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Ingredient Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Ingredient</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Update the details for {selectedIngredient?.name}.
          </DialogContentText>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
            InputProps={{
              readOnly: formData.assetId > 0
            }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
            InputProps={{
              readOnly: formData.assetId > 0
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150, mb: 2 }}>
            <InputLabel id="unit-label">Unit</InputLabel>
            <Select
              labelId="unit-label"
              id="unit"
              value={formData.unit}
              label="Unit"
              onChange={handleUnitChange}
            >
              <MenuItem value="kg">Kilogram (kg)</MenuItem>
              <MenuItem value="g">Gram (g)</MenuItem>
              <MenuItem value="lb">Pound (lb)</MenuItem>
              <MenuItem value="oz">Ounce (oz)</MenuItem>
              <MenuItem value="l">Liter (l)</MenuItem>
              <MenuItem value="ml">Milliliter (ml)</MenuItem>
              <MenuItem value="gal">Gallon (gal)</MenuItem>
              <MenuItem value="qt">Quart (qt)</MenuItem>
              <MenuItem value="cup">Cup</MenuItem>
              <MenuItem value="tbsp">Tablespoon (tbsp)</MenuItem>
              <MenuItem value="tsp">Teaspoon (tsp)</MenuItem>
              <MenuItem value="pc">Piece (pc)</MenuItem>
              <MenuItem value="ea">Each (ea)</MenuItem>
              <MenuItem value="box">Box</MenuItem>
              <MenuItem value="pack">Pack</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Unit Cost"
            name="unitCost"
            type="number"
            inputProps={{ min: 0, step: 1000 }}
            value={formData.unitCost}
            onChange={handleFormChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
            }}
            helperText="Enter cost in Rupiah (IDR)"
          />
          <TextField
            label="Current Stock"
            name="currentStock"
            value={formData.currentStock}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
            type="number"
          />
          <TextField
            label="Minimum Stock"
            name="minimumStock"
            value={formData.minimumStock}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
            type="number"
          />
          <TextField
            label="Shelf Life Days"
            name="shelfLifeDays"
            value={formData.shelfLifeDays}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
            type="number"
          />
          <TextField
            label="Storage Requirements"
            name="storageRequirements"
            value={formData.storageRequirements}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Allergen Info"
            name="allergenInfo"
            value={formData.allergenInfo}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <Button variant="contained" onClick={handleFillRandomData} sx={{ mt: 2 }}>
            Fill with Random Data
          </Button>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
              {formError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateIngredient} disabled={formSubmitting}>
            {formSubmitting ? (
              <CircularProgress size={24} />
            ) : (
              'Update Ingredient'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the ingredient "{selectedIngredient?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteIngredient} disabled={formSubmitting}>
            {formSubmitting ? (
              <CircularProgress size={24} />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default IngredientsManagement
