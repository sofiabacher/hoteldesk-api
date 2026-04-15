import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'

import { motion } from 'framer-motion'
import { Box, Container, Typography, Card, CardContent, CardMedia, Button, Chip, Divider, Alert, Snackbar, CircularProgress, Grid } from '@mui/material'
import { CalendarToday as CalendarIcon, Payment as PaymentIcon, Cancel as CancelIcon, Hotel as HotelIcon, Info as InfoIcon, Download as DownloadIcon } from '@mui/icons-material'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'
import PaymentDialog from '../components/PaymentDialog'
import CancellationDialog from '../components/CancellationDialog'

const MyReservations = () => {
    const navigate = useNavigate()
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedReservation, setSelectedReservation] = useState(null)
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
    const [selectedReservationForCancel, setSelectedReservationForCancel] = useState(null)
    const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false)

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity })

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

    useEffect(() => {
        fetchReservations()
    }, [])

    
    useEffect(() => {
        let isFetching = false

        const handleVisibilityChange = () => {
            if (!document.hidden && !isFetching) {
                isFetching = true
                fetchReservations().finally(() => { isFetching = false })
            }
        }

        const handleFocus = () => {
            if (!isFetching) {
                isFetching = true
                fetchReservations().finally(() => { isFetching = false })
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('focus', handleFocus)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('focus', handleFocus)
        }
    }, [])

    const fetchReservations = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:3000/booking/my-bookings')
            setReservations(response.data.data?.bookings || [])
            setError(null)

        } catch (err) {
            console.error('Error fetching reservations:', err)
            setError(err?.response?.data?.message || 'Error al cargar tus reservas')
            setReservations([])

        } finally {
            setLoading(false)
        }
    }

    const handlePayment = async (reservation) => {
        setSelectedReservation(reservation)
        setPaymentDialogOpen(true)
    }

    const handleCancel = (reservation) => {
        if (!reservation || !reservation.id) return    //Valida la reserva antes de establecer el estado

        setSelectedReservationForCancel(reservation)
        setTimeout(() => { setCancellationDialogOpen(true) }, 10)
    }

    const handleCancellationSuccess = async (updatedBooking) => {
        setCancellationDialogOpen(false)
        setSelectedReservationForCancel(null)

        setReservations(prevReservations => {
            console.log('Previous reservations:', prevReservations)
            const updated = prevReservations.map(reservation =>
                reservation.id === updatedBooking.id
                    ? { ...reservation, status: updatedBooking.status, paymentStatus: updatedBooking.paymentStatus }
                    : reservation
            )
            
            return updated
        })

        setTimeout(async () => {
            try {
                await fetchReservations()
          } catch (err) {
                console.error('Error al recargar las reservas luego de la cancelación: ', err)
            }
        }, 2000)
    }

    const handlePaymentSuccess = async (updatedBooking) => {
        setReservations(prevReservations =>
            prevReservations.map(reservation =>
                reservation.id === updatedBooking.id
                    ? { ...reservation, status: updatedBooking.status, paymentStatus: updatedBooking.paymentStatus }
                    : reservation
            )
        )

        try {
            await fetchReservations()
        } catch (err) {
            console.error('Error al recargar las reservas luego de pagar:', err)
        }

        showSnackbar('¡Pago procesado exitosamente! Revisa tu correo para la confirmación.', 'success')
        setPaymentDialogOpen(false)
        setSelectedReservation(null)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmada': return 'success'
            case 'Pendiente': return 'warning'
            case 'Cancelada': return 'error'
            case 'En curso': return 'info'
            case 'Finalizada': return 'primary'
            default: return 'default'
        }
    }

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'Pagado': return 'success'
            case 'Pendiente': return 'warning'
            case 'Fallido': return 'error'
            case 'Reembolsado': return 'default'
            default: return 'default'
        }
    }

    const getStatusLabel = (status) => { return status }
    const getPaymentStatusLabel = (status) => { return status }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-')
        const date = new Date(year, month - 1, day)  //El mes está indexado a 0.

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    
    const handleDownloadReceipt = async (reservation) => {
        try {
            const response = await axios.get(`http://localhost:3000/booking/${reservation.id}/receipt`, {
                responseType: 'blob' //Importante para la descarga de archivos
            })

            const contentDisposition = response.headers['content-disposition']  //Obtiene los headers del backend
            let filename = `comprobante_pago_${reservation.confirmationCode}.txt`

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
                if (filenameMatch) filename = filenameMatch[1]
            }

            const url = window.URL.createObjectURL(new Blob([response.data]))  //Crea enlance de descarga
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            showSnackbar('Comprobante de pago descargado exitosamente', 'success')

        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Error al descargar el comprobante'
            showSnackbar(errorMessage, 'error')
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <NavBar avatarUrl={avatarUrl} />
                <Container maxWidth="xl" sx={{ py: 20 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={60} />
                        <Typography variant="h6" color="text.secondary">Cargando tus reservas...</Typography>
                    </Box>
                </Container>
            </Box>
        )
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <NavBar avatarUrl={avatarUrl} />

            <Box sx={{ flexGrow: 1, py: 8, px: { xs: 2, sm: 3, md: 4 }, pt: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: '1440px', mx: 'auto' }}>
                    <SectionTitle subtitle="Gestiona tus reservas y pagos" textAlign="center">Mis Reservas</SectionTitle>

                    {error && (
                        <Alert severity="error" sx={{ mb: 4, mx: 'auto', maxWidth: '600px' }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {reservations.length === 0 && !loading && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <HotelIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h5" color="text.secondary" gutterBottom> No tienes reservas aún </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}> ¡Comienza reservando tu primera habitación! </Typography>

                            <Button variant="contained" size="large" onClick={() => navigate('/booking')} sx={{ px: 4 }} >
                                Hacer una Reserva
                            </Button>
                        </Box>
                    )}

                    <Grid container spacing={3} sx={{ maxWidth: '1400px', mx: 'auto', justifyContent: 'center' }}>
                        {reservations.map((reservation) => (
                            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={reservation.id}>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ y: -5 }}>
                                    <Card sx={{ width: '100%', height: 580, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'visible', boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
                                        <Box sx={{ position: 'absolute', top: -12, right: 16, zIndex: 1 }}>
                                           <Chip label={getStatusLabel(reservation.status)} color={getStatusColor(reservation.status)} sx={{ fontWeight: 'bold', fontSize: '0.85rem', px: 2, height: 32 }} />
                                        </Box>

                                        <CardMedia component="div" sx={{ height: 180, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <HotelIcon sx={{ fontSize: 48, mb: 1 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {reservation.room?.name || 'Habitación'}
                                                </Typography>
                                            </Box>
                                        </CardMedia>

                                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 180px)', py: 2 }}>
                                            <Box sx={{ mb: 2, minHeight: 80 }}>
                                                <Typography variant="h6" gutterBottom sx={{ minHeight: 32 }}>
                                                    Código: {reservation.confirmationCode}
                                                </Typography>

                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minHeight: 48 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                                                        </Typography>
                                                    </Box>

                                                    <Typography variant="body2" color="text.secondary">
                                                        {reservation.guests} {reservation.guests === 1 ? 'huésped' : 'huéspedes'}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, minHeight: 32 }}>
                                                <Typography variant="body2" color="text.secondary"> Estado Reserva: </Typography>
                                                <Chip label={getStatusLabel(reservation.status)} color={getStatusColor(reservation.status)} size="small" />
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, minHeight: 32 }}>
                                                <Typography variant="body2" color="text.secondary"> Estado Pago: </Typography>
                                                <Chip label={getPaymentStatusLabel(reservation.paymentStatus)} color={getPaymentStatusColor(reservation.paymentStatus)} size="small" />
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, minHeight: 40 }}>
                                                <Typography variant="body2" color="text.secondary"> Total: </Typography>
                                                <Typography variant="h6" color="primary.main" fontWeight="bold">
                                                    ${reservation.totalPrice}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mt: 'auto', display: 'flex', gap: 1, minHeight: 48, alignItems: 'stretch' }}>
                                                {reservation.status === 'Pendiente' && reservation.paymentStatus === 'Pendiente' && (
                                                    <Button variant="contained" startIcon={<PaymentIcon />} onClick={() => handlePayment(reservation)} sx={{ flex: 1, minWidth: '140px' }}>
                                                        Pagar
                                                    </Button>
                                                )}

                                                {reservation.status === 'Confirmada' && reservation.paymentStatus === 'Pagado' && (
                                                    <>
                                                        <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => handleDownloadReceipt(reservation)} sx={{ flex: 1, minWidth: '140px' }}>
                                                            Comprobante
                                                        </Button>

                                                        <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => handleCancel(reservation)} sx={{ minWidth: '100px' }}>
                                                            Cancelar
                                                        </Button>
                                                    </>
                                                )}

                                                {(reservation.status === 'Pendiente' && reservation.paymentStatus === 'Pendiente') && (
                                                    <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => handleCancel(reservation)} sx={{ flex: 1, minWidth: '140px' }}>
                                                        Cancelar
                                                    </Button>
                                                )}

                                                {reservation.status === 'Cancelada' && (
                                                    <Button variant="outlined" startIcon={<InfoIcon />} onClick={() => navigate('/booking')} sx={{ flex: 1, minWidth: '140px' }}>
                                                        Nueva Reserva
                                                    </Button>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

            <Footer />

            <PaymentDialog open={paymentDialogOpen} onClose={() => { setPaymentDialogOpen(false); setSelectedReservation(null); }}
                reservation={selectedReservation} onSuccess={handlePaymentSuccess} showSnackbar={showSnackbar}
            />

            <CancellationDialog
                open={cancellationDialogOpen}
                onClose={() => { setCancellationDialogOpen(false); setSelectedReservationForCancel(null); }}
                reservation={selectedReservationForCancel}
                onSuccess={handleCancellationSuccess}
                showSnackbar={showSnackbar}
            />

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default MyReservations