import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from '../utils/axiosConfig'
import { motion } from 'framer-motion'

import { Avatar, Box, Typography, Snackbar, Alert, Button, CircularProgress } from '@mui/material'
import { WorkOutline as WorkOutlineIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material'

import ResendActivationForm from '../components/ActivationForm'
import Branding from '../components/BrandHotelDesk'


const Activate = () => {
    const [searchParams] = useSearchParams()
    const [message, setMessage] = useState('Activando usuario...')
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('info')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [showResend, setShowResend] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)

    const token = searchParams.get('token')
    const navigate = useNavigate()
    const activatedRef = useRef(false)

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setOpenSnackbar(true)
    }

    useEffect(() => {
        if (!token || activatedRef.current) return
        activatedRef.current = true

        const activateUser = async () => {
            try {
                const response = await axios.post('http://localhost:3000/auth/activate', { token })
                showSnackbar(response.data.message, 'success')
                setMessage(response.data.message)
                if (response.data.success) setTimeout(() => navigate('/login'), 3000)

            } catch (error) {
                const msg = error?.response?.data?.message || error?.message || "Error al activar usuario"
                showSnackbar(msg, 'error')
                setMessage(msg)
                if (msg === "El enlace es inválido o ha expirado") setShowResend(true)
                setIsLoading(false)
                setIsSuccess(false)

            }
        }

        activateUser()
    }, [token, navigate])

    const handleResendActivation = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.trim()) return setEmailError("Debe ingresar su email")
        if (!emailRegex.test(email)) return setEmailError("Formato de correo inválido")

        setEmailError('')
        setMessage("Reintentando activación...")

        try {
            const response = await axios.post('http://localhost:3000/auth/resend-activation', { email })
            showSnackbar(response.data.message, "success")
            setMessage(response.data.message)
            setShowResend(false)

        } catch (error) {
            const msg = error?.response?.data?.message || "Error al reenviar el enlace"
            showSnackbar(msg, 'error')
            setMessage(msg)
        }
    }


    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative' }}>
            <Branding />

            <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', p: 4 }} >
                <Box sx={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
                    <WorkOutlineIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                    <Typography variant="h6" fontWeight="bold" color="primary">HotelDesk</Typography>
                </Box>

                <Box sx={{ width: '100%', maxWidth: 450, mt: { xs: 8, md: 0 } }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            {isLoading ? (
                                <CircularProgress size={80} sx={{ color: 'primary.main', mb: 2 }} />
                            ) : (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: 'spring' }}>
                                    <Avatar sx={{ mx: 'auto', background: isSuccess ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' : 'linear-gradient(135deg, #f44336 0%, #c62828 100%)', width: 80, height: 80, mb: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                                        {isSuccess ?
                                            <CheckCircleIcon sx={{ fontSize: 50 }} />
                                            : <ErrorIcon sx={{ fontSize: 50 }} />}
                                    </Avatar>
                                </motion.div>
                            )}
                        </Box>

                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary', textAlign: 'center' }}>
                            {isLoading ? 'Activando cuenta' : isSuccess ? '¡Cuenta activada!' : 'Error en activación'}
                        </Typography>

                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center', lineHeight: 1.7 }}>
                            {message}
                        </Typography>

                        {showResend && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <ResendActivationForm email={email} setEmail={setEmail} emailError={emailError} onResend={handleResendActivation} />
                            </motion.div>
                        )}

                        {isSuccess && !isLoading && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
                                <Button variant="contained" fullWidth size="large" onClick={() => navigate('/login')} sx={{ py: 1.5, fontWeight: 'bold', mt: 2, '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }, transition: 'all 0.3s ease' }}>
                                    Ir a iniciar sesión
                                </Button>
                            </motion.div>
                        )}

                        {!isSuccess && !isLoading && !showResend && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
                                <Button variant="outlined" fullWidth size="large" onClick={() => setShowResend(true)} sx={{ py: 1.5, fontWeight: 'bold', mt: 2, borderWidth: 2, '&:hover': { borderWidth: 2, transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}>
                                    Reenviar enlace de activación
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </Box>
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Box>
    )
}

export default Activate