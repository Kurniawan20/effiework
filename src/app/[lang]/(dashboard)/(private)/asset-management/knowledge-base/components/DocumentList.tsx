'use client'

// React Imports
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Pagination from '@mui/material/Pagination'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

// Define inline Icon component to avoid import errors
const Icon = ({ icon, fontSize, color }: { icon: string; fontSize?: number | string; color?: string }) => (
  <i className={icon} style={{ fontSize, color }} />
)

// Types
interface Document {
  id: number
  title: string
  description: string
  fileType: string
  category: string
  uploadDate: string
  uploadedBy: string
  views: number
  downloads: number
  fileSize: string
  tags: string[]
}

interface DocumentListProps {
  filter?: 'recent' | 'popular'
  searchQuery?: string
}

// Dummy Data
const documents: Document[] = [
  {
    id: 1,
    title: 'Panduan Penggunaan Mesin Udon',
    description: 'Dokumen ini berisi panduan lengkap tentang cara mengoperasikan dan merawat mesin pembuat udon di dapur utama.',
    fileType: 'pdf',
    category: 'Peralatan Dapur',
    uploadDate: '2025-01-15',
    uploadedBy: 'Budi Santoso',
    views: 156,
    downloads: 78,
    fileSize: '4.2 MB',
    tags: ['mesin', 'udon', 'panduan', 'operasional']
  },
  {
    id: 2,
    title: 'SOP Pembersihan Area Makan',
    description: 'Standar Operasional Prosedur untuk pembersihan dan sanitasi area makan restoran Marugamen Udon.',
    fileType: 'docx',
    category: 'Kebersihan',
    uploadDate: '2025-02-03',
    uploadedBy: 'Dewi Anggraini',
    views: 245,
    downloads: 112,
    fileSize: '1.8 MB',
    tags: ['sop', 'kebersihan', 'sanitasi', 'area makan']
  },
  {
    id: 3,
    title: 'Checklist Inspeksi Peralatan Dapur',
    description: 'Form checklist untuk inspeksi rutin peralatan dapur untuk memastikan semua peralatan berfungsi dengan baik.',
    fileType: 'xlsx',
    category: 'Peralatan Dapur',
    uploadDate: '2025-02-10',
    uploadedBy: 'Ahmad Rizki',
    views: 98,
    downloads: 45,
    fileSize: '980 KB',
    tags: ['checklist', 'inspeksi', 'peralatan', 'dapur']
  },
  {
    id: 4,
    title: 'Manual Penggunaan Sistem POS',
    description: 'Panduan lengkap tentang cara menggunakan sistem Point of Sale (POS) untuk kasir dan manajer.',
    fileType: 'pdf',
    category: 'Sistem IT',
    uploadDate: '2025-01-28',
    uploadedBy: 'Siti Nurhayati',
    views: 312,
    downloads: 156,
    fileSize: '5.6 MB',
    tags: ['pos', 'sistem', 'kasir', 'panduan']
  },
  {
    id: 5,
    title: 'Prosedur Penanganan Keluhan Pelanggan',
    description: 'Dokumen yang menjelaskan langkah-langkah standar dalam menangani keluhan pelanggan dengan efektif.',
    fileType: 'pdf',
    category: 'Layanan Pelanggan',
    uploadDate: '2025-02-15',
    uploadedBy: 'Rini Wijaya',
    views: 187,
    downloads: 93,
    fileSize: '2.3 MB',
    tags: ['keluhan', 'pelanggan', 'layanan', 'prosedur']
  },
  {
    id: 6,
    title: 'Jadwal Pemeliharaan Peralatan Dapur',
    description: 'Jadwal rutin untuk pemeliharaan preventif semua peralatan dapur untuk memastikan operasional yang lancar.',
    fileType: 'xlsx',
    category: 'Peralatan Dapur',
    uploadDate: '2025-01-20',
    uploadedBy: 'Budi Santoso',
    views: 134,
    downloads: 67,
    fileSize: '1.2 MB',
    tags: ['jadwal', 'pemeliharaan', 'peralatan', 'dapur']
  },
  {
    id: 7,
    title: 'Resep Standar Menu Marugamen Udon',
    description: 'Dokumen rahasia yang berisi resep standar untuk semua menu yang disajikan di Marugamen Udon.',
    fileType: 'docx',
    category: 'Menu & Resep',
    uploadDate: '2025-01-05',
    uploadedBy: 'Chef Hendra',
    views: 423,
    downloads: 210,
    fileSize: '8.7 MB',
    tags: ['resep', 'menu', 'standar', 'udon']
  },
  {
    id: 8,
    title: 'Panduan Pelatihan Karyawan Baru',
    description: 'Materi pelatihan komprehensif untuk karyawan baru yang bergabung dengan tim Marugamen Udon.',
    fileType: 'pptx',
    category: 'SDM',
    uploadDate: '2025-02-08',
    uploadedBy: 'Maya Putri',
    views: 276,
    downloads: 142,
    fileSize: '6.5 MB',
    tags: ['pelatihan', 'karyawan', 'sdm', 'orientasi']
  }
]

const DocumentList = ({ filter, searchQuery = '' }: DocumentListProps) => {
  // States
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [openPreviewDialog, setOpenPreviewDialog] = useState<boolean>(false)
  const itemsPerPage = 6
  const router = useRouter()

  // Filter documents based on props
  let filteredDocuments = [...documents]
  
  if (filter === 'recent') {
    filteredDocuments.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
  } else if (filter === 'popular') {
    filteredDocuments.sort((a, b) => b.views - a.views)
  }
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    
    filteredDocuments = filteredDocuments.filter(doc => 
      doc.title.toLowerCase().includes(query) || 
      doc.description.toLowerCase().includes(query) || 
      doc.category.toLowerCase().includes(query) || 
      doc.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage)
  const displayedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, document: Document) => {
    setAnchorEl(event.currentTarget)
    setSelectedDocument(document)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  const handleOpenPreview = () => {
    setOpenPreviewDialog(true)
    handleMenuClose()
  }

  const handleClosePreview = () => {
    setOpenPreviewDialog(false)
  }

  const handleViewDetails = () => {
    if (selectedDocument) {
      router.push(`/asset-management/knowledge-base/${selectedDocument.id}`)
    }
    handleMenuClose()
  }

  const handleDownload = () => {
    // In a real app, this would trigger a download
    console.log(`Downloading document: ${selectedDocument?.title}`)
    handleMenuClose()
  }

  // File type icon mapping
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'mdi:file-pdf-box'
      case 'docx':
        return 'mdi:file-word'
      case 'xlsx':
        return 'mdi:file-excel'
      case 'pptx':
        return 'mdi:file-powerpoint'
      default:
        return 'mdi:file-document-outline'
    }
  }

  return (
    <Box>
      {displayedDocuments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Icon icon='mdi:file-search-outline' fontSize={60} color='#9155FD' />
          <Typography variant='h6' sx={{ mt: 2 }}>
            Tidak ada dokumen yang ditemukan
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Coba gunakan kata kunci lain atau hapus filter pencarian
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {displayedDocuments.map(document => (
            <Grid item xs={12} sm={6} md={4} key={document.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    cursor: 'pointer'
                  }
                }}
                onClick={() => router.push(`/asset-management/knowledge-base/${document.id}`)}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: 'background.default'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon icon={getFileIcon(document.fileType)} fontSize={30} color='primary' />
                    <Typography variant='subtitle2' sx={{ ml: 1 }}>
                      {document.fileType.toUpperCase()}
                    </Typography>
                  </Box>
                  <IconButton 
                    size='small' 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      handleMenuOpen(e, document);
                    }}
                    aria-label='more options'
                  >
                    <Icon icon='mdi:dots-vertical' />
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h6' gutterBottom>
                    {document.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    {document.description.length > 120 
                      ? `${document.description.substring(0, 120)}...` 
                      : document.description}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Chip 
                      label={document.category} 
                      size='small' 
                      color='primary' 
                      variant='outlined' 
                      sx={{ mr: 1, mb: 1 }} 
                    />
                    {document.tags.slice(0, 2).map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size='small' 
                        variant='outlined' 
                        sx={{ mr: 1, mb: 1 }} 
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant='caption' color='text.secondary'>
                      <Icon icon='mdi:eye-outline' fontSize='small' /> {document.views}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      <Icon icon='mdi:download-outline' fontSize='small' /> {document.downloads}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {document.fileSize}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            color='primary' 
          />
        </Box>
      )}

      {/* Document Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenPreview}>
          <ListItemIcon>
            <Icon icon='mdi:eye-outline' fontSize={20} />
          </ListItemIcon>
          <ListItemText primary='Pratinjau' />
        </MenuItem>
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <Icon icon='mdi:file-document-outline' fontSize={20} />
          </ListItemIcon>
          <ListItemText primary='Lihat Detail' />
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <Icon icon='mdi:download-outline' fontSize={20} />
          </ListItemIcon>
          <ListItemText primary='Unduh' />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Icon icon='mdi:share-variant-outline' fontSize={20} />
          </ListItemIcon>
          <ListItemText primary='Bagikan' />
        </MenuItem>
      </Menu>

      {/* Document Preview Dialog */}
      <Dialog
        open={openPreviewDialog}
        onClose={handleClosePreview}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          {selectedDocument?.title}
          <IconButton
            aria-label='close'
            onClick={handleClosePreview}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 2 }}>
            <Typography variant='body1' paragraph>
              {selectedDocument?.description}
            </Typography>
            <Box sx={{ backgroundColor: 'background.default', p: 4, borderRadius: 1, textAlign: 'center', mb: 4 }}>
              <Icon icon={getFileIcon(selectedDocument?.fileType || 'pdf')} fontSize={60} color='primary' />
              <Typography variant='body2' sx={{ mt: 2 }}>
                Pratinjau dokumen tidak tersedia. Silakan unduh dokumen untuk melihat konten lengkap.
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2'>Kategori:</Typography>
                <Typography variant='body2' color='text.secondary' paragraph>
                  {selectedDocument?.category}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2'>Ukuran File:</Typography>
                <Typography variant='body2' color='text.secondary' paragraph>
                  {selectedDocument?.fileSize}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2'>Tanggal Unggah:</Typography>
                <Typography variant='body2' color='text.secondary' paragraph>
                  {selectedDocument?.uploadDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2'>Diunggah Oleh:</Typography>
                <Typography variant='body2' color='text.secondary' paragraph>
                  {selectedDocument?.uploadedBy}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle2'>Tags:</Typography>
                <Box sx={{ mt: 1 }}>
                  {selectedDocument?.tags.map((tag, index) => (
                    <Chip 
                      key={index} 
                      label={tag} 
                      size='small' 
                      variant='outlined' 
                      sx={{ mr: 1, mb: 1 }} 
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Tutup</Button>
          <Button 
            variant='contained' 
            startIcon={<Icon icon='mdi:download-outline' />}
            onClick={() => {
              handleDownload()
              handleClosePreview()
            }}
          >
            Unduh
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DocumentList
