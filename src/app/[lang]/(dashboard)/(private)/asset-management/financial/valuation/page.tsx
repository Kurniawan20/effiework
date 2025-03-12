'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import type { SelectChangeEvent } from '@mui/material'

// Dummy Data
const assetValuationData = [
  {
    id: 1,
    assetCode: 'AST-001',
    assetName: 'Commercial Udon Noodle Machine',
    categoryName: 'Kitchen Equipment',
    purchaseDate: '2023-05-15',
    purchaseValue: 125000000,
    currentBookValue: 100000000,
    marketValue: 98000000,
    lastValuationDate: '2025-01-10',
    valuationMethod: 'Market Comparison',
    valuationStatus: 'CURRENT'
  },
  {
    id: 2,
    assetCode: 'AST-002',
    assetName: 'Industrial Rice Cooker',
    categoryName: 'Kitchen Equipment',
    purchaseDate: '2023-08-20',
    purchaseValue: 32000000,
    currentBookValue: 25600000,
    marketValue: 24500000,
    lastValuationDate: '2025-01-10',
    valuationMethod: 'Market Comparison',
    valuationStatus: 'CURRENT'
  },
  {
    id: 3,
    assetCode: 'AST-003',
    assetName: 'Tempura Fryer Station',
    categoryName: 'Kitchen Equipment',
    purchaseDate: '2022-11-05',
    purchaseValue: 85000000,
    currentBookValue: 59500000,
    marketValue: 52000000,
    lastValuationDate: '2024-10-15',
    valuationMethod: 'Cost Approach',
    valuationStatus: 'OUTDATED'
  },
  {
    id: 4,
    assetCode: 'AST-004',
    assetName: 'Japanese Style Dining Tables (Set of 10)',
    categoryName: 'Furniture',
    purchaseDate: '2023-02-10',
    purchaseValue: 75000000,
    currentBookValue: 60000000,
    marketValue: 63000000,
    lastValuationDate: '2025-01-10',
    valuationMethod: 'Market Comparison',
    valuationStatus: 'CURRENT'
  },
  {
    id: 5,
    assetCode: 'AST-005',
    assetName: 'POS System with Kitchen Display',
    categoryName: 'Electronics',
    purchaseDate: '2024-01-20',
    purchaseValue: 42000000,
    currentBookValue: 37800000,
    marketValue: 38500000,
    lastValuationDate: '2025-01-10',
    valuationMethod: 'Market Comparison',
    valuationStatus: 'CURRENT'
  },
  {
    id: 6,
    assetCode: 'AST-006',
    assetName: 'Refrigerated Display Case',
    categoryName: 'Kitchen Equipment',
    purchaseDate: '2023-09-12',
    purchaseValue: 68000000,
    currentBookValue: 54400000,
    marketValue: 51000000,
    lastValuationDate: '2025-01-10',
    valuationMethod: 'Market Comparison',
    valuationStatus: 'CURRENT'
  },
  {
    id: 7,
    assetCode: 'AST-007',
    assetName: 'Restaurant Interior Renovation',
    categoryName: 'Facilities',
    purchaseDate: '2023-03-25',
    purchaseValue: 850000000,
    currentBookValue: 765000000,
    marketValue: 800000000,
    lastValuationDate: '2024-11-20',
    valuationMethod: 'Cost Approach',
    valuationStatus: 'OUTDATED'
  }
]

// Valuation Methods
const valuationMethods = [
  { value: 'market-comparison', label: 'Market Comparison' },
  { value: 'cost-approach', label: 'Cost Approach' },
  { value: 'income-approach', label: 'Income Approach' }
]

// Categories
const categories = [
  { value: 'kitchen-equipment', label: 'Kitchen Equipment' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'facilities', label: 'Facilities' }
]

// Valuation Status
const valuationStatuses = [
  { value: 'CURRENT', label: 'Current' },
  { value: 'OUTDATED', label: 'Outdated' },
  { value: 'PENDING', label: 'Pending' }
]

// Tab Panel Interface
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

// Tab Panel Component
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`valuation-tabpanel-${index}`}
      aria-labelledby={`valuation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

// Function to format currency in IDR
const formatCurrency = (amount: number) => {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

const ValuationPage = () => {
  // States
  const [tabValue, setTabValue] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [selectedAsset, setSelectedAsset] = useState<(typeof assetValuationData)[0] | null>(null)
  const [newMarketValue, setNewMarketValue] = useState<string>('')
  const [valuationMethod, setValuationMethod] = useState<string>('market-comparison')
  const [valuationNotes, setValuationNotes] = useState<string>('')

  // Filtered Assets
  const filteredAssets = assetValuationData.filter(asset => {
    const matchesSearch = searchTerm === '' || 
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === '' || 
      asset.categoryName.toLowerCase() === selectedCategory.toLowerCase()
    
    const matchesStatus = selectedStatus === '' || 
      asset.valuationStatus === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Calculate Summary Data
  const totalBookValue = filteredAssets.reduce((sum, asset) => sum + asset.currentBookValue, 0)
  const totalMarketValue = filteredAssets.reduce((sum, asset) => sum + asset.marketValue, 0)
  const valueDifference = totalMarketValue - totalBookValue
  const percentageDifference = totalBookValue > 0 ? (valueDifference / totalBookValue) * 100 : 0

  // Handle Tab Change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Handle Category Change
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value)
  }

  // Handle Status Change
  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value)
  }

  // Handle Search Change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory('')
    setSelectedStatus('')
    setSearchTerm('')
  }

  // Handle Valuation Dialog Open
  const handleValuationDialogOpen = (asset: (typeof assetValuationData)[0]) => {
    setSelectedAsset(asset)
    setNewMarketValue(asset.marketValue.toString())
    setValuationMethod('market-comparison')
    setValuationNotes('')
    setDialogOpen(true)
  }

  // Handle Dialog Close
  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedAsset(null)
  }

  // Handle Valuation Method Change
  const handleValuationMethodChange = (event: SelectChangeEvent) => {
    setValuationMethod(event.target.value)
  }

  // Handle Save Valuation
  const handleSaveValuation = () => {
    // In a real app, this would update the asset valuation in the database
    // For this demo, we'll just close the dialog
    setDialogOpen(false)
  }

  return (
    <Grid container spacing={6}>
      {/* Valuation Summary Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Asset Valuation Overview" 
            subheader="Track and manage asset valuations"
            action={
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<i className="ri-add-line" />}
              >
                New Valuation Report
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="valuation tabs">
                <Tab label="Asset Valuations" id="valuation-tab-0" aria-controls="valuation-tabpanel-0" />
                <Tab label="Valuation Reports" id="valuation-tab-1" aria-controls="valuation-tabpanel-1" />
                <Tab label="Valuation History" id="valuation-tab-2" aria-controls="valuation-tabpanel-2" />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              {/* Filters */}
              <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="Search Assets"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  size="small"
                  sx={{ minWidth: '250px' }}
                  InputProps={{
                    startAdornment: <i className="ri-search-line" style={{ marginRight: '8px' }}></i>
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
                      <MenuItem key={category.value} value={category.value}>{category.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl sx={{ minWidth: '150px' }} size="small">
                  <InputLabel id="status-filter-label">Valuation Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    label="Valuation Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {valuationStatuses.map(status => (
                      <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
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
                  Reset Filters
                </Button>
              </Box>
              
              {/* Summary Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Total Book Value</Typography>
                      <Typography variant="h5" sx={{ my: 1 }}>{formatCurrency(totalBookValue)}</Typography>
                      <Typography variant="body2">Based on depreciated values</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Total Market Value</Typography>
                      <Typography variant="h5" sx={{ my: 1 }}>{formatCurrency(totalMarketValue)}</Typography>
                      <Typography variant="body2">Based on current valuations</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Value Difference</Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          my: 1, 
                          color: valueDifference >= 0 ? 'success.main' : 'error.main' 
                        }}
                      >
                        {valueDifference >= 0 ? '+' : ''}{formatCurrency(valueDifference)}
                      </Typography>
                      <Typography variant="body2">
                        {valueDifference >= 0 ? 'Appreciation' : 'Depreciation'} in value
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Percentage Difference</Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          my: 1, 
                          color: percentageDifference >= 0 ? 'success.main' : 'error.main' 
                        }}
                      >
                        {percentageDifference >= 0 ? '+' : ''}{percentageDifference.toFixed(2)}%
                      </Typography>
                      <Typography variant="body2">
                        Compared to book value
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Valuation Table */}
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="valuation table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Purchase Value</TableCell>
                      <TableCell align="right">Book Value</TableCell>
                      <TableCell align="right">Market Value</TableCell>
                      <TableCell>Last Valuation</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <Typography variant="body2">{asset.assetName}</Typography>
                          <Typography variant="caption" color="text.secondary">{asset.assetCode}</Typography>
                        </TableCell>
                        <TableCell>{asset.categoryName}</TableCell>
                        <TableCell align="right">{formatCurrency(asset.purchaseValue)}</TableCell>
                        <TableCell align="right">{formatCurrency(asset.currentBookValue)}</TableCell>
                        <TableCell align="right">{formatCurrency(asset.marketValue)}</TableCell>
                        <TableCell>{asset.lastValuationDate}</TableCell>
                        <TableCell>{asset.valuationMethod}</TableCell>
                        <TableCell>
                          <Chip 
                            label={asset.valuationStatus} 
                            color={
                              asset.valuationStatus === 'CURRENT' ? 'success' : 
                              asset.valuationStatus === 'OUTDATED' ? 'warning' : 'info'
                            } 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <IconButton 
                              color="primary" 
                              size="small"
                              onClick={() => handleValuationDialogOpen(asset)}
                              title="Update Valuation"
                            >
                              <i className="ri-money-dollar-circle-line"></i>
                            </IconButton>
                            <IconButton 
                              color="info" 
                              size="small"
                              title="View History"
                            >
                              <i className="ri-history-line"></i>
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">Valuation Reports</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  This section will display valuation reports and summaries.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 3 }}
                  startIcon={<i className="ri-file-chart-line"></i>}
                >
                  Generate New Report
                </Button>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">Valuation History</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  This section will display historical valuation data and trends.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 3 }}
                  startIcon={<i className="ri-line-chart-line"></i>}
                >
                  View Trends
                </Button>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Valuation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Asset Valuation</DialogTitle>
        <DialogContent>
          {selectedAsset && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1">{selectedAsset.assetName}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedAsset.assetCode} - {selectedAsset.categoryName}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Current Book Value"
                    value={formatCurrency(selectedAsset.currentBookValue)}
                    fullWidth
                    disabled
                    InputProps={{
                      startAdornment: <span style={{ marginRight: '4px' }}></span>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Previous Market Value"
                    value={formatCurrency(selectedAsset.marketValue)}
                    fullWidth
                    disabled
                    InputProps={{
                      startAdornment: <span style={{ marginRight: '4px' }}></span>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="New Market Value"
                    value={newMarketValue}
                    onChange={(e) => setNewMarketValue(e.target.value)}
                    fullWidth
                    required
                    type="number"
                    InputProps={{
                      startAdornment: <span style={{ marginRight: '4px' }}></span>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="valuation-method-label">Valuation Method</InputLabel>
                    <Select
                      labelId="valuation-method-label"
                      value={valuationMethod}
                      onChange={handleValuationMethodChange}
                      label="Valuation Method"
                    >
                      {valuationMethods.map(method => (
                        <MenuItem key={method.value} value={method.value}>{method.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Valuation Notes"
                    value={valuationNotes}
                    onChange={(e) => setValuationNotes(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveValuation} color="primary" variant="contained">
            Save Valuation
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ValuationPage
