import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'

import { motion } from 'framer-motion'
import { Box, Container, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Snackbar, Alert, IconButton, Grid, Card, CardContent, Avatar } from '@mui/material'
import { CleaningServices as CleaningIcon, CheckCircle as CheckIcon, Refresh as RefreshIcon, Room as RoomIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'

const CleaningDashboard = () => {
    const navigate = useNavigate()
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [processingRoom, setProcessingRoom] = useState(null)

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity })
    }

    const fetchRooms = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:3000/cleaning/rooms')

            if (response.data.success) {
                setRooms(response.data.data.rooms)
            } else {
                throw new Error(response.data.message || 'Error al cargar habitaciones')
            }

        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Error al cargar las habitaciones', 'error')

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRooms()
        
        const savedAvatar = localStorage.getItem('userAvatar')
        if (savedAvatar) {
            setAvatarUrl(`http://localhost:3000${savedAvatar}`)
        }
    }, [])

    const handleMarkAsAvailable = async (roomId) => {
        try {
            setProcessingRoom(roomId)
            const response = await axios.put(`http://localhost:3000/cleaning/rooms/${roomId}/available`)

            if (response.data.success) {
                setRooms(prev => prev.filter(room => room.id !== roomId))   // Remover la habitación de la lista
                showSnackbar(response.data.message, 'success')

            } else {
                throw new Error(response.data.message || 'Error al actualizar habitación')
            }

        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Error al actualizar la habitación', 'error')

        } finally {
            setProcessingRoom(null)
        }
    }

    const getRoomTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'suite': return 'secondary'
            case 'doble': return 'primary'
            case 'individual': return 'info'
            default: return 'default'
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <NavBar avatarUrl={avatarUrl} hideCleaningButton={true} logoRedirectTo="/cleaning" />

            <Box sx={{ flexGrow: 1, py: 8, px: { xs: 2, sm: 3, md: 4 }, pt: '120px' }}>
                <Container maxWidth="xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center', paddingLeft: '120px' }}>
                                <SectionTitle subtitle="Gestiona el proceso de limpieza de habitaciones">
                                    Panel de Limpieza
                                </SectionTitle>
                            </Box>

                            <LoadingButton variant="contained" startIcon={<RefreshIcon />} onClick={fetchRooms}  loading={loading} sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} >
                                Actualizar
                            </LoadingButton>
                        </Box>

                        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ backgroundColor: 'warning.main' }}>
                                        <TableRow>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Habitación</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Capacidad</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {rooms.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <CleaningIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                                        <Typography variant="h6" color="text.secondary" gutterBottom> No hay habitaciones en limpieza </Typography>
                                                        <Typography variant="body2" color="text.secondary"> Todas las habitaciones están disponibles u ocupadas </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            rooms.map((room) => (
                                                <TableRow key={room.id} hover>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'warning.main' }}> <RoomIcon /> </Avatar>
                                                            <Box>
                                                                <Typography variant="body1" fontWeight="medium"> {room.name} </Typography>
                                                                <Typography variant="body2" color="text.secondary"> ID: {room.id} </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Chip
                                                            label={room.type || 'Estándar'}
                                                            color={getRoomTypeColor(room.type)}
                                                            size="small"
                                                        />
                                                    </TableCell>

                                                    <TableCell>{room.capacity || 2} personas</TableCell>
                                                    
                                                    <TableCell>
                                                        <Chip
                                                            label={room.roomStateLabel}
                                                            color="warning"
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <LoadingButton variant="contained" size="small" startIcon={<CheckIcon />} loading={processingRoom === room.id} onClick={() => handleMarkAsAvailable(room.id)} sx={{ backgroundColor: 'success.main', '&:hover': { backgroundColor: 'success.dark' } }} >
                                                            {processingRoom === room.id ? 'Procesando...' : 'Marcar Disponible'}
                                                        </LoadingButton>
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

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }} >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default CleaningDashboard