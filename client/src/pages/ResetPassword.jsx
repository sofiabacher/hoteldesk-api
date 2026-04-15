import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'
import { motion } from 'framer-motion'

import { Avatar, Box, Button, Typography, Snackbar, Alert, TextField, CircularProgress } from '@mui/material'
import { LockReset as LockResetIcon, WorkOutline as WorkOutlineIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material'

import ResetPasswordForm from '../components/PasswordForm'
import Branding from '../components/BrandHotelDesk'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()
    const validatedRef = useRef(false)

    const [tokenValid, setTokenValid] = useState(null)
    const [message, setMessage] = useState('Validando enlace...')
    const [isLoading, setIsLoading] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({ password: '', confirmPassword: '' })

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [showResend, setShowResend] = useState(false)

    const [showPassword, setShowPassword] = useState(true)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(true)

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('info')

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setOpenSnackbar(true)
    }

    useEffect(() => {
        if (!token || validatedRef.current) return
        validatedRef.current = true

        const validateToken = async () => {
            try {
                await axios.post('http://localhost:3000/auth/validate-reset-token', { token })
                setTokenValid(true)
                setMessage("Ingrese su nueva contraseña")
                setIsLoading(false)

            } catch (error) {
                const msg = error?.response?.data?.message || "Enlace inválido o expirado"
                setMessage(msg)
                setShowResend(true)
                setTokenValid(false)
                setIsLoading(false)
            }
        }
        validateToken()
    }, [token])

    const validate = () => {
        let temp = { password: '', confirmPassword: '' }
        let isValid = true
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (!password) {
            temp.password = "Debe ingresar una nueva contraseña"
            isValid = false
        } else if (!passRegex.test(password)) {
            temp.password = "Contraseña: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial"
            isValid = false
        }

        if (!confirmPassword) {
            temp.confirmPassword = "Debe confirmar la contraseña"
            isValid = false
        } else if (password !== confirmPassword) {
            temp.confirmPassword = "Las contraseñas no coinciden"
            isValid = false
        }

        setErrors(temp)
        return isValid
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        try {
            const response = await axios.post('http://localhost:3000/auth/reset-password', { token, password, confirmPassword })
            showSnackbar(response.data.message, 'success')
            setMessage(response.data.message)
            setIsSuccess(true)
            setIsLoading(false)
            if (response.data.success) setTimeout(() => navigate('/login'), 3000)

        } catch (error) {
            const msg = error?.response?.data?.message || "Error al restablecer la contraseña"
            showSnackbar(msg, "error")
            setMessage(msg)
            setIsLoading(false)
            if (msg === "El enlace es inválido o ha expirado") setShowResend(true)
        }
    }

    const handleResendRecover = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.trim()) return setEmailError("Debe ingresar su email")
        if (!emailRegex.test(email)) return setEmailError("Formato de correo inválido")

        setEmailError('')
        setMessage("Enviando enlace de recuperación...")
        setIsLoading(true)

        try {
            const response = await axios.post('http://localhost:3000/auth/recover-password', { email })
            showSnackbar(response.data.message, "success")
            setMessage(response.data.message)
            setShowResend(false)
            setIsLoading(false)
            setIsSuccess(true)

        } catch (error) {
            const msg = error?.response?.data?.message || "Error al reenviar el enlace"
            showSnackbar(msg, 'error')
            setMessage(msg)
            setIsLoading(false)
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative' }}>
            <Branding />

            <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', p: 4 }}>
                <Box sx={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
                    <WorkOutlineIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                    <Typography variant="h6" fontWeight="bold" color="primary"> HotelDesk </Typography>
                </Box>

                <Box sx={{ width: '100%', maxWidth: 450, mt: { xs: 8, md: 0 } }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            {isLoading ? (
                                <CircularProgress size={80} sx={{ color: 'primary.main', mb: 2 }} />
                            ) : (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: 'spring' }} >
                                    <Avatar sx={{ mx: 'auto', background: isSuccess ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' : tokenValid === false ? 'linear-gradient(135deg, #f44336 0%, #c62828 100%)' : 'linear-gradient(135deg, #29a374 0%, #1b7050 100%)', width: 80, height: 80, mb: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                                        {isSuccess ? (
                                            <CheckCircleIcon sx={{ fontSize: 50 }} />
                                        ) : tokenValid === false ? (
                                            <ErrorIcon sx={{ fontSize: 50 }} />
                                        ) : (
                                            <LockResetIcon sx={{ fontSize: 50 }} />
                                        )}
                                    </Avatar>
                                </motion.div>
                            )}
                        </Box>

                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary', textAlign: 'center' }} >
                            {isLoading && tokenValid === null
                                ? 'Validando enlace...'
                                : isSuccess
                                    ? '¡Contraseña restablecida!'
                                    : tokenValid === false
                                        ? 'Enlace inválido'
                                        : 'Restablecer contraseña'}
                        </Typography>

                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center', lineHeight: 1.7 }}>
                            {message}
                        </Typography>

                        {tokenValid === true && !showResend && !isSuccess && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <ResetPasswordForm password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} errors={errors}
                                    showPassword={showPassword} setShowPassword={setShowPassword} showPasswordConfirm={showPasswordConfirm} setShowPasswordConfirm={setShowPasswordConfirm} onSubmit={handleSubmit} />
                            </motion.div>
                        )}

                        {tokenValid === false && showResend && !isSuccess && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <Box>
                                    <TextField label="Correo electrónico" placeholder="ejemplo@correo.com" type="email" fullWidth value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(''); }} error={!!emailError} helperText={emailError} sx={{ mb: 3 }} />
                                    <Button type="button" variant="contained" fullWidth size="large" onClick={handleResendRecover} sx={{ py: 1.5, fontWeight: 'bold', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }, transition: 'all 0.3s ease' }}>
                                        Reenviar enlace de recuperación
                                    </Button>
                                </Box>
                            </motion.div>
                        )}

                        {isSuccess && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
                                <Button variant="contained" fullWidth size="large" onClick={() => navigate('/login')} sx={{ py: 1.5, fontWeight: 'bold', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }, transition: 'all 0.3s ease' }}>
                                    Ir a iniciar sesión
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

export default ResetPassword