'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'

// Icon Imports
import Icon from '@/components/icon'

// Types
interface UploadDocumentDialogProps {
  open: boolean
  onClose: () => void
}

// Dummy Data
const categories = [
  { id: 1, name: 'Peralatan Dapur' },
  { id: 2, name: 'Kebersihan' },
  { id: 3, name: 'Sistem IT' },
  { id: 4, name: 'Layanan Pelanggan' },
  { id: 5, name: 'Menu & Resep' },
  { id: 6, name: 'SDM' },
  { id: 7, name: 'Keuangan' },
  { id: 8, name: 'Keselamatan' }
]

const suggestedTags = [
  'panduan', 'sop', 'mesin', 'udon', 'kebersihan', 'sanitasi', 'pelatihan', 
  'karyawan', 'resep', 'menu', 'inspeksi', 'checklist', 'sistem', 'pos', 
  'pelanggan', 'layanan', 'keselamatan', 'keuangan', 'anggaran', 'inventaris'
]

const UploadDocumentDialog = ({ open, onClose }: UploadDocumentDialogProps) => {
  // States
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    // Validate form
    if (!title || !description || !category || !file) {
      setUploadError('Mohon lengkapi semua field yang diperlukan')
      return
    }

    // Reset error state
    setUploadError(null)
    
    // Simulate upload process
    setUploading(true)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadSuccess(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleClose = () => {
    // Reset form state
    setTitle('')
    setDescription('')
    setCategory('')
    setTags([])
    setFile(null)
    setUploading(false)
    setUploadProgress(0)
    setUploadSuccess(false)
    setUploadError(null)
    
    // Close dialog
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>
        Unggah Dokumen Baru
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {uploadSuccess ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Icon icon='mdi:check-circle' fontSize={60} color='success.main' />
            <Typography variant='h6' sx={{ mt: 2 }}>
              Dokumen Berhasil Diunggah!
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1, mb: 4 }}>
              Dokumen Anda telah berhasil diunggah dan tersedia di Knowledge Base.
            </Typography>
            <Button variant='contained' onClick={handleClose}>
              Kembali ke Knowledge Base
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: 1 }}>
            {uploadError && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {uploadError}
              </Alert>
            )}
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <TextField
                  label='Judul Dokumen'
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={uploading}
                  required
                  sx={{ mb: 4 }}
                />
                
                <TextField
                  label='Deskripsi'
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={uploading}
                  required
                  sx={{ mb: 4 }}
                />
                
                <TextField
                  select
                  label='Kategori'
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={uploading}
                  required
                  sx={{ mb: 4 }}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                
                <Autocomplete
                  multiple
                  freeSolo
                  options={suggestedTags}
                  value={tags}
                  onChange={(event, newValue) => {
                    setTags(newValue)
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        disabled={uploading}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Tags'
                      placeholder='Tambahkan tag'
                      disabled={uploading}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: dragActive ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: dragActive ? 'action.hover' : 'background.paper',
                    transition: 'all 0.2s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <>
                      <Icon 
                        icon={
                          file.type.includes('pdf') ? 'mdi:file-pdf-box' :
                          file.type.includes('word') ? 'mdi:file-word' :
                          file.type.includes('excel') ? 'mdi:file-excel' :
                          file.type.includes('powerpoint') ? 'mdi:file-powerpoint' :
                          'mdi:file-document-outline'
                        } 
                        fontSize={60} 
                        color='primary' 
                      />
                      <Typography variant='body1' sx={{ mt: 2, fontWeight: 'bold' }}>
                        {file.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                      <Button 
                        variant='outlined' 
                        color='error' 
                        size='small' 
                        startIcon={<Icon icon='mdi:close' />}
                        onClick={() => setFile(null)}
                        sx={{ mt: 2 }}
                        disabled={uploading}
                      >
                        Hapus
                      </Button>
                    </>
                  ) : (
                    <>
                      <Icon icon='mdi:cloud-upload-outline' fontSize={60} color='primary' />
                      <Typography variant='h6' sx={{ mt: 2 }}>
                        Tarik & Lepas File
                      </Typography>
                      <Typography variant='body2' color='text.secondary' sx={{ mt: 1, mb: 3 }}>
                        atau klik untuk memilih file
                      </Typography>
                      <Button
                        component='label'
                        variant='outlined'
                        disabled={uploading}
                      >
                        Pilih File
                        <input
                          type='file'
                          hidden
                          onChange={handleFileChange}
                          disabled={uploading}
                        />
                      </Button>
                      <Typography variant='caption' color='text.secondary' sx={{ mt: 2 }}>
                        Format yang didukung: PDF, DOCX, XLSX, PPTX, JPG, PNG
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
            
            {uploading && (
              <Box sx={{ mt: 4 }}>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  Mengunggah... {uploadProgress}%
                </Typography>
                <LinearProgress variant='determinate' value={uploadProgress} />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      
      {!uploadSuccess && (
        <DialogActions>
          <Button onClick={handleClose} disabled={uploading}>
            Batal
          </Button>
          <Button 
            variant='contained' 
            onClick={handleUpload}
            disabled={uploading || !file}
            startIcon={<Icon icon='mdi:cloud-upload' />}
          >
            {uploading ? 'Mengunggah...' : 'Unggah Dokumen'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default UploadDocumentDialog
