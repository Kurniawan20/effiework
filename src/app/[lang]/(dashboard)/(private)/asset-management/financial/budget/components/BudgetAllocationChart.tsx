'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'

// Dummy Data
const budgetAllocationData = [
  {
    category: 'Kitchen Equipment',
    allocated: 150000000,
    spent: 120000000,
    color: '#9155FD'
  },
  {
    category: 'Dining Furniture',
    allocated: 80000000,
    spent: 65000000,
    color: '#56CA00'
  },
  {
    category: 'Food Inventory',
    allocated: 120000000,
    spent: 105000000,
    color: '#FFB400'
  },
  {
    category: 'Restaurant Renovation',
    allocated: 200000000,
    spent: 180000000,
    color: '#16B1FF'
  }
]

// Function to format currency in IDR
const formatCurrency = (amount: number) => {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

const BudgetAllocationChart = () => {
  // State to ensure client-side rendering
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Loading budget allocation data...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: '400px', overflow: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Budget Allocation by Category
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Breakdown of budget allocation and spending across different categories
            </Typography>
          </Box>
        </Grid>
        
        {budgetAllocationData.map((item, index) => {
          const percentSpent = Math.round((item.spent / item.allocated) * 100)
          
          return (
            <Grid item xs={12} key={index}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2">{item.category}</Typography>
                  <Typography variant="subtitle2">{percentSpent}% Used</Typography>
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={percentSpent} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 5,
                    mb: 1,
                    backgroundColor: `${item.color}22`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: item.color
                    }
                  }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Allocated</Typography>
                    <Typography variant="body2">{formatCurrency(item.allocated)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">Spent</Typography>
                    <Typography variant="body2">{formatCurrency(item.spent)}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default BudgetAllocationChart
