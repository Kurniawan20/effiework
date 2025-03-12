'use client'

import { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

// MUI Components
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography
} from '@mui/material'

// Types
import type { Branch } from '@/types/assets'

// API
import { branchApi } from '@/utils/api'


const BranchDetailsPage = () => {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()

  // State for branch data
  const [branch, setBranch] = useState<Branch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get branch ID from URL params
  const branchId = params?.id ? Number(params.id) : null

  // Fetch branch details
  useEffect(() => {
    const fetchBranchDetails = async () => {
      if (!branchId) return

      try {
        setLoading(true)
        const data = await branchApi.getBranchById(branchId)
        setBranch(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching branch details:', err)
        setError('Failed to load branch details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.token && branchId) {
      fetchBranchDetails()
    }
  }, [session?.user?.token, branchId])

  // Handle edit branch
  const handleEditBranch = () => {
    // Navigate to edit branch page or open edit dialog
    console.log('Edit branch', branchId)
  }

  // Handle back to list
  const handleBackToList = () => {
    router.push(`/${params?.lang}/branch-management`)
  }

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBackToList} sx={{ mr: 2 }}>
            <i className="ri-arrow-left-line" />
          </IconButton>
          <Skeleton variant="text" width={300} height={40} />
        </Box>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {[...Array(8)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Skeleton variant="text" width={150} height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={40} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    )
  }

  // Render error state
  if (error || !branch) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBackToList} sx={{ mr: 2 }}>
            <i className="ri-arrow-left-line" />
          </IconButton>
          <Typography variant="h4">Branch Details</Typography>
        </Box>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Branch not found'}
          </Alert>
          <Button
            variant="outlined"
            onClick={handleBackToList}
            startIcon={<i className="ri-arrow-left-line" />}
          >
            Back to Branch List
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with back button and actions */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBackToList} sx={{ mr: 2 }}>
            <i className="ri-arrow-left-line" />
          </IconButton>
          <Typography variant="h4">
            {branch.name}
            <Chip
              label={branch.isActive ? 'Active' : 'Inactive'}
              color={branch.isActive ? 'success' : 'default'}
              size="small"
              sx={{ ml: 2, verticalAlign: 'middle' }}
            />
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<i className="ri-edit-line" />}
          onClick={handleEditBranch}
        >
          Edit Branch
        </Button>
      </Box>

      {/* Branch details card */}
      <Paper>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>Branch Information</Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">Branch Code</Typography>
                  <Typography variant="body1">{branch.code}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">Branch Name</Typography>
                  <Typography variant="body1">{branch.name}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                  <Typography variant="body1">{branch.address}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Contact Information</Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">Contact Person</Typography>
                  <Typography variant="body1">{branch.contactPerson}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">
                    <a href={`mailto:${branch.contactEmail}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {branch.contactEmail}
                    </a>
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">
                    <a href={`tel:${branch.contactPhone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {branch.contactPhone}
                    </a>
                  </Typography>
                </Stack>
              </Grid>

              {branch.notes && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                      <Typography variant="body1">{branch.notes}</Typography>
                    </Stack>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                  <Typography variant="body1">
                    {new Date(branch.createdAt).toLocaleString()}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body1">
                    {new Date(branch.updatedAt).toLocaleString()}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default BranchDetailsPage
