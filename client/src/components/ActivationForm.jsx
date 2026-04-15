import React from 'react'
import { Box, TextField, Button, Paper } from '@mui/material'

const ResendActivationForm = ({ email, setEmail, emailError, onResend }) => {
    return (
        <Box component="form" noValidate onSubmit={(e) => e.preventDefault()}>
            <TextField
                placeholder="Ingrese Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: 2, marginTop: 1 }}
                error={!!emailError}
                helperText={emailError}
                slotProps={{ htmlInput: { maxLength: 100 } }}
            />

            <Button type="button" variant="contained" fullWidth onClick={onResend} sx={{ marginTop: 1, marginBottom: 1, paddingTop: 1, fontWeight: 'bold', borderRadius: 2 }} >
                Reenviar enlace de activación
            </Button>
        </Box>
    )
}

export default ResendActivationForm
