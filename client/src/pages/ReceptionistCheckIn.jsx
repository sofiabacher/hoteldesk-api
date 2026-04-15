import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Container, Grid, Typography, Paper, TextField, Button, Chip, Card, CardContent, Divider, Snackbar, Alert, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, Avatar, Badge, Dialog, Tooltip } from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon, Check as CheckIcon, Close as CloseIcon, Person as PersonIcon, Room as RoomIcon, Key as KeyIcon, EventNote as NoteIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab'
import { useTheme } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'
import axios from '../utils/axiosConfig'

const ReceptionistCheckIn = () => {
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

    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [selectedReservation, setSelectedReservation] = useState(null)

    const showSnackbar = (message, severity = 'success') => { setSnackbar({ open: true, message, severity }) }

    const fetchReservations = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:3000/receptionist/checkins')

            if (response.data.success) {
                setReservations(response.data.data.checkIns)
            } else {
                throw new Error(response.data.message || 'Error al cargar check-ins')
            }

        } catch (error) {
            console.error('Error al cargar reservas:', error)
            showSnackbar(error.response?.data?.message || 'Error al cargar las reservas', 'error')

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReservations()
    }, [])

    const filteredReservations = reservations.filter(reservation => {
        const matchesSearch = reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              reservation.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              reservation.guestEmail.toLowerCase().includes(searchTerm.toLowerCase())

        const today = new Date().toISOString().split('T')[0]
        const matchesFilter = filterStatus === 'all' ||
                            (filterStatus === 'today' && reservation.checkInDate === today) ||
                            (filterStatus === 'future' && reservation.checkInDate > today) ||
                            (filterStatus === 'past' && reservation.checkInDate < today)

        return matchesSearch && matchesFilter
    })

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'success'
            case 'pending': return 'warning'
            case 'in_progress': return 'info'
            case 'cancelled': return 'error'
            default: return 'default'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed': return 'Confirmada'
            case 'pending': return 'Pendiente'
            case 'in_progress': return 'En curso'
            case 'cancelled': return 'Cancelada'
            default: return 'Desconocido'
        }
    }

    const handleCheckIn = async (reservation) => {
        try {
            const response = await axios.post(`http://localhost:3000/receptionist/checkin/${reservation.bookingId}`)
  
            if (response.data.success) {    // Actualizar la reserva localmente
                setReservations(prev =>
                    prev.map(r =>
                        r.bookingId === reservation.bookingId
                            ? { ...r, status: 'in_progress' }
                            : r
                    )
                )

                showSnackbar(response.data.message || 'Check-in procesado correctamente', 'success')

            } else {
                throw new Error(response.data.message || 'Error al procesar check-in')
            }
            
        } catch (error) {
            console.error('Error en check-in:', error)
            showSnackbar(error.response?.data?.message || 'Error al procesar check-in', 'error')
        }
    }

    const handleViewDetails = (reservation) => { setSelectedReservation(reservation) }
    const handleCloseDetails = () => { setSelectedReservation(null) }

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada'
        const [year, month, day] = dateString.split('-')
        const date = new Date(year, month - 1, day)
        
         return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <NavBar avatarUrl={avatarUrl} />

            <Box sx={{ flexGrow: 1, py: 8, px: { xs: 2, sm: 3, md: 4 }, pt: '120px' }}>
                <Container maxWidth="xl">
                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}> 
                        <Box sx={{ display: 'flex', alignItems: 'center',  gap: 2 }}>
                            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/recepcionist')} sx={{ borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}>
                                Volver
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '270px' }}>
                                <SectionTitle subtitle="Gestiona el proceso de llegada de huéspedes"> Check-in </SectionTitle>
                            </Box>

                           <LoadingButton variant="contained" startIcon={<RefreshIcon />} onClick={fetchReservations} loading={loading} sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>
                                Actualizar
                            </LoadingButton>
                        </Box>

                        <Box sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)', border: '2px solid', borderColor: 'primary.main', borderRadius: 2, p: 4 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField fullWidth size="small" placeholder="Buscar reservas" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                        InputProps={{  startAdornment: ( <IconButton size="small"> <SearchIcon /> </IconButton>  )  }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel size="small">Fecha</InputLabel>
                                        
                                        <Select size="small" value={filterStatus} label="Fecha" onChange={(e) => setFilterStatus(e.target.value)} sx={{ width: '120px' }}>
                                            <MenuItem value="all">Todas</MenuItem>
                                            <MenuItem value="today">Hoy</MenuItem>
                                            <MenuItem value="future">Futuras</MenuItem>
                                            <MenuItem value="past">Pasadas</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} sm={12} md={4}>
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Chip label={`Total: ${filteredReservations.length}`} color="primary" variant="outlined" />
                                        <Chip label={`Hoy: ${filteredReservations.filter(r => r.canCheckIn).length}`} color="success" variant="outlined" />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                                        <TableRow>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Habitación</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Huesped</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Check-in</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Disponibilidad</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                        <RefreshIcon sx={{ fontSize: 40, color: 'primary.main', animation: 'spin 1s linear infinite' }} />
                                                        <Typography variant="h6" color="text.secondary">
                                                            Cargando reservas...
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>

                                        ) : filteredReservations.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                                            No hay reservas para check-in
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay reservas pendientes de procesar'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>

                                        ) : (
                                            filteredReservations.map((reservation, index) => (
                                                <TableRow key={reservation.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <RoomIcon color="action" />
                                                            
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="medium"> {reservation.roomNumber} </Typography>
                                                                <Typography variant="caption" color="text.secondary"> {reservation.roomType} </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.main' }}> {reservation.guestName.charAt(0).toUpperCase() } </Avatar>
                                                            
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="medium"> {reservation.guestName} </Typography>
                                                                <Typography variant="caption" color="text.secondary"> {reservation.guestEmail} </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="medium"> {reservation.checkInDate} </Typography>
                                                            <Typography variant="caption" color="text.secondary"> {reservation.checkInTime} </Typography>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Chip
                                                            label={reservation.canCheckIn ? "Disponible" : reservation.checkInDate > new Date().toISOString().split('T')[0] ? "Futuro" : "No disponible"}
                                                            color={reservation.canCheckIn ? "success" : reservation.checkInDate > new Date().toISOString().split('T')[0] ? "warning" : "default"}
                                                            size="small"
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Chip label={getStatusText(reservation.status)} color={getStatusColor(reservation.status)} size="small" />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Tooltip title="Ver detalles">
                                                                <IconButton size="small" onClick={() => handleViewDetails(reservation)} sx={{ backgroundColor: 'info.main', color: 'white', '&:hover': { backgroundColor: 'info.dark' } }}>
                                                                    <NoteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>

                                                            {reservation.canCheckIn ? (
                                                                <Tooltip title="Procesar Check-in">
                                                                    <IconButton size="small" onClick={() => handleCheckIn(reservation)} sx={{ backgroundColor: 'success.main', color: 'white', '&:hover': { backgroundColor: 'success.dark' } }}>
                                                                        <CheckIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>

                                                            ) : (
                                                                <Tooltip title={reservation.checkInDate > new Date().toISOString().split('T')[0] ? "Check-in futuro" : "Check-in no disponible"}>
                                                                    <IconButton size="small" disabled sx={{ color: 'text.secondary' }}>
                                                                        <CheckIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </motion.div>
                </Container>
            </Box>

            <Footer />

           <Dialog open={!!selectedReservation} onClose={handleCloseDetails} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                {selectedReservation && (
                    <>
                       <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'primary.main', color: 'white' }}>
                            <Typography variant="h6" fontWeight="bold"> Detalles de la Reserva </Typography>
                        </Box>

                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" gutterBottom>Habitación</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {selectedReservation.roomNumber} - {selectedReservation.roomType}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" gutterBottom>Estado</Typography>
                                    <Chip label={getStatusText(selectedReservation.status)} color={getStatusColor(selectedReservation.status)} size="small" />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>Huésped</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                       <Avatar src={selectedReservation.guestPhoto} sx={{ width: 40, height: 40, fontSize: 16, bgcolor: 'primary.main' }}>
                                            {!selectedReservation.guestPhoto && selectedReservation.guestName.charAt(0).toUpperCase()}
                                        </Avatar>

                                        <Box>
                                            <Typography variant="body1" fontWeight="medium"> {selectedReservation.guestName} </Typography>
                                            <Typography variant="body2" color="text.secondary"> {selectedReservation.guestEmail}  </Typography>
                                            <Typography variant="body2" color="text.secondary"> {selectedReservation.guestPhone} </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" gutterBottom>Fecha Check-in</Typography>
                                    <Typography variant="body1"> {formatDate(selectedReservation.checkInDate)} </Typography>
                                    <Typography variant="body2" color="text.secondary"> {selectedReservation.checkInTime} </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" gutterBottom>Fecha Check-out</Typography>
                                    <Typography variant="body1"> {formatDate(selectedReservation.checkOutDate)} </Typography>
                                </Grid>
 
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" gutterBottom>Cantidad de Huéspedes</Typography>
                                    <Typography variant="body1"> {selectedReservation.guests} personas </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" gutterBottom>Código de Confirmación</Typography>
                                    <Typography variant="body1" fontFamily="monospace"> {selectedReservation.confirmationCode}  </Typography>
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button onClick={handleCloseDetails} variant="outlined">  Cerrar </Button>
                                
                                <Button onClick={handleCloseDetails} variant="contained" sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>
                                    Ir al Panel
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Dialog>

           <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default ReceptionistCheckIn