import React, { useState } from 'react'
import { Box, Button, TextField, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import axios from '../utils/axiosConfig'


const FormRegister = ({ showSnackbar, handleChangeAction }) => {
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(true)
    const [errors, setErrors] = useState({ name: '', lastName: '', email: '', password: '' })

    const handleClickShowPassword = () => setShowPassword(prev => !prev)
    const handleMouseDownPassword = (e) => e.preventDefault()

    const validate = () => {
        let temp = { name: '', lastName: '', email: '', password: '' }
        let isValid = true
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!name.trim()) { temp.name = "Debe ingresar su nombre"; isValid = false }
        if (!lastName.trim()) { temp.lastName = "Debe ingresar su apellido"; isValid = false }
        if (!email.trim()) { temp.email = "Debe ingresar su email"; isValid = false }
        else if (!emailRegex.test(email)) { temp.email = "Formato de correo inválido"; isValid = false }

        if (!password) { temp.password = "Debe ingresar su contraseña"; isValid = false }
        else if (!passRegex.test(password)) { temp.password = "Contraseña: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial"; isValid = false }

        setErrors(temp)
        return isValid
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        try {
            const response = await axios.post('http://localhost:3000/auth/register', { name, lastName, email, password })
            showSnackbar(response.data.message, "success")
            if (response.data.success) {
                setTimeout(() => {
                    // Cambiar a la vista de inicio de sesión después del registro exitoso
                    handleChangeAction("Iniciar sesion")
                }, 2000)
            }

        } catch (error) {
            const msg = error.response?.data?.message || "Error al registrarse"
            showSnackbar(msg, "error")
        }
    }

    return (
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ marginTop: 1 }}>
            <TextField placeholder="Ingrese Nombre" fullWidth required sx={{ marginBottom: 2, marginTop: 1 }} value={name}
                onChange={(e) => setName(e.target.value)} error={!!errors.name} helperText={errors.name} slotProps={{ htmlInput: { maxLength: 50 } }}
            />

            <TextField  placeholder="Ingrese Apellido" fullWidth required sx={{ marginBottom: 2, marginTop: 1 }} value={lastName}
                onChange={(e) => setLastName(e.target.value)} error={!!errors.lastName} helperText={errors.lastName} slotProps={{ htmlInput: { maxLength: 50 } }}
            />

            <TextField placeholder="Ingrese Email" type="email" fullWidth required sx={{ marginBottom: 2, marginTop: 1 }} value={email}
                onChange={(e) => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email} slotProps={{ htmlInput: { maxLength: 100 } }}
            />

            <Box sx={{ position: "relative", width: "100%", marginBottom: 2 }}>
                <TextField placeholder="Ingrese Contraseña" type={showPassword ? "password" : "text"} fullWidth required sx={{ marginBottom: 2 }} value={password}
                    onChange={(e) => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password} slotProps={{ htmlInput: { maxLength: 20 } }}
                />
                
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} sx={{ position: "absolute", right: 8, top: 8, color: "primary.main" }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </Box>
            

            <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 1, marginBottom: 1, paddingTop: 1, fontWeight: 'bold', borderRadius: 2 }}>
                Registrarse
            </Button>
        </Box>
    )
}

export default FormRegister
