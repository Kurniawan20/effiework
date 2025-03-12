'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// Use relative path to avoid import issues
const Icon = ({ icon, fontSize, color }: { icon: string; fontSize?: number | string; color?: string }) => (
  <i className={icon} style={{ fontSize, color }} />
)

// Custom Components
import DocumentList from './components/DocumentList'
import CategoryList from './components/CategoryList'
import UploadDocumentDialog from './components/UploadDocumentDialog'

// Types
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
      id={`knowledge-tabpanel-${index}`}
      aria-labelledby={`knowledge-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  )
}

const KnowledgeBasePage = () => {
  // States
  const [tabValue, setTabValue] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false)

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true)
  }

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false)
  }

  return (
    <Grid container spacing={6}>
      {/* Knowledge Base Header */}
      <Grid item xs={12}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant='h4' sx={{ mb: 2 }}>
              Knowledge Base
            </Typography>
            <Typography variant='body1' sx={{ mb: 4 }}>
              Menyimpan informasi dan dokumentasi penting dalam satu tempat, memudahkan akses bagi karyawan dan meningkatkan efisiensi operasional.
            </Typography>
            
            {/* Search and Upload Controls */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 2, 
              mb: 4,
              alignItems: { xs: 'stretch', sm: 'center' }
            }}>
              <TextField
                fullWidth
                placeholder='Cari dokumen, panduan, atau informasi...'
                value={searchQuery}
                onChange={handleSearchChange}
                size="medium"
                sx={{ 
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    height: '48px'
                  } 
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='mdi:magnify' fontSize={20} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => setSearchQuery('')} size="small">
                        <Icon icon='mdi:close' fontSize={18} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button 
                variant='contained' 
                color='primary' 
                onClick={handleOpenUploadDialog} 
                startIcon={<Icon icon='mdi:upload' />}
                sx={{ 
                  minWidth: '180px',
                  height: '48px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  boxShadow: 2
                }}
              >
                Unggah Dokumen
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Knowledge Base Content */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Pusat Dokumentasi'
            subheader='Akses semua dokumen dan panduan penting'
            sx={{
              '& .MuiCardHeader-title': {
                fontWeight: 600
              }
            }}
          />
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider', 
              backgroundColor: theme => theme.palette.action.hover,
              px: 4
            }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label='knowledge base tabs'
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 48,
                  '& .MuiTab-root': {
                    minHeight: 48,
                    fontWeight: 500
                  }
                }}
              >
                <Tab label='Semua Dokumen' />
                <Tab label='Kategori' />
                <Tab label='Terbaru' />
                <Tab label='Populer' />
              </Tabs>
            </Box>
            
            <Box sx={{ p: 4 }}>
              <TabPanel value={tabValue} index={0}>
                <DocumentList searchQuery={searchQuery} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <CategoryList />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <DocumentList filter='recent' searchQuery={searchQuery} />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <DocumentList filter='popular' searchQuery={searchQuery} />
              </TabPanel>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Upload Document Dialog */}
      <UploadDocumentDialog open={openUploadDialog} onClose={handleCloseUploadDialog} />
    </Grid>
  )
}

export default KnowledgeBasePage
