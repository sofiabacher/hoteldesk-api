import React, { useState, useEffect } from 'react'
import axios from '../utils/axiosConfig'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Alert, CircularProgress, Chip, Divider } from '@mui/material';
import { Warning as WarningIcon, Cancel as CancelIcon, CheckCircle as CheckCircleIcon, Hotel as HotelIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';

const CancellationDialog = ({ open, onClose, reservation, onSuccess, showSnackbar }) => {
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (open && (!reservation || !reservation.id)) {
            setTimeout(() => { if (onClose) onClose() }, 100)
        }
    }, [reservation, open])

    const handleConfirmCancellation = async () => {
        try {
            if (!reservation || !reservation.id) {
                const errorMsg = 'No se encontró la información de la reserva. Por favor, intenta nuevamente.'
                setError(errorMsg)
                if (showSnackbar) showSnackbar(errorMsg, 'error')
                setTimeout(() => onClose(), 2000)
                return
            }

            setProcessing(true)
            setError(null)

            const token = localStorage.getItem('token')   //Revisa si el token existe antes de hacer la petición
            const response = await axios.delete(`http://localhost:3000/booking/${reservation.id}`)

            if (showSnackbar) {
                showSnackbar('Reserva cancelada exitosamente', 'success')
            }

            if (onSuccess && response.data?.data?.booking) {  //Actualizar la lista de reservas con estado cancelada
                onSuccess(response.data.data.booking)
            } else {
                setTimeout(() => { onClose() }, 1500)
            }

        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Error al cancelar la reserva'
            setError(errorMessage)
            if (showSnackbar) {
                showSnackbar(errorMessage, 'error')
            }

        } finally {
            setProcessing(false)
        }
    }

    const handleClose = () => {
        setProcessing(false)
        setError(null)
        onClose()
    }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-')
        const date = new Date(year, month - 1, day)

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    if (!reservation) { return null }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, minHeight: 400 } } }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <WarningIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                    <Typography variant="h5" component="div"> Cancelar Reserva </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 3, paddingTop: 2}}>
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                        ¿Estás seguro que quieres cancelar esta reserva?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Esta acción no se puede deshacer. La habitación volverá a estar disponible y el estado de tu reserva será cambiado permanentemente.
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" gutterBottom> Detalles de la reserva: </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HotelIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                                {reservation.room?.name || 'Habitación'} ({reservation.room?.type || 'Estándar'})
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                                {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary"> Código: </Typography>
                           <Chip label={reservation.confirmationCode} size="small" color="primary" variant="outlined" />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary"> Total: </Typography>
                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                                ${reservation.totalPrice}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button onClick={handleClose} disabled={processing} variant="outlined" sx={{ flex: 1 }}>
                    Mantener Reserva
                </Button>
                <Button onClick={handleConfirmCancellation} disabled={processing} variant="contained" color="error" startIcon={processing ? <CircularProgress size={20} /> : <CancelIcon />} sx={{ flex: 1 }}>
                    {processing ? 'Cancelando...' : 'Confirmar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CancellationDialog