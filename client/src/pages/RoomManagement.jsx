import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Container, Button, Grid, Typography, Snackbar, Alert, CircularProgress } from '@mui/material'
import { Add as AddIcon, MeetingRoom as RoomIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material'
import { ROOM_STATES, ROOM_TYPES, AMENITY_OPTIONS } from '../utils/constants'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'
import RoomFilters from '../components/RoomFilters'
import RoomsTable from '../components/RoomsTable'
import RoomFormDialog from '../components/RoomFormDialog'
import ConfirmActionDialog from '../components/ConfirmActionDialog'
import AdminActionCard from '../components/AdminActionCard'
import axios from '../utils/axiosConfig'


const getColorFromTheme = (theme, colorName) => {
  const colorMap = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    error: theme.palette.error?.main || '#f44336',
    warning: theme.palette.warning?.main || '#ff9800',
    info: theme.palette.info?.main || '#2196f3',
    success: theme.palette.success?.main || '#4caf50',
    disabled: theme.palette.action.disabled || '#9e9e9e'
  }

  return colorMap[colorName] || theme.palette.primary.main
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const RoomManagement = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/profile')
        const user = response.data?.data?.user
        if (user?.photo) setAvatarUrl(`http://localhost:3000${user.photo}`)
      } catch (err) {
        console.error('Error al obtener la foto de perfil:', err)
      }
    }
    fetchUserData()
  }, [])

  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const [openDialog, setOpenDialog] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    capacity: 1,
    price: 0,
    size: '',
    beds: '',
    amenities: [],
    images: '',
    roomStateId: 1
  })

  const [filters, setFilters] = useState({ number: '', type: '', status: '' })
  const [confirmDialog, setConfirmDialog] = useState({ open: false, roomId: null, roomName: '', message: '' })

  const fetchRooms = async () => {
    try {
      setLoading(true)

      const response = await axios.get('http://localhost:3000/rooms/admin/all')
      setRooms(response.data.data || [])
      setFilteredRooms(response.data.data || [])

    } catch (err) {
      setError('Error al cargar las habitaciones')

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = rooms

    if (filters.number) { filtered = filtered.filter(room => room.name.toLowerCase().includes(filters.number.toLowerCase()) ) }
    if (filters.type) { filtered = filtered.filter(room => room.type === filters.type) }
    if (filters.status) { filtered = filtered.filter(room => room.roomStateId === parseInt(filters.status)) }

    setFilteredRooms(filtered)
  }, [rooms, filters])

  useEffect(() => {
    fetchRooms()
  }, [])

  const showSnackbar = (message, severity = 'success') => { setSnackbar({ open: true, message, severity }) }
  const handleFilterChange = (field, value) => { setFilters(prev => ({ ...prev, [field]: value })) }
  const clearFilters = () => { setFilters({ number: '', type: '', status: '' }) }

  const handleOpenDialog = (room = null) => {
    setEditingRoom(room)

    if (room) {
      setFormData({
        name: room.name,
        description: room.description || '',
        type: room.type,
        capacity: room.capacity,
        price: room.price,
        size: room.size || '',
        beds: room.beds || '',
        amenities: Array.isArray(room.amenities) ? room.amenities : (room.amenities ? room.amenities.split(',').map(a => a.trim()) : []),
        images: room.image || '',
        roomStateId: room.roomStateId
      })

    } else {
      setFormData({
        name: '',
        description: '',
        type: '',
        capacity: 1,
        price: 0,
        size: '',
        beds: '',
        amenities: [],
        images: '',
        roomStateId: 1
      })
    }

    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingRoom(null)
  }

  const handleInputChange = (field, value) => { setFormData(prev => ({ ...prev, [field]: value })) }

  const handleAmenitiesChange = (event) => {
    const { value } = event.target
    setFormData(prev => ({ ...prev, amenities: typeof value === 'string' ? value.split(',') : value }))
  }

  const handleSaveRoom = async () => {
    try {
      const url = editingRoom
        ? `http://localhost:3000/rooms/admin/${editingRoom.id}`
        : 'http://localhost:3000/rooms/admin'

      const method = editingRoom ? 'put' : 'post'

      await axios({ method, url, data: formData })

      showSnackbar(editingRoom ? 'Habitación actualizada correctamente' : 'Habitación creada correctamente')
      handleCloseDialog()
      fetchRooms()

    } catch (err) {
      showSnackbar(`Error al ${editingRoom ? 'actualizar' : 'crear'} la habitación`, 'error')
    }
  }

  const confirmDeleteRoom = (roomId, roomName) => {
    setConfirmDialog({
      open: true,
      roomId,
      roomName,
      message: `¿Está seguro de que desea marcar la habitación como fuera de servicio?`
    })
  }

  const handleDeleteRoom = async () => {
    const { roomId } = confirmDialog
    setConfirmDialog({ open: false, roomId: null, roomName: '', message: '' })

    try {
      await axios.delete(`http://localhost:3000/rooms/admin/${roomId}`)
      showSnackbar('Habitación marcada como fuera de servicio correctamente')
      fetchRooms()

    } catch (err) {
      showSnackbar('Error al marcar la habitación como fuera de servicio', 'error')
    }
  }

  if (loading) {
    return (
      <>
        <NavBar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} thickness={4} />
        </Container>
        <Footer />
      </>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <NavBar avatarUrl={avatarUrl} />

      <Box sx={{ flexGrow: 1, py: 8, px: { xs: 2, sm: 3, md: 4 }, pt: '120px' }}>
        <Container maxWidth="xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')}
                sx={{ mr: 3, borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}
              >
                Volver al Panel
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Typography variant="h4" fontWeight="bold" color="primary.main"> Gestión de Habitaciones </Typography>
              </Box>

              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>
                Nueva Habitación
              </Button>
            </Box>
          </motion.div>

          <Box sx={{ mb: 4, paddingTop: '10px', paddingBottom: '10px' }}>
            <Grid container spacing={2} sx={{ maxWidth: 1400, mx: 'auto' }}>
              {Object.entries(ROOM_STATES).map(([key, state]) => {
                const count = rooms.filter(room => room.roomStateId === parseInt(key)).length

                return (
                  <Grid item xs={12} sm={6} md={2.4} lg={2.4} key={key}>
                    <AdminActionCard
                      title={state.label}
                      icon={RoomIcon}
                      value={count}
                      change={`${count} habitaciones`}
                      showStats={true}
                      statsColor={getColorFromTheme(theme, state.color)}
                      changeType={state.color === 'error' ? 'negative' : state.color === 'success' ? 'positive' : 'neutral'}
                    />    
                  </Grid>
                )
              })}
            </Grid>
          </Box>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <RoomFilters
              searchTerm={filters.number}
              setSearchTerm={(value) => handleFilterChange('number', value)}
              typeFilter={filters.type}
              setTypeFilter={(value) => handleFilterChange('type', value)}
              statusFilter={filters.status}
              setStatusFilter={(value) => handleFilterChange('status', value)}
              onSearch={fetchRooms}
              onRefresh={fetchRooms}
              loading={loading}
              roomTypes={ROOM_TYPES}
              roomStates={ROOM_STATES}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <RoomsTable
              rooms={filteredRooms}
              loading={loading}
              onEditRoom={handleOpenDialog}
              onDeleteRoom={confirmDeleteRoom}
              roomStates={ROOM_STATES}
              searchTerm={filters.number}
              typeFilter={filters.type}
              statusFilter={filters.status}
            />
          </motion.div>
        </Container>
      </Box>

      <Footer />

      <RoomFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSaveRoom}
        formData={formData}
        onInputChange={handleInputChange}
        onAmenitiesChange={handleAmenitiesChange}
        editingRoom={editingRoom}
        roomTypes={ROOM_TYPES}
        roomStates={ROOM_STATES}
        amenityOptions={AMENITY_OPTIONS}
        showSnackbar={showSnackbar}
      />

      <ConfirmActionDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={handleDeleteRoom}
        message={confirmDialog.message}
        userName={confirmDialog.roomName}
        actionType="out-of-service"
        loading={loading}
        entityType="habitación"
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default RoomManagement