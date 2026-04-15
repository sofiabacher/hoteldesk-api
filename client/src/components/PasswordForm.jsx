import React from 'react'
import { Box, TextField, Button, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'


const ResetPasswordForm = ({ password, setPassword, confirmPassword, setConfirmPassword, errors, showPassword, setShowPassword, showPasswordConfirm, setShowPasswordConfirm, onSubmit }) => {
    return (
        <Box component="form" noValidate onSubmit={onSubmit}>
            <Box sx={{ position: "relative", marginBottom: 3 }}>
                <TextField placeholder="Ingrese nueva contraseña" type={showPassword ? "password" : "text"} fullWidth required value={password}
                    onChange={(e) => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password} slotProps={{ htmlInput: { maxLength: 20 } }} 
                />

                <IconButton onClick={() => setShowPassword(prev => !prev)} sx={{ position: "absolute", right: 8, top: 8, color: "primary.main" }} >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </Box>

            <Box sx={{ position: "relative", marginBottom: 3 }}>
                <TextField  placeholder="Confirme contraseña" type={showPasswordConfirm ? "password" : "text"} fullWidth  required value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} error={!!errors.confirmPassword} helperText={errors.confirmPassword} slotProps={{ htmlInput: { maxLength: 20 } }}
                />

                <IconButton onClick={() => setShowPasswordConfirm(prev => !prev)} sx={{ position: "absolute", right: 8, top: 8, color: "primary.main" }} >
                    {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </Box>

            <Button type="submit" variant="contained" fullWidth disabled={!password || !confirmPassword} sx={{py: 1, fontWeight: 'bold', borderRadius: 2,  '&:hover': { transform: 'translateY(-2px)',  boxShadow: 4 }, transition: 'all 0.3s ease' }} >
                Restablecer contraseña
            </Button>
        </Box>
    )
}

export default ResetPasswordForm
