import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'

import { motion, AnimatePresence } from 'framer-motion'
import { Box, Container, Grid, Paper, Typography, Button, Card, CardContent, CardMedia, TextField, Divider, Chip, Stepper, Step, StepLabel, Stack, Alert, Snackbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { CalendarToday as CalendarIcon, Bed as BedIcon, Wifi as WifiIcon, Tv as TvIcon, AcUnit as AcIcon, CheckCircle as CheckCircleIcon, ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon, Info as InfoIcon, Hotel as HotelIcon } from '@mui/icons-material'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'

import { slideVariants } from '../utils/constants'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'

const Booking = () => {
    const navigate = useNavigate()
    const [avatarUrl, setAvatarUrl] = useState(null)

    const [currentStep, setCurrentStep] = useState(0)
    const [direction, setDirection] = useState(0)

    const [checkInDate, setCheckInDate] = useState(null)
    const [checkOutDate, setCheckOutDate] = useState(null)
    const [guests, setGuests] = useState(1)
    const [selectedRoom, setSelectedRoom] = useState(null)

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity })

    const [rooms, setRooms] = useState([])
    const [roomsLoading, setRoomsLoading] = useState(false)
    const [roomsError, setRoomsError] = useState(null)

    const fetchAvailableRooms = async () => {
        if (!checkInDate || !checkOutDate) return

        setRoomsLoading(true)
        setRoomsError(null)

        try {
            const checkIn = checkInDate.toISOString().split('T')[0]
            const checkOut = checkOutDate.toISOString().split('T')[0]

            const response = await axios.get('http://localhost:3000/booking/rooms/search', {
                params: {
                    checkInDate: checkIn,
                    checkOutDate: checkOut,
                    guests: guests
                }
            })

            setRooms(response.data.data?.rooms || [])

        } catch (err) {
            setRoomsError(err?.response?.data?.message || 'Error al cargar habitaciones disponibles')
            setRooms([])

        } finally {
            setRoomsLoading(false)
        }
    }

    useEffect(() => {
        fetchAvailableRooms()
    }, [checkInDate, checkOutDate, guests])

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

    const calculateNights = () => {
        if (!checkInDate || !checkOutDate) return 0
        const diffTime = Math.abs(checkOutDate - checkInDate)
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const calculateSubtotal = () => (selectedRoom ? selectedRoom.price * calculateNights() : 0)
    const calculateTaxes = () => calculateSubtotal() * 0.21
    const calculateTotal = () => calculateSubtotal() + calculateTaxes()

    const steps = ['Fechas y Huéspedes', 'Seleccionar Habitación', 'Confirmar Reserva']

    const handleNext = () => {
        if (currentStep === 0 && (!checkInDate || !checkOutDate)) {
            showSnackbar('Por favor selecciona las fechas', 'error')
            return
        }

        if (currentStep === 1 && !selectedRoom) {
            showSnackbar('Por favor selecciona una habitación', 'error')
            return
        }

        setDirection(1)
        setCurrentStep(prev => Math.min(prev + 1, 2))
    }

    const handleBack = () => {
        setDirection(-1)
        setCurrentStep(prev => Math.max(prev - 1, 0))
    }

    const handleConfirm = async () => {
        try {
            const checkIn = checkInDate.toISOString().split('T')[0]
            const checkOut = checkOutDate.toISOString().split('T')[0]
            const bookingData = {
                roomId: selectedRoom.id,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                guests: guests
            }

            const response = await axios.post('http://localhost:3000/booking/', bookingData)

            showSnackbar('¡Reserva confirmada exitosamente!', 'success')
            setTimeout(() => navigate('/my-reservations'), 1200)

        } catch (err) {
            const msg = err?.response?.data?.message || 'Error al crear la reserva'
            showSnackbar(msg, 'error')
        }
    }

    const getAmenityIcon = (amenity) => {
        const map = { 'WiFi': <WifiIcon sx={{ fontSize: 14 }} />, 'TV': <TvIcon sx={{ fontSize: 14 }} />, 'Aire Acondicionado': <AcIcon sx={{ fontSize: 14 }} /> }
        return map[amenity] || <CheckCircleIcon sx={{ fontSize: 14 }} />
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Box sx={{ pb: 8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                            <CalendarIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="700">¿Cuándo querés hospedarte?</Typography>
                                <Typography variant="caption" color="text.secondary">Selecciona tus fechas</Typography>
                            </Box>
                        </Box>

                        <Stack spacing={2}>
                            <DatePicker label="Entrada" value={checkInDate} onChange={setCheckInDate} minDate={new Date()} renderInput={(params) => <TextField {...params} fullWidth size="small" />} />
                            <DatePicker label="Salida" value={checkOutDate} onChange={setCheckOutDate} minDate={checkInDate || new Date()} renderInput={(params) => <TextField {...params} fullWidth size="small" />} />

                            <FormControl fullWidth size="small">
                                <InputLabel>Nº huéspedes</InputLabel>
                                <Select value={guests} onChange={(e) => setGuests(e.target.value)} label="Nº huéspedes">
                                    {[1, 2, 3, 4, 5, 6].map(n => <MenuItem key={n} value={n}>{n} {n === 1 ? 'huésped' : 'huéspedes'}</MenuItem>)}
                                </Select>
                            </FormControl>

                            {checkInDate && checkOutDate && <Alert severity="success" icon={<CheckCircleIcon />} sx={{ py: 0.8, fontSize: '0.85rem' }}>{calculateNights()} noches seleccionadas</Alert>}
                        </Stack>
                    </Box>
                )

            case 1:
                return (
                    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexShrink: 0 }}>
                            <HotelIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="700">Elegí tu habitación</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {!checkInDate || !checkOutDate ? 'Selecciona fechas para ver disponibilidad' : 'Habitaciones disponibles'}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, minHeight: 0, maxHeight: 250, scrollbarWidth: 'thin', scrollbarColor: '#147550ff transparent', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '6px' } }}>
                            <Stack spacing={1.25} sx={{ pb: 1 }}>
                                {roomsLoading && (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">Cargando habitaciones...</Typography>
                                    </Box>
                                )}

                                {roomsError && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {roomsError}
                                    </Alert>
                                )}

                                {!roomsLoading && !roomsError && rooms.length === 0 && checkInDate && checkOutDate && (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <HotelIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            No hay habitaciones disponibles para las fechas seleccionadas
                                        </Typography>
                                    </Box>
                                )}

                                {!roomsLoading && !roomsError && rooms.map(room => {
                                    const imageUrl = `http://localhost:3000${room.images}`
                                    const capacityDiff = room.capacity - guests
                                    const isExactMatch = capacityDiff === 0
                                    const hasExtraCapacity = capacityDiff > 0

                                    return (
                                        <Card key={room.id} onClick={() => setSelectedRoom(room)} sx={{
                                            display: 'flex', cursor: 'pointer', border: selectedRoom?.id === room.id ? '2px solid' : '1px solid',
                                            borderColor: selectedRoom?.id === room.id ? 'primary.main' : 'divider', transition: 'transform .12s',
                                            '&:hover': { transform: 'translateY(-4px)' }
                                        }}>
                                            <CardMedia component="img" image={imageUrl} alt={room.name} sx={{ width: 110 , height: 120, flexShrink: 0 }} />

                                            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.4 }}>
                                                    <Typography variant="subtitle2" fontWeight="700" color="primary.main">{room.name}</Typography>
                                                    {selectedRoom?.id === room.id && <CheckCircleIcon color="primary" sx={{ fontSize: 18 }} />}
                                                </Box>

                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{room.description}</Typography>

                                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                                                    <Chip icon={<BedIcon sx={{ fontSize: 14 }} />} label={room.beds} size="small" />
                                                    <Chip label={room.size} size="small" />
                                                   <Chip label={`Capacidad: ${room.capacity}`} size="small" color={isExactMatch ? 'success' : hasExtraCapacity ? 'info' : 'default'} variant={isExactMatch ? 'filled' : 'outlined'} />
                                                </Stack>

                                                {hasExtraCapacity && (
                                                    <Typography variant="caption" color="primary.main" sx={{ display: 'block', mb: 0.3, fontSize: '0.7rem' }}>
                                                        ✓ Espacio para {capacityDiff} {capacityDiff === 1 ? 'huésped más' : 'huéspedes más'}
                                                    </Typography>
                                                )}

                                                <Typography variant="subtitle2" fontWeight="700" color="secondary.main">${room.price}/noche</Typography>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </Stack>
                        </Box>
                    </Box>
                )

            case 2:
                return (
                    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: "space-between" }} >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <CheckCircleIcon sx={{ fontSize: 24, color: 'primary.main' }} />

                            <Box>
                                <Typography variant="subtitle1" fontWeight="700">Confirmá tu reserva</Typography>
                                <Typography variant="caption" color="text.secondary">Revisá los detalles</Typography>
                            </Box>
                        </Box>

                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', mb: 2, paddingBottom: 1 }}>
                            <Stack spacing={1}>
                                <Typography variant="body2">
                                    <strong>Tipo de habitación:</strong>{' '}
                                    {selectedRoom?.name || '-'}
                                </Typography>

                                <Typography variant="body2">
                                    <strong>Descripción:</strong>{' '}
                                    {selectedRoom?.description || '-'}
                                </Typography>

                                <Typography variant="body2">
                                    <strong>Tu reserva:</strong>{' '}
                                    {guests} {guests === 1 ? 'huésped' : 'huéspedes'} {selectedRoom && guests < selectedRoom.capacity && `(${selectedRoom.capacity - guests} espacio${selectedRoom.capacity - guests === 1 ? ' disponible' : 's disponibles'})`}
                                </Typography>

                                <Typography variant="body2">
                                    <strong>Check-in:</strong>{' '}
                                    {checkInDate ? checkInDate.toLocaleDateString('es-Es', { day: 'numeric', month: 'short' }) : '-'}
                                </Typography>

                                <Typography variant="body2">
                                    <strong>Check-out:</strong>{' '}
                                    {checkOutDate ? checkOutDate.toLocaleDateString('es-Es', { day: 'numeric', month: 'short' }) : '-'}
                                </Typography>

                                <Typography variant="body2" color="secondary.main" fontWeight="600">
                                    <strong>Precio total:</strong>{' '}
                                    {selectedRoom ? `$${calculateSubtotal()}` : '-'}
                                </Typography>

                                <Alert severity="info" icon={<InfoIcon />} sx={{ py: 1, borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                    Al confirmar aceptas las políticas de cancelación y términos del servicio
                                </Alert>
                            </Stack>
                        </Paper>
                    </Box>
                )

            default:
                return null
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5', overflowX: 'hidden' }}>
                <NavBar avatarUrl={avatarUrl} />

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: { xs: 'flex-start', lg: 'center' }, pt: '120px', px: { xs: 2, md: 8 }, pb: 6 }}>
                    <Container maxWidth="xl" sx={{ p: 0 }}>
                        <Box sx={{ width: '100%', maxWidth: 1200 }}>
                            <SectionTitle subtitle="Completa los pasos para confirmar tu reserva">Reserva tu habitación</SectionTitle>

                            <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                                <Stepper activeStep={currentStep} alternativeLabel>
                                    {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                                </Stepper>
                            </Paper>

                            <Grid container spacing={3} alignItems="flex-start">
                                <Grid item xs={12} md={7} lg={7}>
                                    <Paper sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 2, minHeight: 420, maxHeight: 520, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }} elevation={3}>
                                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                            <AnimatePresence mode="wait" custom={direction}>
                                                <motion.div key={currentStep} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ width: '100%' }}>
                                                    {renderStepContent()}
                                                </motion.div>
                                            </AnimatePresence>
                                        </Box>

                                        <Box sx={{ position: 'absolute', bottom: 14, left: 14, right: 14, display: 'flex', gap: 2 }}>
                                            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} disabled={currentStep === 0} sx={{ flex: 1, py: 1 }}>
                                                Atrás
                                            </Button>

                                            {currentStep < 2 ? (
                                                <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext} sx={{ flex: 1, py: 1 }}>
                                                    Continuar
                                                </Button>
                                            ) : (
                                                <Button variant="contained" endIcon={<CheckCircleIcon />} onClick={handleConfirm} disabled={!selectedRoom || !checkInDate || !checkOutDate} sx={{ flex: 1, py: 1 }}>
                                                    Confirmar Reserva
                                                </Button>
                                            )}
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={5} lg={5}>
                                    <Paper elevation={4} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 100, minHeight: 420, maxHeight: 520, overflowY: 'auto', background: 'linear-gradient(135deg,#ffffff 0%,#f8f9fa 100%)', border: '1.5px solid', borderColor: currentStep >= 1 && selectedRoom ? 'primary.main' : 'divider' }}>
                                        <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2 }}>Resumen de la reserva</Typography>

                                        {selectedRoom ? (
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="700">{selectedRoom.name}</Typography>
                                                <Divider sx={{ my: 1.5 }} />

                                                <Stack spacing={1}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="caption" color="text.secondary">Check-in</Typography>
                                                        <Typography variant="body2" fontWeight="600">{checkInDate ? checkInDate.toLocaleDateString('es-ES') : '-'}</Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="caption" color="text.secondary">Check-out</Typography>
                                                        <Typography variant="body2" fontWeight="600">{checkOutDate ? checkOutDate.toLocaleDateString('es-ES') : '-'}</Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="caption" color="text.secondary">Huéspedes</Typography>
                                                        <Typography variant="body2" fontWeight="600">{guests}</Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="caption" color="text.secondary">Capacidad habitación</Typography>
                                                        <Typography variant="body2" fontWeight="600">{selectedRoom?.capacity} personas</Typography>
                                                    </Box>

                                                    {selectedRoom && guests < selectedRoom.capacity && (
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Typography variant="caption" color="text.secondary">Espacio extra</Typography>
                                                            <Typography variant="body2" fontWeight="600" color="primary.main">{selectedRoom.capacity - guests} {selectedRoom.capacity - guests === 1 ? 'persona' : 'personas'}</Typography>
                                                        </Box>
                                                    )}

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="caption" color="text.secondary">Noches</Typography>
                                                        <Typography variant="body2" fontWeight="600">{calculateNights()}</Typography>
                                                    </Box>
                                                </Stack>

                                                <Divider sx={{ my: 1.5 }} />

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">${selectedRoom.price} x {calculateNights()} noches</Typography>
                                                    <Typography variant="body2" fontWeight="600">${calculateSubtotal()}</Typography>
                                                </Box>

                                                <Divider sx={{ my: 1 }} />

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="700">Total</Typography>
                                                    <Typography variant="h6" fontWeight="700" color="secondary.main">${calculateSubtotal()}</Typography>
                                                </Box>

                                                <Alert severity="info" sx={{ mt: 1.5 }} icon={<InfoIcon />}>
                                                    <Typography variant="caption">Cancelación sin costo adicioanal</Typography>
                                                </Alert>
                                            </Box>
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <HotelIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
                                                <Typography variant="body2" color="text.secondary">{currentStep === 0 ? 'Selecciona fechas para continuar' : 'Elige una habitación para ver el resumen'}</Typography>
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </Box>

                <Footer />

                <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    )
}

export default Booking
