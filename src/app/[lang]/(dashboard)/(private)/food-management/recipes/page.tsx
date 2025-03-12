'use client'

import { useState } from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

const RecipeBuilder = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Recipe Builder" 
            action={
              <Chip color="primary" label="Advanced Feature" size="small" />
            }
          />
          <CardContent>
            <Typography sx={{ mb: 4 }}>
              This advanced feature will allow creating and managing detailed recipes for menu items including:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography>Linking ingredients to menu items with exact quantities</Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography>Adding preparation steps and cooking instructions</Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography>Calculating food costs based on ingredient usage</Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography>Scaling recipes for different portion sizes</Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography>Tracking nutritional information</Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography>Managing recipe versions and variations</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default RecipeBuilder
