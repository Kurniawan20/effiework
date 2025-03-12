'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

// Icon Imports
import Icon from '@/components/icon'

// Types
interface Category {
  id: number
  name: string
  icon: string
  color: string
  description: string
  documentCount: number
  totalSize: string
}

// Dummy Data
const categories: Category[] = [
  {
    id: 1,
    name: 'Peralatan Dapur',
    icon: 'mdi:pot-steam-outline',
    color: '#9155FD',
    description: 'Dokumentasi tentang peralatan dapur, manual penggunaan, dan panduan pemeliharaan',
    documentCount: 24,
    totalSize: '56.8 MB'
  },
  {
    id: 2,
    name: 'Kebersihan',
    icon: 'mdi:cleaning',
    color: '#56CA00',
    description: 'SOP kebersihan, jadwal pembersihan, dan panduan sanitasi',
    documentCount: 18,
    totalSize: '32.5 MB'
  },
  {
    id: 3,
    name: 'Sistem IT',
    icon: 'mdi:desktop-tower-monitor',
    color: '#16B1FF',
    description: 'Dokumentasi sistem POS, panduan penggunaan software, dan troubleshooting',
    documentCount: 15,
    totalSize: '45.2 MB'
  },
  {
    id: 4,
    name: 'Layanan Pelanggan',
    icon: 'mdi:account-supervisor',
    color: '#FFB400',
    description: 'Panduan layanan pelanggan, penanganan keluhan, dan standar pelayanan',
    documentCount: 12,
    totalSize: '28.7 MB'
  },
  {
    id: 5,
    name: 'Menu & Resep',
    icon: 'mdi:book-open-page-variant',
    color: '#FF4C51',
    description: 'Resep standar, panduan penyajian, dan informasi menu',
    documentCount: 30,
    totalSize: '78.3 MB'
  },
  {
    id: 6,
    name: 'SDM',
    icon: 'mdi:account-group',
    color: '#32BAFF',
    description: 'Dokumen SDM, panduan pelatihan, dan materi orientasi karyawan',
    documentCount: 22,
    totalSize: '48.6 MB'
  },
  {
    id: 7,
    name: 'Keuangan',
    icon: 'mdi:cash-multiple',
    color: '#20C997',
    description: 'Laporan keuangan, prosedur pengelolaan kas, dan panduan anggaran',
    documentCount: 16,
    totalSize: '35.9 MB'
  },
  {
    id: 8,
    name: 'Keselamatan',
    icon: 'mdi:shield-check',
    color: '#F44336',
    description: 'Prosedur keselamatan, panduan K3, dan rencana evakuasi darurat',
    documentCount: 10,
    totalSize: '22.4 MB'
  }
]

const CategoryList = () => {
  // Get max document count for progress bar scaling
  const maxDocumentCount = Math.max(...categories.map(category => category.documentCount))

  return (
    <Grid container spacing={4}>
      {categories.map(category => (
        <Grid item xs={12} sm={6} md={4} key={category.id}>
          <Card 
            sx={{ 
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
                cursor: 'pointer'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                    mr: 2
                  }}
                >
                  <Icon icon={category.icon} fontSize={24} />
                </Box>
                <Box>
                  <Typography variant='h6'>{category.name}</Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {category.documentCount} dokumen
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3, minHeight: 60 }}>
                {category.description}
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant='caption' color='text.secondary'>
                    {category.documentCount} dari {maxDocumentCount} dokumen
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {Math.round((category.documentCount / maxDocumentCount) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant='determinate' 
                  value={(category.documentCount / maxDocumentCount) * 100} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 5,
                    backgroundColor: `${category.color}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: category.color
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant='caption' color='text.secondary'>
                  Total Ukuran
                </Typography>
                <Typography variant='caption' fontWeight='bold'>
                  {category.totalSize}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default CategoryList
