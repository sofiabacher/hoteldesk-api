import React from "react"
import { Box, TextField, Button } from '@mui/material'


const ProfileForm = ({ formData, errors, onChange, onSubmit }) => {
    return (
        <Box component="form" onSubmit={onSubmit} sx={{ marginTop: 3}}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
                <TextField label="Nombre" fullWidth  value={formData.name} onChange={(e) => onChange("name", e.target.value)} error={!!errors.name}  helperText={errors.name} slotProps={{ htmlInput: { maxLength: 50 } }} />
                <TextField label="Apellido" fullWidth value={formData.lastName} onChange={(e) => onChange("lastName", e.target.value)} error={!!errors.lastName}  helperText={errors.lastName} slotProps={{ htmlInput: { maxLength: 50 } }} />
                <TextField label="Email" fullWidth disabled value={formData.email} slotProps={{ htmlInput: { maxLength: 100 } }} />
                <TextField label="Teléfono" fullWidth value={formData.phone} onChange={(e) => onChange("phone", e.target.value)} error={!!errors.phone} helperText={errors.phone} slotProps={{ htmlInput: { maxLength: 20 } }} />
                <TextField label="Fecha de Nacimiento (DD-MM-YYYY)" fullWidth value={formData.birthdate} onChange={(e) => onChange("birthdate", e.target.value)} error={!!errors.birthdate} helperText={errors.birthdate} slotProps={{ htmlInput: { maxLength: 10 } }} placeholder="DD-MM-YYYY" />
                <TextField label="DNI" fullWidth value={formData.dni} onChange={(e) => onChange("dni", e.target.value)} error={!!errors.dni} helperText={errors.dni} slotProps={{ htmlInput: { maxLength: 15 } }} />
            </Box>

            <Box textAlign="right" marginTop={3}>
                <Button type="submit" variant="contained"> Guardar cambios </Button>
            </Box>
        </Box>
    )
}

export default ProfileForm