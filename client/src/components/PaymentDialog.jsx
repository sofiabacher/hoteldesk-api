import React, { useState, useEffect} from 'react'
import axios from '../utils/axiosConfig'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid, Card, CardContent, Divider, Alert, CircularProgress, Chip, Stepper, Step, StepLabel, IconButton } from '@mui/material'
import { Close as CloseIcon, Payment as PaymentIcon, CreditCard as CreditCardIcon, CheckCircle as CheckCircleIcon, Download as DownloadIcon, Email as EmailIcon, Info as InfoIcon } from '@mui/icons-material'

const PaymentDialog = ({ open, onClose, reservation, onSuccess, showSnackbar }) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState(null)
    const [paymentCompleted, setPaymentCompleted] = useState(false)

    useEffect(() => {
        if (open && !reservation) {
            if (showSnackbar) {
                showSnackbar('No se encontró la información de la reserva. Por favor, intenta nuevamente.', 'error')
            }

            setTimeout(() => { onClose()}, 1000)   //Se cierra automáticamente
        }
    }, [open, reservation, onClose, showSnackbar])

    if (open && (!reservation || typeof reservation !== 'object')) {
        return null
    }

    const steps = ['Resumen', 'Pago', 'Confirmar']

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleProcessPayment()
        }
    }

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0))
        setError(null)
    }

    const handleProcessPayment = async () => {
        try {
            setProcessing(true)
            setError(null)

            if (!reservation || !reservation.id) {   //Valida los datos de la reserva
                throw new Error('No se encontró la información de la reserva')
            }

            const response = await axios.post('http://localhost:3000/payment/process', { bookingId: reservation.id })

            if (showSnackbar) {
                showSnackbar('¡Pago procesado exitosamente! El comprobante estará disponible en Mis Reservas.', 'success')
            }

            onSuccess(response.data.data.booking)   //Enviá datos de reserva actualizados

            setTimeout(() => { onClose() }, 2000)  //Cerrar diálogo inmediatamente después del pago exitoso

        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Error al procesar el pago'
            setError(errorMessage)
            if (showSnackbar) { showSnackbar(errorMessage, 'error') }

        } finally {
            setProcessing(false)
        }
    }
  
    const handleClose = () => {
        setCurrentStep(0)
        setProcessing(false)
        setError(null)
        setPaymentCompleted(false)
        onClose()
    }

    const formatDate = (dateString) => {    //Maneja cadenas DATEONLY (AAAA-MM-DD) para evitar problemas de zona horaria
        const [year, month, day] = dateString.split('-')
        const date = new Date(year, month - 1, day)

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const renderStepContent = () => {
        if (!reservation) {
            return (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                        Cargando información de la reserva...
                    </Typography>
                </Box>
            )
        }

        switch (currentStep) {
            case 0:
                return (
                    <Box>
                        <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" color="primary.main" gutterBottom>
                                            {reservation?.room?.name || reservation?.room?.type || 'Habitación'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary"> Código de Confirmación: </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {reservation?.confirmationCode || 'N/A'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary"> Check-in: </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {formatDate(reservation?.checkInDate) || 'N/A'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary"> Check-out: </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {formatDate(reservation?.checkOutDate) || 'N/A'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary"> Huéspedes: </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {reservation?.guests || 0} {reservation?.guests === 1 ? 'huésped' : 'huéspedes'}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6"> Total a Pagar: </Typography>
                                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                                        ${reservation?.totalPrice || 0}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        <Alert severity="info" icon={<InfoIcon />}>
                            Al confirmar el pago, tu reserva será confirmada y la habitación será reservada para ti.
                            Se enviará un correo de confirmación a tu email.
                        </Alert>
                    </Box>
                )

            case 1:
                return (
                    <Box>
                        <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
                            <CardContent>
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <CreditCardIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h6" gutterBottom> Procesamiento Seguro </Typography>
                                    <Typography variant="body2" color="text.secondary"> Tu información de pago está protegida con encriptación de seguridad </Typography>
                                </Box>

                                <Alert severity="info" sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Entorno de Demostración</strong><br/>
                                        En producción, aquí se mostraría el formulario de pago seguro.
                                    </Typography>
                                </Alert>

                                <Alert severity="success">
                                    <Typography variant="body2"> Al presionar "Continuar", procesaremos tu pago de demostración para confirmar la reserva. </Typography>
                                </Alert>
                            </CardContent>
                        </Card>
                    </Box>
                )

            case 2:
                return (
                    <Box>
                        {paymentCompleted ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                                <Typography variant="h5" color="success.main" gutterBottom> ¡Pago Procesado Exitosamente! </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom> Tu reserva ha sido confirmada y el pago ha sido procesado correctamente. </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <PaymentIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom> Confirmar Pago </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    Estás a punto de procesar el pago de ${reservation?.totalPrice || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Al hacer clic en "Pagar", tu reserva será confirmada inmediatamente.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )

            default:
                return null
        }
    }

    return (
        <Dialog
            open={open && reservation} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: {  borderRadius: 3, minHeight: 600 } } }} >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" component="div"> Procesar Pago </Typography>
                    <IconButton onClick={handleClose} disabled={processing}> <CloseIcon /> </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {renderStepContent()}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                {!paymentCompleted && (
                    <>
                        <Button onClick={handleClose} disabled={processing}> Cancelar </Button>
                        <Button onClick={handleBack} disabled={currentStep === 0 || processing}> Atrás </Button>
                        <Button  onClick={handleNext} variant="contained" disabled={processing} startIcon={processing ? <CircularProgress size={20} /> : <PaymentIcon />} >
                            {processing ? 'Procesando...' : currentStep === steps.length - 1 ? 'Pagar Ahora' : 'Continuar →'}
                        </Button>
                    </>
                )}

                {paymentCompleted && (
                    <Button onClick={handleClose} variant="contained" fullWidth> Cerrar </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default PaymentDialog