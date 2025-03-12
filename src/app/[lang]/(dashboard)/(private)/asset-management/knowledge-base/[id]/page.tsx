'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'

// Local Icon Component
const Icon = ({ icon, fontSize, color }: { icon: string; fontSize?: number | string; color?: string }) => (
  <i className={icon} style={{ fontSize, color }} />
)

// Type Definitions
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
  url: string
  content?: string
  relatedDocuments?: RelatedDocument[]
}

interface RelatedDocument {
  id: number
  title: string
  category: string
  fileType: string
}

// Sample Document Data
const getDocumentById = (id: string): Document => {
  return {
    id: parseInt(id),
    title: 'Panduan Penggunaan Mesin Udon',
    description: 'Dokumen ini berisi panduan lengkap tentang cara mengoperasikan dan merawat mesin pembuat udon. Termasuk langkah-langkah keamanan, prosedur pembersihan, dan pemecahan masalah umum.',
    fileType: 'pdf',
    category: 'Peralatan Dapur',
    uploadDate: '12 Mar 2025',
    uploadedBy: 'Budi Santoso',
    views: 245,
    downloads: 87,
    fileSize: '2.4 MB',
    tags: ['panduan', 'mesin', 'udon', 'peralatan', 'dapur'],
    url: '/documents/panduan-mesin-udon.pdf',
    content: `
# PANDUAN PENGGUNAAN MESIN UDON

## Daftar Isi
1. Pendahuluan
2. Komponen Utama
3. Persiapan Penggunaan
4. Prosedur Operasi
5. Pembersihan dan Perawatan
6. Pemecahan Masalah
7. Spesifikasi Teknis

## 1. Pendahuluan
Mesin Udon Model UD-2000 adalah peralatan profesional untuk membuat mie udon dengan kapasitas produksi hingga 100kg per jam. Manual ini akan memandu Anda melalui proses pengoperasikan, pembersihan, dan pemecahan masalah umum.

## 2. Komponen Utama
- Panel Kontrol
- Wadah Pengaduk Adonan
- Roller Pemipih
- Pisau Pemotong
- Conveyor Belt
- Sakelar Daya Utama
- Pengatur Kecepatan

## 3. Persiapan Penggunaan
1. Pastikan mesin dalam keadaan bersih sebelum digunakan
2. Periksa pasokan listrik (220V/50Hz)
3. Pastikan semua komponen terpasang dengan benar
4. Siapkan adonan tepung dan air dengan perbandingan sesuai resep

## 4. Prosedur Operasi
1. Hubungkan mesin ke sumber listrik
2. Nyalakan sakelar daya utama (lampu indikator akan menyala)
3. Masukkan adonan ke dalam wadah pengaduk
4. Atur kecepatan pengadukan (disarankan mulai dari kecepatan rendah)
5. Setelah adonan tercampur rata, pindahkan ke roller pemipih
6. Atur ketebalan mie sesuai kebutuhan
7. Aktifkan pisau pemotong untuk mengiris adonan menjadi mie
8. Kumpulkan mie dari conveyor belt

## 5. Pembersihan dan Perawatan
1. Matikan dan cabut steker mesin dari sumber listrik
2. Lepaskan semua bagian yang dapat dilepas
3. Bersihkan setiap komponen dengan air hangat dan detergen ringan
4. Keringkan semua komponen sebelum memasangnya kembali
5. Bersihkan bagian luar mesin dengan kain lembab
6. Lakukan pelumasan pada bagian yang bergerak setiap bulan

## 6. Pemecahan Masalah
### Mesin tidak menyala
- Periksa sambungan listrik
- Periksa sekring
- Pastikan tombol darurat tidak tertekan

### Adonan tidak tercampur dengan baik
- Pastikan rasio air dan tepung sudah benar
- Periksa pengaduk apakah terpasang dengan benar
- Coba tingkatkan kecepatan pengadukan

### Ketebalan mie tidak konsisten
- Periksa pengaturan roller
- Pastikan adonan memiliki konsistensi yang tepat
- Periksa tekanan roller

## 7. Spesifikasi Teknis
- Model: UD-2000
- Kapasitas: 100kg/jam
- Daya: 2200W
- Voltase: 220V/50Hz
- Dimensi: 120cm x 60cm x 130cm
- Berat: 145kg
- Garansi: 1 tahun

Untuk bantuan lebih lanjut, hubungi tim layanan pelanggan kami di 021-5551234.
    `,
    relatedDocuments: [
      {
        id: 2,
        title: 'Checklist Pembersihan Mesin Udon',
        category: 'Peralatan Dapur',
        fileType: 'doc'
      },
      {
        id: 3,
        title: 'Katalog Spare Part Mesin Udon',
        category: 'Peralatan Dapur',
        fileType: 'pdf'
      },
      {
        id: 4,
        title: 'SOP Penggunaan Peralatan Dapur',
        category: 'Kebersihan',
        fileType: 'pdf'
      }
    ]
  }
}

const DocumentDetail = ({ params }: { params: { id: string } }) => {
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // In a real implementation, this would be an API call
    const doc = getDocumentById(params.id)
    setDocument(doc)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Typography>Memuat dokumen...</Typography>
      </Box>
    )
  }

  if (!document) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Typography>Dokumen tidak ditemukan</Typography>
      </Box>
    )
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'mdi:file-pdf-box'
      case 'doc':
      case 'docx':
        return 'mdi:file-word'
      case 'xls':
      case 'xlsx':
        return 'mdi:file-excel'
      case 'ppt':
      case 'pptx':
        return 'mdi:file-powerpoint'
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'mdi:file-image'
      default:
        return 'mdi:file-document-outline'
    }
  }

  return (
    <Grid container spacing={6}>
      {/* Breadcrumbs */}
      <Grid item xs={12}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link href={`/asset-management/knowledge-base`} underline="hover" color="inherit">
            Knowledge Base
          </Link>
          <Link href={`/asset-management/knowledge-base?category=${document.category}`} underline="hover" color="inherit">
            {document.category}
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 'medium' }}>{document.title}</Typography>
        </Breadcrumbs>
      </Grid>

      {/* Document Header */}
      <Grid item xs={12}>
        <Card sx={{ overflow: 'visible' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              p: 6, 
              pb: 4,
              borderBottom: '1px solid',
              borderColor: 'divider',
              position: 'relative'
            }}>
              {/* Document header background */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  background: theme => `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.background.paper})`,
                  opacity: 0.05,
                  zIndex: 0
                }} 
              />

              <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                {/* Document Icon */}
                <Grid item xs={12} sm={2} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: 'primary.light',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: { xs: 3, sm: 0 },
                      boxShadow: 2
                    }}
                  >
                    <Icon icon={getFileIcon(document.fileType)} fontSize={40} color="primary.main" />
                  </Box>
                </Grid>

                {/* Document Info */}
                <Grid item xs={12} sm={10} md={8}>
                  <Typography variant="h5" gutterBottom fontWeight="600">
                    {document.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {document.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {document.tags.map((tag, index) => (
                      <Chip 
                        key={index}
                        label={tag}
                        size="small"
                        sx={{ 
                          backgroundColor: 'primary.soft', 
                          color: 'primary.main',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: 'primary.light'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<Icon icon="mdi:download" />}
                    fullWidth
                    sx={{ maxWidth: 200 }}
                  >
                    Unduh Dokumen
                  </Button>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Cetak">
                      <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <Icon icon="mdi:printer" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Bagikan">
                      <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <Icon icon="mdi:share-variant" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Tandai Favorit">
                      <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <Icon icon="mdi:star-outline" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Document Metadata */}
            <Box sx={{ 
              px: 6, 
              py: 3, 
              display: 'flex', 
              flexWrap: 'wrap', 
              borderBottom: '1px solid',
              borderColor: 'divider',
              backgroundColor: theme => theme.palette.background.default
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mr: 6, 
                mb: { xs: 2, md: 0 } 
              }}>
                <Typography variant="caption" color="text.secondary">Kategori</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Icon icon="mdi:folder-outline" fontSize={20} />
                  <Typography variant="body2" fontWeight="500" sx={{ ml: 1 }}>
                    {document.category}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mr: 6, 
                mb: { xs: 2, md: 0 } 
              }}>
                <Typography variant="caption" color="text.secondary">Diupload</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Icon icon="mdi:calendar-outline" fontSize={20} />
                  <Typography variant="body2" fontWeight="500" sx={{ ml: 1 }}>
                    {document.uploadDate}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mr: 6, 
                mb: { xs: 2, md: 0 } 
              }}>
                <Typography variant="caption" color="text.secondary">Oleh</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Avatar sx={{ width: 20, height: 20, mr: 1, fontSize: '0.75rem' }}>
                    {document.uploadedBy.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" fontWeight="500">
                    {document.uploadedBy}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mr: 6, 
                mb: { xs: 2, md: 0 } 
              }}>
                <Typography variant="caption" color="text.secondary">Ukuran</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Icon icon="mdi:file-outline" fontSize={20} />
                  <Typography variant="body2" fontWeight="500" sx={{ ml: 1 }}>
                    {document.fileSize}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mr: 6, 
                mb: { xs: 2, md: 0 } 
              }}>
                <Typography variant="caption" color="text.secondary">Dilihat</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Icon icon="mdi:eye-outline" fontSize={20} />
                  <Typography variant="body2" fontWeight="500" sx={{ ml: 1 }}>
                    {document.views}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mb: { xs: 2, md: 0 } 
              }}>
                <Typography variant="caption" color="text.secondary">Diunduh</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Icon icon="mdi:download-outline" fontSize={20} />
                  <Typography variant="body2" fontWeight="500" sx={{ ml: 1 }}>
                    {document.downloads}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Document Preview */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader 
            title="Pratinjau Dokumen" 
            sx={{
              '& .MuiCardHeader-title': {
                fontSize: '1.125rem',
                fontWeight: 600
              },
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
            action={
              <Button 
                variant="outlined" 
                startIcon={<Icon icon="mdi:open-in-new" />}
                sx={{ borderRadius: '8px' }}
              >
                Buka Lengkap
              </Button>
            }
          />
          <CardContent sx={{ p: 0 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                backgroundColor: 'background.paper', 
                maxHeight: 600, 
                overflow: 'auto',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                borderRadius: 0
              }}
            >
              {document.content && (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: document.content
                      .replace(/^# (.+)$/gm, '<h1 style="font-size: 1.8rem; margin-bottom: 1.5rem; color: #333; font-weight: 600;">$1</h1>')
                      .replace(/^## (.+)$/gm, '<h2 style="font-size: 1.5rem; margin-bottom: 1rem; margin-top: 2rem; color: #333; font-weight: 500;">$1</h2>')
                      .replace(/^###\s+(.+)$/gm, '<h3 style="font-size: 1.2rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h3>')
                      .replace(/^(\d+\.\s.+)$/gm, '<p style="margin: 0.4rem 0; padding-left: 0.5rem;">$1</p>')
                      .replace(/^-\s+(.+)$/gm, '<p style="margin: 0.4rem 0; padding-left: 0.5rem;">• $1</p>')
                      .replace(/\n\n/g, '<br/><br/>')
                  }}
                />
              )}
            </Paper>
          </CardContent>
        </Card>
      </Grid>

      {/* Document Metadata and Related */}
      <Grid item xs={12} md={4}>
        {/* Metadata */}
        <Card sx={{ mb: 6 }}>
          <CardHeader 
            title="Informasi Dokumen" 
            sx={{
              '& .MuiCardHeader-title': {
                fontSize: '1.125rem',
                fontWeight: 600
              },
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          />
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 0 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="body2" color="text.secondary" fontWeight="500">Format</Typography>
                <Typography variant="body2" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>{document.fileType}</Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.default'
              }}>
                <Typography variant="body2" color="text.secondary" fontWeight="500">Ukuran</Typography>
                <Typography variant="body2" fontWeight="500">{document.fileSize}</Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="body2" color="text.secondary" fontWeight="500">Diupload pada</Typography>
                <Typography variant="body2" fontWeight="500">{document.uploadDate}</Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.default'
              }}>
                <Typography variant="body2" color="text.secondary" fontWeight="500">Diupload oleh</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                    {document.uploadedBy.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" fontWeight="500">{document.uploadedBy}</Typography>
                </Box>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="body2" color="text.secondary" fontWeight="500">Dilihat</Typography>
                <Typography variant="body2" fontWeight="500">{document.views} kali</Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                p: 2
              }}>
                <Typography variant="body2" color="text.secondary" fontWeight="500">Diunduh</Typography>
                <Typography variant="body2" fontWeight="500">{document.downloads} kali</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Related Documents */}
        <Card>
          <CardHeader 
            title="Dokumen Terkait" 
            sx={{
              '& .MuiCardHeader-title': {
                fontSize: '1.125rem',
                fontWeight: 600
              },
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          />
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              {document.relatedDocuments?.map((relDoc) => (
                <Box 
                  key={relDoc.id}
                  sx={{ 
                    display: 'flex', 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover',
                      transform: 'translateY(-2px)',
                      boxShadow: 1,
                      cursor: 'pointer'
                    }
                  }}
                  component={Link}
                  href={`/asset-management/knowledge-base/${relDoc.id}`}
                  underline="none"
                  color="inherit"
                >
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <Icon icon={getFileIcon(relDoc.fileType)} fontSize={24} color="primary.main" />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{relDoc.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{relDoc.category}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DocumentDetail
