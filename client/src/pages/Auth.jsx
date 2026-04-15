import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'
import { motion } from 'framer-motion'

import { Box, Typography, Link, Snackbar, Alert, TextField, Button, IconButton } from '@mui/material'
import { WorkOutline as WorkOutlineIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'

import FormLogin from '../components/LoginForm'
import FormRegister from '../components/RegisterForm'
import Branding from '../components/BrandHotelDesk'


const LoginSignUp = () => {
    const [action, setAction] = useState("Iniciar sesion")
    const navigate = useNavigate()

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('success')

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setOpenSnackbar(true)
    }

    const handleChangeAction = (newAction) => {
        setAction(newAction)
        setEmail('')
        setError('')
    }

    const handleRecoverPassword = async (e) => {
        e.preventDefault()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!email.trim()) {
            setError("Debe ingresar su email")
            return
        } else if (!emailRegex.test(email)) {
            setError("Formato de correo inválido")
            return
        }

        try {
            const response = await axios.post('http://localhost:3000/auth/recover-password', { email })
            showSnackbar(response.data.message, "success")
            handleChangeAction("Iniciar sesion")

        } catch (error) {
            const msg = error?.response?.data?.message || "Error al enviar el correo de recuperación"
            showSnackbar(msg, "error")
            setError(msg)
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex' }}>
            <Branding />

            <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', p: 4 }} >
                <Box sx={{ position: 'absolute', top: 20, left: 20, display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/')} >
                    <WorkOutlineIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                    <Typography variant="h6" fontWeight="bold" color="primary"> HotelDesk </Typography>
                </Box>

                <Box sx={{ width: '100%', maxWidth: 450 }}>
                    {action === "Recuperar contraseña" && (
                        <IconButton onClick={() => handleChangeAction("Iniciar sesion")} sx={{ mb: 2, color: 'primary.main' }} >
                            <ArrowBackIcon />
                        </IconButton>
                    )}

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} >
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }} >
                            {action === "Iniciar sesion" && "Bienvenido de nuevo"}
                            {action === "Registrarse" && "Crear tu cuenta"}
                            {action === "Recuperar contraseña" && "Recuperar contraseña"}
                        </Typography>

                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }} >
                            {action === "Iniciar sesion" && "Ingresa tus credenciales para continuar"}
                            {action === "Registrarse" && "Completa el formulario para registrarte"}
                            {action === "Recuperar contraseña" && "Te enviaremos un enlace de recuperación"}
                        </Typography>
                    </motion.div>

                    {action === "Iniciar sesion" && (
                        <FormLogin showSnackbar={showSnackbar} handleChangeAction={handleChangeAction} />
                    )}

                    {action === "Registrarse" && (
                        <FormRegister showSnackbar={showSnackbar} handleChangeAction={handleChangeAction} />
                    )}

                    {action === "Recuperar contraseña" && (
                        <Box component="form" onSubmit={handleRecoverPassword}>
                            <TextField fullWidth label="Correo electrónico" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} error={!!error} helperText={error} sx={{ mb: 3 }} />
                            <Button type="submit" variant="contained" fullWidth size="large" sx={{ py: 1.5, fontWeight: 'bold' }} > Enviar enlace </Button>
                        </Box>
                    )}

                    {action !== "Recuperar contraseña" && (
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            {action === "Registrarse" ? (
                                <Typography variant="body2" color="text.secondary"> ¿Ya tienes cuenta?{' '}
                                    <Link component="button" onClick={() => handleChangeAction("Iniciar sesion")} sx={{ fontWeight: 600, textDecoration: 'none' }} > Inicia sesión </Link>
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="text.secondary">  ¿No tienes cuenta?{' '}
                                    <Link component="button" onClick={() => handleChangeAction("Registrarse")} sx={{ fontWeight: 600, textDecoration: 'none' }} > Regístrate </Link>
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }} >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default LoginSignUp