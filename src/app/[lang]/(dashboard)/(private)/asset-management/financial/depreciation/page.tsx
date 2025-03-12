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

// Form Imports
import { useForm } from 'react-hook-form'

// Custom Components
import CalculatorCard from './components/CalculatorCard'
import AssetValueChart from './components/AssetValueChart'

// Dummy Data
const assetDepreciationData = [
  {
    id: 1,
    assetName: 'Commercial Udon Noodle Machine',
    purchaseDate: '2024-01-15',
    purchaseValue: 150000000,
    currentValue: 135000000,
    depreciationMethod: 'Straight Line',
    yearlyRate: 20
  },
  {
    id: 2,
    assetName: 'Industrial Refrigeration Unit',
    purchaseDate: '2023-06-01',
    purchaseValue: 120000000,
    currentValue: 102000000,
    depreciationMethod: 'Reducing Balance',
    yearlyRate: 15
  },
  {
    id: 3,
    assetName: 'Tempura Fryer Station',
    purchaseDate: '2023-08-15',
    purchaseValue: 85000000,
    currentValue: 76500000,
    depreciationMethod: 'Straight Line',
    yearlyRate: 10
  },
  {
    id: 4,
    assetName: 'Japanese Style Dining Furniture Set',
    purchaseDate: '2023-12-01',
    purchaseValue: 180000000,
    currentValue: 162000000,
    depreciationMethod: 'Reducing Balance',
    yearlyRate: 20
  }
]

// Function to format currency in IDR
const formatCurrency = (amount: number) => {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

const DepreciationPage = () => {
  // States
  const [selectedAsset, setSelectedAsset] = useState(null)

  return (
    <Grid container spacing={6}>
      {/* Depreciation Summary Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Asset Depreciation Overview" 
            subheader="Track and manage asset depreciation"
            action={
              <Button variant="contained" color="primary">
                Calculate Depreciation
              </Button>
            }
          />
          <CardContent>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="depreciation table">
                <TableHead>
                  <TableRow>
                    <TableCell>Asset Name</TableCell>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell align="right">Purchase Value (Rp)</TableCell>
                    <TableCell align="right">Current Value (Rp)</TableCell>
                    <TableCell>Depreciation Method</TableCell>
                    <TableCell align="right">Yearly Rate (%)</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assetDepreciationData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.assetName}
                      </TableCell>
                      <TableCell>{row.purchaseDate}</TableCell>
                      <TableCell align="right">{formatCurrency(row.purchaseValue)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.currentValue)}</TableCell>
                      <TableCell>{row.depreciationMethod}</TableCell>
                      <TableCell align="right">{row.yearlyRate}%</TableCell>
                      <TableCell align="center">
                        <Button 
                          size="small" 
                          onClick={() => setSelectedAsset(row)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Depreciation Calculator */}
      <Grid item xs={12} md={6}>
        <CalculatorCard />
      </Grid>

      {/* Value Over Time Chart */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Asset Value Over Time" />
          <CardContent>
            <AssetValueChart />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DepreciationPage
