'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import LinearProgress from '@mui/material/LinearProgress'

// Custom Components
import BudgetAllocationChart from './components/BudgetAllocationChart'
import BudgetTable from './components/BudgetTable'

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
      id={`budget-tabpanel-${index}`}
      aria-labelledby={`budget-tab-${index}`}
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

const BudgetPage = () => {
  // States
  const [tabValue, setTabValue] = useState<number>(0)
  
  // Dummy Budget Data
  const budgetSummary = {
    totalBudget: 500000000,
    budgetSpent: 325000000,
    budgetRemaining: 175000000,
    utilizationPercentage: 65
  }

  // Function to format currency in IDR
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  // Handle Tab Change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Grid container spacing={6}>
      {/* Budget Summary Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Budget Management" 
            subheader="Plan, track, and manage asset budgets"
            action={
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<i className="ri-add-line" />}
              >
                Create Budget
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="budget tabs">
                <Tab label="Budget Overview" id="budget-tab-0" aria-controls="budget-tabpanel-0" />
                <Tab label="Budget Planning" id="budget-tab-1" aria-controls="budget-tabpanel-1" />
                <Tab label="Budget History" id="budget-tab-2" aria-controls="budget-tabpanel-2" />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              {/* Budget Overview Content */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Total Budget</Typography>
                      <Typography variant="h5" sx={{ my: 1 }}>{formatCurrency(budgetSummary.totalBudget)}</Typography>
                      <Typography variant="body2">Fiscal Year 2025</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Budget Spent</Typography>
                      <Typography variant="h5" sx={{ my: 1 }}>{formatCurrency(budgetSummary.budgetSpent)}</Typography>
                      <Typography variant="body2">{budgetSummary.utilizationPercentage}% of total budget</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Budget Remaining</Typography>
                      <Typography variant="h5" sx={{ my: 1 }}>{formatCurrency(budgetSummary.budgetRemaining)}</Typography>
                      <Typography variant="body2">{100 - budgetSummary.utilizationPercentage}% of total budget</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Budget Utilization</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>
                        <Typography variant="h5">{budgetSummary.utilizationPercentage}%</Typography>
                        <Typography 
                          variant="body2" 
                          color={budgetSummary.utilizationPercentage > 90 ? 'error.main' : 'success.main'}
                        >
                          {budgetSummary.utilizationPercentage > 90 ? 'High' : 'Normal'}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={budgetSummary.utilizationPercentage} 
                        color={budgetSummary.utilizationPercentage > 90 ? 'error' : 'primary'}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Budget Allocation Chart */}
              <Grid container spacing={6} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Budget Allocation by Category" />
                    <CardContent>
                      <BudgetAllocationChart />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Budget Table */}
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Budget Items" />
                    <CardContent>
                      <BudgetTable />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6">Budget Planning</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  This section will include budget planning tools, allocation forms, and approval workflows.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 3 }}
                  startIcon={<i className="ri-calendar-line"></i>}
                >
                  Start Budget Planning
                </Button>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6">Budget History</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  This section will display historical budget data, trends, and forecasting.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 3 }}
                  startIcon={<i className="ri-history-line"></i>}
                >
                  View Historical Data
                </Button>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default BudgetPage
