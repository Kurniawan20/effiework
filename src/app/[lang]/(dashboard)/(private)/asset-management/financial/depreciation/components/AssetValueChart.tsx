'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// Sample data for asset depreciation over time
const assetValueData = [
  { year: '2024', value: 150000000 },
  { year: '2025', value: 120000000 },
  { year: '2026', value: 96000000 },
  { year: '2027', value: 76800000 },
  { year: '2028', value: 61440000 }
]

// Function to format currency in IDR
const formatCurrency = (amount: number) => {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

const AssetValueChart = () => {
  // State to ensure client-side rendering
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Loading asset value data...</Typography>
      </Box>
    )
  }

  // Calculate the highest value for scaling
  const maxValue = Math.max(...assetValueData.map(item => item.value))
  
  return (
    <Box sx={{ height: '400px' }}>
      <Typography variant="subtitle1" gutterBottom>
        Commercial Udon Noodle Machine - Depreciation Over Time
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Showing projected asset value using straight-line depreciation method
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Initial Value</Typography>
            <Typography variant="h6">{formatCurrency(assetValueData[0].value)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Final Value (5 years)</Typography>
            <Typography variant="h6">{formatCurrency(assetValueData[assetValueData.length - 1].value)}</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '200px', mt: 4 }}>
        {assetValueData.map((item, index) => {
          const heightPercentage = (item.value / maxValue) * 100
          
          return (
            <Box 
              key={index} 
              sx={{ 
                flex: 1,
                mx: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box 
                sx={{ 
                  height: `${heightPercentage}%`, 
                  width: '100%', 
                  backgroundColor: '#9155FD',
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  minHeight: 20,
                  transition: 'height 0.5s ease-in-out'
                }} 
              />
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="caption">{item.year}</Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  {formatCurrency(item.value)}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="caption" color="text.secondary">
        * Values are calculated based on a 20% annual depreciation rate
      </Typography>
    </Box>
  )
}

export default AssetValueChart
