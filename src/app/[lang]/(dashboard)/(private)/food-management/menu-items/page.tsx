'use client'

import { useCallback, useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// Types
import type { MenuItem as MenuItemType } from '@/types/assets'

// API and Utils
import { foodManagementApi } from '@/utils/api'
import { formatRupiah } from '@/utils/formatters'

const MenuItemsManagement = () => {
  // State for menu items data
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [profitabilityFilter, setProfitabilityFilter] = useState<string>('all')
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // States for dialogs
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(null)

  // Create/Edit Menu Item Dialog
  const [menuItemFormData, setMenuItemFormData] = useState({
    name: '',
    description: '',
    assetId: 0,
    assetCode: '',
    sellingPrice: 0,
    preparationTimeMinutes: 0,
    calorieCount: 0,
    servingSize: '',
    ingredients: [] as { ingredientId: number; quantity: number; unit: string; notes: string }[]
  });

  // Available assets for dropdown
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [loadingAssets, setLoadingAssets] = useState(false);

  // Available ingredients for dropdown
  const [availableIngredients, setAvailableIngredients] = useState<any[]>([]);
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState('');
  const [loadingIngredients, setLoadingIngredients] = useState(false);

  const router = useRouter();

  // Fetch menu items
  const fetchMenuItems = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await foodManagementApi.getMenuItems(page, rowsPerPage)
      setMenuItems(response.content)
      setTotalElements(response.totalElements)
    } catch (err) {
      console.error('Error fetching menu items:', err)
      setError('Failed to load menu items. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage])

  // Initial fetch of menu items
  useEffect(() => {
    fetchMenuItems()
  }, [page, rowsPerPage, fetchMenuItems])

  // Handle page change
  const handleChangePage = (_: unknown, newPage: number) => {
    
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    setSearchQuery(event.target.value)
  }

  // Handle category filter change
  const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
    
    setCategoryFilter(event.target.value)
  }

  // Handle profitability filter change
  const handleProfitabilityFilterChange = (event: SelectChangeEvent<string>) => {
    
    setProfitabilityFilter(event.target.value)
  }

  // Clear filters
  const handleClearFilters = () => {
    
    setSearchQuery('')
    setCategoryFilter('all')
    setProfitabilityFilter('all')
  }

  // Open create dialog
  const handleOpenCreateDialog = () => {
    
    setMenuItemFormData({
      name: '',
      description: '',
      assetId: 0,
      assetCode: '',
      sellingPrice: 0,
      preparationTimeMinutes: 0,
      calorieCount: 0,
      servingSize: '',
      ingredients: []
    });
    fetchAvailableAssets();
    fetchAvailableIngredients();
    setOpenCreateDialog(true)
  }

  // Close create dialog
  const handleCloseCreateDialog = () => {
    
    setOpenCreateDialog(false)
  }

  // Open edit dialog
  const handleOpenEditDialog = (menuItem: MenuItemType) => {
    
    setSelectedMenuItem(menuItem)
    setOpenEditDialog(true)
  }

  // Close edit dialog
  const handleCloseEditDialog = () => {
    
    setOpenEditDialog(false)
  }

  // Open delete dialog
  const handleOpenDeleteDialog = (menuItem: MenuItemType) => {
    
    setSelectedMenuItem(menuItem)
    setOpenDeleteDialog(true)
  }

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    
    setOpenDeleteDialog(false)
  }

  // Handle success message close
  const handleSuccessClose = () => {
    
    setSuccessMessage(null)
  }

  // Calculate display data with filtering
  const getFilteredMenuItems = () => {
    return menuItems.filter(item => {
      const matchesSearch = 
        (item.name?.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (item.assetCode?.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const itemCategory = getMenuCategory(item).toLowerCase();
      const matchesCategory = 
        categoryFilter === 'all' || 
        (categoryFilter === 'main' && itemCategory.includes('main')) ||
        (categoryFilter === 'appetizer' && itemCategory.includes('appetizer')) ||
        (categoryFilter === 'dessert' && itemCategory.includes('dessert')) ||
        (categoryFilter === 'beverage' && itemCategory.includes('beverage'));

      // Calculate profit margin
      const cost = calculateMenuItemCost(item);
      const profitMargin = calculateProfitMargin(item.sellingPrice, cost);

      const matchesProfitabilityFilter = 
        profitabilityFilter === 'all' ||
        (profitabilityFilter === 'high' && profitMargin >= 30) ||
        (profitabilityFilter === 'medium' && profitMargin >= 10 && profitMargin < 30) ||
        (profitabilityFilter === 'low' && profitMargin < 10);

      return matchesSearch && matchesCategory && matchesProfitabilityFilter;
    });
  }

  // Calculate the cost of a menu item based on its ingredients
  const calculateMenuItemCost = (menuItem: MenuItemType): number => {
    if (!menuItem.ingredients || menuItem.ingredients.length === 0) {
      return 0;
    }

    return menuItem.ingredients.reduce((total: number, ingredient: { quantity: number; unitCost: number }) => {
      return total + ((ingredient.quantity || 0) * (ingredient.unitCost || 0))
    }, 0);
  }

  // Calculate profit margin percentage
  const calculateProfitMargin = (sellingPrice: number, cost: number): number => {
    if (cost === 0) return 0;
    return ((sellingPrice - cost) / sellingPrice) * 100;
  }

  // Helper function to determine a menu category based on name or other properties
  const getMenuCategory = (menuItem: MenuItemType): string => {
    const name = menuItem.name.toLowerCase();
    if (name.includes('pizza') || name.includes('burger') || name.includes('sandwich')) {
      return 'Main Course';
    } else if (name.includes('salad') || name.includes('soup') || name.includes('appetizer')) {
      return 'Appetizer';
    } else if (name.includes('cake') || name.includes('ice cream') || name.includes('dessert')) {
      return 'Dessert';
    } else if (name.includes('coffee') || name.includes('tea') || name.includes('juice') || name.includes('soda')) {
      return 'Beverage';
    }
    return 'Other';
  }

  // Helper function to get category color
  const getMenuCategoryColor = (menuItem: MenuItemType): "primary" | "secondary" | "success" | "info" | "default" => {
    const category = getMenuCategory(menuItem).toLowerCase();
    if (category.includes('main')) {
      return 'secondary';
    } else if (category.includes('appetizer')) {
      return 'primary';
    } else if (category.includes('dessert')) {
      return 'success';
    } else if (category.includes('beverage')) {
      return 'info';
    }
    return 'default';
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

  // Fetch available ingredients
  const fetchAvailableIngredients = async (search = '') => {
    setLoadingIngredients(true);
    try {
      // Pass page and size as separate number parameters
      const response = await foodManagementApi.getIngredients(0, 10);
      
      // Filter ingredients based on search query if needed
      const filteredIngredients = search 
        ? response.content.filter(item => 
            item.name.toLowerCase().includes(search.toLowerCase())
          )
        : response.content;
      
      setAvailableIngredients(filteredIngredients);
    } catch (error) {
      console.error('Failed to fetch ingredients:', error);
      setFormError('Failed to fetch ingredients. Please try again.');
    } finally {
      setLoadingIngredients(false);
    }
  };

  // Handle asset search change
  const handleAssetSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setAssetSearchQuery(query);
    if (query.length > 2 || query.length === 0) {
      fetchAvailableAssets(query);
    }
  };

  // Handle selecting an asset
  const handleAssetSelect = (asset: any) => {
    setMenuItemFormData({
      ...menuItemFormData,
      assetId: asset.id,
      assetCode: asset.assetCode,
      name: asset.name,
      description: asset.description || ''
    });
  };

  // Handle ingredient search change
  const handleIngredientSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIngredientSearchQuery(value);
    
    if (value.length >= 2) {
      fetchAvailableIngredients(value);
    } else {
      setAvailableIngredients([]);
    }
  };

  // Handle adding an ingredient to the menu item
  const handleAddIngredient = (ingredient: any) => {
    const newIngredient = {
      ingredientId: ingredient.id,
      quantity: 1,
      unit: ingredient.unit,
      notes: ''
    };

    setMenuItemFormData({
      ...menuItemFormData,
      ingredients: [...menuItemFormData.ingredients, newIngredient]
    });
  };

  // Handle removing an ingredient from the menu item
  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...menuItemFormData.ingredients];
    updatedIngredients.splice(index, 1);

    setMenuItemFormData({
      ...menuItemFormData,
      ingredients: updatedIngredients
    });
  };

  // Handle ingredient quantity change
  const handleIngredientQuantityChange = (index: number, quantity: number) => {
    const updatedIngredients = [...menuItemFormData.ingredients];
    updatedIngredients[index].quantity = quantity;

    setMenuItemFormData({
      ...menuItemFormData,
      ingredients: updatedIngredients
    });
  };

  // Handle ingredient notes change
  const handleIngredientNotesChange = (index: number, notes: string) => {
    const updatedIngredients = [...menuItemFormData.ingredients];
    updatedIngredients[index].notes = notes;

    setMenuItemFormData({
      ...menuItemFormData,
      ingredients: updatedIngredients
    });
  };

  // Generate random menu item data
  const handleFillRandomData = () => {
    const randomNames = [
      'Chicken Parmesan', 'Beef Wellington', 'Vegetable Stir Fry', 'Caesar Salad', 
      'Margherita Pizza', 'Fettuccine Alfredo', 'Chocolate Mousse', 'Tiramisu',
      'Sushi Platter', 'BBQ Ribs', 'Lobster Bisque', 'Mushroom Risotto',
      'Pad Thai', 'Butter Chicken', 'Fish and Chips', 'Beef Bourguignon'
    ];

    const randomDescriptions = [
      'A delicious homemade', 'Our chef\'s specialty', 'Award-winning recipe for', 
      'Traditional recipe of', 'Modern twist on classic', 'Organic and locally sourced',
      'Signature dish featuring', 'Seasonal favorite', 'Family recipe for',
      'Artisan crafted', 'Slow-cooked', 'House specialty'
    ];

    const randomServingSizes = [
      'One portion', 'Family size', 'Individual serving', 'Shareable platter',
      'Small plate', 'Large platter', 'Two servings', 'Single serving'
    ];

    // Only generate random data if there are available assets
    if (availableAssets.length === 0) {
      setFormError('Please search for assets first to generate random data');
      return;
    }

    // Pick a random asset
    const randomAsset = availableAssets[Math.floor(Math.random() * availableAssets.length)];

    // Pick random ingredients (1-3) if available
    const randomIngredients = [];
    if (availableIngredients.length > 0) {
      const numIngredients = Math.floor(Math.random() * 3) + 1; // 1 to 3 ingredients
      for (let i = 0; i < numIngredients; i++) {
        if (i < availableIngredients.length) {
          const ingredient = availableIngredients[Math.floor(Math.random() * availableIngredients.length)];
          randomIngredients.push({
            ingredientId: ingredient.id,
            quantity: parseFloat((Math.random() * 5 + 0.1).toFixed(2)),
            unit: ingredient.unit || 'kg',
            notes: ''
          });
        }
      }
    }

    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomDescription = randomDescriptions[Math.floor(Math.random() * randomDescriptions.length)];
    const randomServingSize = randomServingSizes[Math.floor(Math.random() * randomServingSizes.length)];

    setMenuItemFormData({
      name: randomName,
      description: `${randomDescription} ${randomName.toLowerCase()}`,
      assetId: randomAsset.id,
      assetCode: randomAsset.assetCode,
      sellingPrice: parseFloat((Math.random() * 30 + 5).toFixed(2)),
      preparationTimeMinutes: Math.floor(Math.random() * 45) + 5,
      calorieCount: Math.floor(Math.random() * 800) + 200,
      servingSize: randomServingSize,
      ingredients: randomIngredients
    });
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMenuItemFormData({
      ...menuItemFormData,
      [name]: name === 'sellingPrice' || name === 'preparationTimeMinutes' || name === 'calorieCount' 
        ? parseFloat(value) 
        : value
    });
  };

  // Handle create menu item submission
  const handleCreateMenuItem = async () => {
    if (!menuItemFormData.name || !menuItemFormData.assetId || menuItemFormData.sellingPrice <= 0) {
      setFormError('Please fill in all required fields');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    try {
      // Prepare the request data
      const createMenuItemRequest = {
        name: menuItemFormData.name,
        description: menuItemFormData.description,
        assetCode: menuItemFormData.assetCode,
        sellingPrice: menuItemFormData.sellingPrice,
        preparationTimeMinutes: menuItemFormData.preparationTimeMinutes || 0,
        calorieCount: menuItemFormData.calorieCount || 0,
        servingSize: menuItemFormData.servingSize || '',
        ingredients: menuItemFormData.ingredients.map(ingredient => ({
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          notes: ingredient.notes || ''
        }))
      };

      // Call the API to create the menu item
      const createdMenuItem = await foodManagementApi.createMenuItem(createMenuItemRequest);

      // Update the menu items list
      setMenuItems(prevItems => [createdMenuItem, ...prevItems]);
      setTotalElements(prevTotal => prevTotal + 1);

      // Show success message and close dialog
      setSuccessMessage(`Menu item "${createdMenuItem.name}" created successfully`);
      handleCloseCreateDialog();

      // Reset form data
      setMenuItemFormData({
        name: '',
        description: '',
        assetId: 0,
        assetCode: '',
        sellingPrice: 0,
        preparationTimeMinutes: 0,
        calorieCount: 0,
        servingSize: '',
        ingredients: []
      });
    } catch (error) {
      console.error('Error creating menu item:', error);
      setFormError('Failed to create menu item. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredMenuItems = getFilteredMenuItems();

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Menu Items Management" />
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
                {/* Search Box */}
                <TextField
                  size="small"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="ri-search-2-line" />
                      </InputAdornment>
                    )
                  }}
                />

                {/* Category Filter */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="category-filter-label">Category</InputLabel>
                  <Select
                    labelId="category-filter-label"
                    id="category-filter"
                    value={categoryFilter}
                    label="Category"
                    onChange={(event: SelectChangeEvent<string>) => handleCategoryFilterChange(event)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="appetizer">Appetizer</MenuItem>
                    <MenuItem value="main">Main Course</MenuItem>
                    <MenuItem value="dessert">Dessert</MenuItem>
                    <MenuItem value="beverage">Beverage</MenuItem>
                    <MenuItem value="side">Side Dish</MenuItem>
                  </Select>
                </FormControl>

                {/* Profitability Filter */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="profitability-filter-label">Profitability</InputLabel>
                  <Select
                    labelId="profitability-filter-label"
                    id="profitability-filter"
                    value={profitabilityFilter}
                    label="Profitability"
                    onChange={(event: SelectChangeEvent<string>) => handleProfitabilityFilterChange(event)}
                  >
                    <MenuItem value="all">All Margins</MenuItem>
                    <MenuItem value="high">High (≥30%)</MenuItem>
                    <MenuItem value="medium">Medium (10-30%)</MenuItem>
                    <MenuItem value="low">Low (≤10%)</MenuItem>
                  </Select>
                </FormControl>

                {/* Clear Filters Button */}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleClearFilters}
                  disabled={categoryFilter === 'all' && profitabilityFilter === 'all' && searchQuery === ''}
                >
                  Clear Filters
                </Button>
              </Box>

              {/* Add Menu Item Button */}
              <Button
                variant="contained" 
                startIcon={<i className="ri-add-line" />}
                onClick={handleOpenCreateDialog}
              >
                Add Menu Item
              </Button>
            </Box>

            {/* Menu Items Table */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="menu items table">
                <TableHead>
                  <TableRow>
                    <TableCell>Asset Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Selling Price</TableCell>
                    <TableCell align="right">Cost</TableCell>
                    <TableCell align="right">Profit Margin</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress size={24} />
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          Loading menu items...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredMenuItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2">
                          No menu items found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMenuItems.map((menuItem) => (
                      <TableRow key={menuItem.id}>
                        <TableCell>{menuItem.assetCode}</TableCell>
                        <TableCell>
                          <Link href={`/en/food-management/menu-items/${menuItem.id}`} style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500, cursor: 'pointer' }}>
                            {menuItem.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getMenuCategory(menuItem)} 
                            size="small" 
                            color={getMenuCategoryColor(menuItem)}
                          />
                        </TableCell>
                        <TableCell align="right">{formatRupiah(menuItem.sellingPrice || 0)}</TableCell>
                        <TableCell align="right">{formatRupiah(calculateMenuItemCost(menuItem))}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 60,
                                height: 8,
                                borderRadius: 1,
                                mr: 1,
                                bgcolor: 
                                  calculateProfitMargin(menuItem.sellingPrice, calculateMenuItemCost(menuItem)) >= 30 ? 'success.main' :
                                  calculateProfitMargin(menuItem.sellingPrice, calculateMenuItemCost(menuItem)) >= 10 ? 'warning.main' : 'error.main'
                              }}
                            />
                            {calculateProfitMargin(menuItem.sellingPrice, calculateMenuItemCost(menuItem)).toFixed(0)}%
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={menuItem.assetId ? 'Active' : 'Inactive'} 
                            color={menuItem.assetId ? 'success' : 'default'}
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small" 
                            color="info"
                            onClick={() => router.push(`/en/food-management/menu-items/${menuItem.id}`)}
                            title="View Details"
                          >
                            <i className="ri-eye-line" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => handleOpenEditDialog(menuItem)}
                          >
                            <i className="ri-edit-line" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleOpenDeleteDialog(menuItem)}
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

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Create Menu Item Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Menu Item</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Enter the details for the new menu item.
          </DialogContentText>

          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Asset Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Select Asset
              </Typography>
              <TextField
                fullWidth
                label="Search Available Assets"
                value={assetSearchQuery}
                onChange={handleAssetSearchChange}
                variant="outlined"
                size="small"
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
                <Paper sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {availableAssets.map((asset) => (
                      <ListItem
                        key={asset.id}
                        button
                        selected={menuItemFormData.assetId === asset.id}
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

              {menuItemFormData.assetId > 0 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Selected Asset: {availableAssets.find(a => a.id === menuItemFormData.assetId)?.name} ({menuItemFormData.assetCode})
                </Alert>
              )}
            </Grid>

            {/* Basic Menu Item Details */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={menuItemFormData.name}
                onChange={handleFormChange}
                required
                margin="normal"
                InputProps={{
                  readOnly: menuItemFormData.assetId > 0
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Selling Price"
                name="sellingPrice"
                type="number"
                inputProps={{ min: 0, step: 1000 }}
                value={menuItemFormData.sellingPrice}
                onChange={handleFormChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                }}
                helperText="Enter price in Rupiah (IDR)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={menuItemFormData.description}
                onChange={handleFormChange}
                multiline
                rows={2}
                margin="normal"
                InputProps={{
                  readOnly: menuItemFormData.assetId > 0
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Preparation Time (mins)"
                name="preparationTimeMinutes"
                type="number"
                inputProps={{ min: 0 }}
                value={menuItemFormData.preparationTimeMinutes}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Calorie Count"
                name="calorieCount"
                type="number"
                inputProps={{ min: 0 }}
                value={menuItemFormData.calorieCount}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Serving Size"
                name="servingSize"
                value={menuItemFormData.servingSize}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>

            {/* Ingredients Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Add Ingredients
              </Typography>
              <TextField
                fullWidth
                label="Search Ingredients"
                value={ingredientSearchQuery}
                onChange={handleIngredientSearchChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="ri-search-2-line" />
                    </InputAdornment>
                  ),
                  endAdornment: loadingIngredients && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  )
                }}
              />

              {availableIngredients.length > 0 && (
                <Paper sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {availableIngredients.map((ingredient) => (
                      <ListItem
                        key={ingredient.id}
                        button
                        onClick={() => handleAddIngredient(ingredient)}
                      >
                        <ListItemText
                          primary={ingredient.name}
                          secondary={`${ingredient.assetCode} - ${ingredient.unit}`}
                        />
                        <IconButton size="small" edge="end">
                          <i className="ri-add-line" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}

              {/* Ingredients Table */}
              {menuItemFormData.ingredients.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Ingredient</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {menuItemFormData.ingredients.map((ingredient, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {availableIngredients.find(i => i.id === ingredient.ingredientId)?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              inputProps={{ min: 0.01, step: 0.01, style: { width: '70px' } }}
                              value={ingredient.quantity}
                              onChange={(e) => handleIngredientQuantityChange(index, parseFloat(e.target.value))}
                            />
                          </TableCell>
                          <TableCell>{ingredient.unit}</TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="Add notes"
                              value={ingredient.notes}
                              onChange={(e) => handleIngredientNotesChange(index, e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveIngredient(index)}
                            >
                              <i className="ri-delete-bin-line" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Button 
                variant="contained" 
                onClick={handleFillRandomData} 
                sx={{ mt: 2, mb: 1 }}
                color="secondary"
              >
                Fill with Random Data
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateMenuItem} 
            variant="contained" 
            color="primary"
            disabled={formSubmitting || !menuItemFormData.name || !menuItemFormData.assetId || menuItemFormData.sellingPrice <= 0}
          >
            {formSubmitting ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Menu Item Dialog (placeholder) */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Menu Item</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Update the details for {selectedMenuItem?.name}.
          </DialogContentText>
          {/* Form fields would go here */}
          <Typography>Form implementation coming soon...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseEditDialog}>Update Menu Item</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Menu Item Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Menu Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the menu item "{selectedMenuItem?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleCloseDeleteDialog}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default MenuItemsManagement
