'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
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
import Paper from '@mui/material/Paper'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'

// Type Imports
import { AssetLocation } from '@/types/assets'

// API Imports
import { locationApi } from '@/utils/api'

const LocationManagement = () => {
  // States
  const [locations, setLocations] = useState<AssetLocation[]>([])
  const [rootLocations, setRootLocations] = useState<AssetLocation[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
  const [currentLocation, setCurrentLocation] = useState<AssetLocation | null>(null)
  const [formData, setFormData] = useState<Omit<AssetLocation, 'id' | 'createdAt' | 'updatedAt' | 'parentLocationName'>>({
    name: '',
    description: '',
    parentLocationId: null
  })
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success'
  })

  // Hooks
  const { data: session } = useSession()

  // Fetch locations
  const fetchLocations = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await locationApi.getLocations()
      setLocations(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch locations')
    } finally {
      setLoading(false)
    }
  }

  // Fetch root locations
  const fetchRootLocations = async () => {
    try {
      const data = await locationApi.getRootLocations()
      setRootLocations(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch root locations')
    }
  }

  // Initial fetch
  useEffect(() => {
    if (session) {
      fetchLocations()
      fetchRootLocations()
    }
  }, [session])

  // Handle search
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (location.description && location.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (location.parentLocationName && location.parentLocationName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Handle create dialog
  const handleOpenCreateDialog = () => {
    setFormData({
      name: '',
      description: '',
      parentLocationId: null
    })
    setOpenCreateDialog(true)
  }

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false)
  }

  // Handle edit dialog
  const handleOpenEditDialog = (location: AssetLocation) => {
    setCurrentLocation(location)
    setFormData({
      name: location.name,
      description: location.description || '',
      parentLocationId: location.parentLocationId
    })
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setCurrentLocation(null)
  }

  // Handle delete dialog
  const handleOpenDeleteDialog = (location: AssetLocation) => {
    setCurrentLocation(location)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setCurrentLocation(null)
  }

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle create location
  const handleCreateLocation = async () => {
    try {
      await locationApi.createLocation(formData)
      setSnackbar({
        open: true,
        message: 'Location created successfully',
        severity: 'success'
      })
      handleCloseCreateDialog()
      fetchLocations()
      fetchRootLocations()
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to create location',
        severity: 'error'
      })
    }
  }

  // Handle update location
  const handleUpdateLocation = async () => {
    if (!currentLocation) return

    try {
      await locationApi.updateLocation(currentLocation.id, formData)
      setSnackbar({
        open: true,
        message: 'Location updated successfully',
        severity: 'success'
      })
      handleCloseEditDialog()
      fetchLocations()
      fetchRootLocations()
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update location',
        severity: 'error'
      })
    }
  }

  // Handle delete location
  const handleDeleteLocation = async () => {
    if (!currentLocation) return

    try {
      await locationApi.deleteLocation(currentLocation.id)
      setSnackbar({
        open: true,
        message: 'Location deleted successfully',
        severity: 'success'
      })
      handleCloseDeleteDialog()
      fetchLocations()
      fetchRootLocations()
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete location',
        severity: 'error'
      })
    }
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Location Management" 
            action={
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpenCreateDialog}
                startIcon={<i className="ri-add-line" />}
              >
                Add Location
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
                placeholder="Search Locations"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="ri-search-2-line" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                  <Table stickyHeader aria-label="location table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Parent Location</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLocations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No locations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLocations.map((location) => (
                          <TableRow key={location.id} hover>
                            <TableCell>{location.id}</TableCell>
                            <TableCell>{location.name}</TableCell>
                            <TableCell>{location.description || '-'}</TableCell>
                            <TableCell>{location.parentLocationName || '-'}</TableCell>
                            <TableCell>{location.createdAt ? new Date(location.createdAt).toLocaleString() : '-'}</TableCell>
                            <TableCell>{location.updatedAt ? new Date(location.updatedAt).toLocaleString() : '-'}</TableCell>
                            <TableCell align="center">
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={() => handleOpenEditDialog(location)}
                                title="Edit"
                              >
                                <i className="ri-pencil-line" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleOpenDeleteDialog(location)}
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
              </Paper>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Create Location Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Location</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Location Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            required
            sx={{ mb: 3, mt: 2 }}
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
          <Autocomplete
            id="parent-location-select"
            options={rootLocations}
            getOptionLabel={(option) => `${option.name} (ID: ${option.id})`}
            value={rootLocations.find(loc => loc.id === formData.parentLocationId) || null}
            onChange={(_, newValue) => {
              setFormData(prev => ({
                ...prev,
                parentLocationId: newValue ? newValue.id : null
              }))
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                name="parentLocationId"
                label="Parent Location"
                fullWidth
                sx={{ mb: 3 }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateLocation} 
            variant="contained" 
            color="primary"
            disabled={!formData.name.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Location</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Location Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            required
            sx={{ mb: 3, mt: 2 }}
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
          <Autocomplete
            id="parent-location-select"
            options={rootLocations}
            getOptionLabel={(option) => `${option.name} (ID: ${option.id})`}
            value={rootLocations.find(loc => loc.id === formData.parentLocationId) || null}
            onChange={(_, newValue) => {
              setFormData(prev => ({
                ...prev,
                parentLocationId: newValue ? newValue.id : null
              }))
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                name="parentLocationId"
                label="Parent Location"
                fullWidth
                sx={{ mb: 3 }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateLocation} 
            variant="contained" 
            color="primary"
            disabled={!formData.name.trim()}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Location Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Location</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the location "{currentLocation?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteLocation} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default LocationManagement
