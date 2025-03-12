'use client'

import { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

// MUI Components
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress
} from '@mui/material'

// Types
import type { MenuItemDetail, Ingredient } from '@/types/assets'

// API
import { foodApi, foodManagementApi } from '@/utils/api'

// Utils
import { formatRupiah } from '@/utils/formatters'


const MenuItemDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()

  const [menuItem, setMenuItem] = useState<MenuItemDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ingredient detail dialog state
  const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null)
  const [ingredientDetail, setIngredientDetail] = useState<Ingredient | null>(null)
  const [ingredientDialogOpen, setIngredientDialogOpen] = useState(false)
  const [loadingIngredient, setLoadingIngredient] = useState(false)
  const [ingredientError, setIngredientError] = useState<string | null>(null)

  // Ingredient names cache
  const [ingredientNames, setIngredientNames] = useState<Record<number, string>>({})
  const [loadingIngredientNames, setLoadingIngredientNames] = useState(false)


  useEffect(() => {
    const fetchMenuItemDetail = async () => {
      try {
        setLoading(true)
        const data = await foodApi.getMenuItem(Number(id))

        setMenuItem(data)
        setError(null)

        // Extract ingredient IDs for fetching names
        if (data.ingredients && data.ingredients.length > 0) {
          const ingredientIds = data.ingredients.map(ing => ing.ingredientId)
          fetchIngredientNames(ingredientIds)
        }
      } catch (err) {
        console.error('Error fetching menu item:', err)
        setError('Failed to load menu item details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.token) {
      fetchMenuItemDetail()
    }
  }, [id, session?.user?.token])


  // Fetch ingredient names for the table
  const fetchIngredientNames = async (ingredientIds: number[]) => {
    try {
      setLoadingIngredientNames(true)
      const namesMap: Record<number, string> = {}

      // Fetch ingredients in parallel
      await Promise.all(
        ingredientIds.map(async (ingredientId) => {
          try {
            const ingredient = await foodManagementApi.getIngredientById(ingredientId)
            namesMap[ingredientId] = ingredient.name
          } catch (error) {
            console.error(`Error fetching ingredient ${ingredientId}:`, error)
            namesMap[ingredientId] = 'Unknown'
          }
        })
      )

      setIngredientNames(namesMap)
    } catch (error) {
      console.error('Error fetching ingredient names:', error)
    } finally {
      setLoadingIngredientNames(false)
    }
  }


  // Fetch ingredient details when an ingredient is selected
  useEffect(() => {
    const fetchIngredientDetail = async () => {
      if (!selectedIngredientId) return

      try {
        setLoadingIngredient(true)
        setIngredientError(null)
        const data = await foodManagementApi.getIngredientById(selectedIngredientId)

        setIngredientDetail(data)
      } catch (err) {
        console.error('Error fetching ingredient details:', err)
        setIngredientError('Failed to load ingredient details. Please try again.')
      } finally {
        setLoadingIngredient(false)
      }
    }

    if (selectedIngredientId) {
      fetchIngredientDetail()
    }
  }, [selectedIngredientId])


  const handleBack = () => {
    router.back()
  }


  // Open ingredient detail dialog
  const handleOpenIngredientDialog = (ingredientId: number) => {
    setSelectedIngredientId(ingredientId)

    setIngredientDialogOpen(true)
  }


  // Close ingredient detail dialog
  const handleCloseIngredientDialog = () => {
    setIngredientDialogOpen(false)
    setSelectedIngredientId(null)
    setIngredientDetail(null)
    setIngredientError(null)
  }


  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4">
            <Skeleton width={300} />
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            <Skeleton width={200} />
          </Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={handleBack}
              startIcon={<i className="ri-arrow-left-line" />}
            >
              Back
            </Button>
          </Box>
        </Box>
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" height={200} />
            <Box sx={{ mt: 2 }}>
              <Skeleton height={30} width="60%" />
              <Skeleton height={20} width="40%" />
              <Skeleton height={20} width="80%" />
            </Box>
          </CardContent>
        </Card>
      </Box>
    )
  }


  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4">Menu Item Detail</Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>View menu item information</Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={handleBack}
              startIcon={<i className="ri-arrow-left-line" />}
            >
              Back
            </Button>
          </Box>
        </Box>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    )
  }


  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4">{menuItem?.name || 'Menu Item Detail'}</Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Menu Item Code: {menuItem?.assetCode || ''}</Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<i className="ri-arrow-left-line" />}
          >
            Back
          </Button>
        </Box>
      </Box>

      {menuItem && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" gutterBottom>
                    {menuItem.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {menuItem.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
                    <Chip
                      icon={<i className="ri-money-dollar-circle-line" />}
                      label={formatRupiah(menuItem.sellingPrice)}
                      color="primary"
                    />
                    <Chip
                      icon={<i className="ri-time-line" />}
                      label={`${menuItem.preparationTimeMinutes} minutes`}
                    />
                    <Chip
                      icon={<i className="ri-fire-line" />}
                      label={`${menuItem.calorieCount} calories`}
                    />
                    <Chip
                      icon={<i className="ri-restaurant-line" />}
                      label={menuItem.servingSize}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(menuItem.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated: {new Date(menuItem.updatedAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ingredient ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingIngredientNames && menuItem.ingredients.length > 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                            <Typography variant="body2" sx={{ ml: 2 }}>
                              Loading ingredient details...
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      menuItem.ingredients.map((ingredient) => (
                        <TableRow key={ingredient.ingredientId}>
                          <TableCell>{ingredient.ingredientId}</TableCell>
                          <TableCell>
                            {ingredientNames[ingredient.ingredientId] ||
                              ingredient.ingredientName ||
                              'Loading...'}
                          </TableCell>
                          <TableCell>{ingredient.quantity}</TableCell>
                          <TableCell>{ingredient.unit}</TableCell>
                          <TableCell>{ingredient.notes}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenIngredientDialog(ingredient.ingredientId)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {menuItem.ingredients.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No ingredients found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}

      {/* Ingredient Detail Dialog */}
      <Dialog
        open={ingredientDialogOpen}
        onClose={handleCloseIngredientDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Ingredient Details
            </Typography>
            <IconButton onClick={handleCloseIngredientDialog}>
              <i className="ri-close-line" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {loadingIngredient ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : ingredientError ? (
            <Alert severity="error">{ingredientError}</Alert>
          ) : ingredientDetail ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Basic Information</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Asset Code</Typography>
                  <Typography variant="body1">{ingredientDetail.assetCode}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{ingredientDetail.name}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{ingredientDetail.description || 'N/A'}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Unit</Typography>
                  <Typography variant="body1">{ingredientDetail.unit}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Unit Cost</Typography>
                  <Typography variant="body1">{formatRupiah(ingredientDetail.unitCost)}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Inventory Information</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Current Stock</Typography>
                  <Typography variant="body1">{ingredientDetail.currentStock} {ingredientDetail.unit}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Shelf Life</Typography>
                  <Typography variant="body1">{ingredientDetail.shelfLifeDays} days</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Storage Requirements</Typography>
                  <Typography variant="body1">{ingredientDetail.storageRequirements}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Allergen Information</Typography>
                  <Typography variant="body1">{ingredientDetail.allergenInfo}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body1">{new Date(ingredientDetail.updatedAt).toLocaleString()}</Typography>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Typography>No ingredient details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIngredientDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MenuItemDetailPage
