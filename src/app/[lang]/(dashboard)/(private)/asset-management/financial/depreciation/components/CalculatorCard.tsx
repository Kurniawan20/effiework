'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Form Imports
import { useForm, Controller } from 'react-hook-form'

const depreciationMethods = [
  {
    value: 'straight-line',
    label: 'Straight Line',
    description: 'Equal depreciation amount each year'
  },
  {
    value: 'reducing-balance',
    label: 'Reducing Balance',
    description: 'Depreciation based on current book value'
  },
  {
    value: 'sum-of-years',
    label: 'Sum of Years',
    description: 'Accelerated depreciation method'
  }
]

const assetCategories = [
  { id: 1, name: 'Kitchen Equipment' },
  { id: 2, name: 'Dining Furniture' },
  { id: 3, name: 'Refrigeration Units' },
  { id: 4, name: 'POS Systems' },
  { id: 5, name: 'Service Equipment' }
]

const locations = [
  { id: 1, name: 'Main Kitchen' },
  { id: 2, name: 'Dining Area' },
  { id: 3, name: 'Bar Area' },
  { id: 4, name: 'Storage Room' },
  { id: 5, name: 'Outdoor Seating' }
]

const departments = [
  { id: 1, name: 'Kitchen Operations' },
  { id: 2, name: 'Front of House' },
  { id: 3, name: 'Bar Service' },
  { id: 4, name: 'Maintenance' },
  { id: 5, name: 'Management' }
]

interface CalculatorFormData {
  assetCost: number
  salvageValue: number
  usefulLife: number
  depreciationMethod: string
  assetCategory: string
  location: string
  department: string
}

const CalculatorCard = () => {
  // States
  const [result, setResult] = useState<number | null>(null)

  // Form Hook
  const { control, handleSubmit } = useForm<CalculatorFormData>({
    defaultValues: {
      assetCost: 0,
      salvageValue: 0,
      usefulLife: 5,
      depreciationMethod: 'straight-line',
      assetCategory: '',
      location: '',
      department: ''
    }
  })

  const calculateDepreciation = (data: CalculatorFormData) => {
    let annualDepreciation = 0

    switch (data.depreciationMethod) {
      case 'straight-line':
        annualDepreciation = (data.assetCost - data.salvageValue) / data.usefulLife
        break
      case 'reducing-balance':
        const rate = 1 - Math.pow(data.salvageValue / data.assetCost, 1 / data.usefulLife)
        annualDepreciation = data.assetCost * rate
        break
      case 'sum-of-years':
        const sumOfYears = (data.usefulLife * (data.usefulLife + 1)) / 2
        annualDepreciation = ((data.assetCost - data.salvageValue) * data.usefulLife) / sumOfYears
        break
    }

    setResult(annualDepreciation)
  }

  return (
    <Card>
      <CardHeader title="Depreciation Calculator" subheader="Calculate asset depreciation using different methods" />
      <CardContent>
        <form onSubmit={handleSubmit(calculateDepreciation)}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Controller
                name="depreciationMethod"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Depreciation Method"
                    helperText="Select the method of depreciation calculation"
                  >
                    {depreciationMethods.map(method => (
                      <MenuItem key={method.value} value={method.value}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="assetCost"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Asset Cost"
                    helperText="Initial cost of the asset"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="salvageValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Salvage Value"
                    helperText="Estimated value at end of useful life"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="usefulLife"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Useful Life (Years)"
                    helperText="Expected useful life of the asset"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="assetCategory"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Asset Category"
                    helperText="Select the category of the asset"
                  >
                    {assetCategories.map(category => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Location"
                    helperText="Select the location of the asset"
                  >
                    {locations.map(location => (
                      <MenuItem key={location.id} value={location.name}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Department"
                    helperText="Select the department responsible for the asset"
                  >
                    {departments.map(department => (
                      <MenuItem key={department.id} value={department.name}>
                        {department.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Calculate
              </Button>
            </Grid>
          </Grid>
        </form>

        {result !== null && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>
            <Typography>
              Annual Depreciation: ${result.toFixed(2)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default CalculatorCard
