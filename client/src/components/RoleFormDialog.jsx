import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, Chip, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, FormHelperText, Grid, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import { Close as CloseIcon } from '@mui/icons-material'

const RoleFormDialog = ({ open, onClose, onSubmit, editingRole = null, availablePermissions = [], loading = false, showSnackbar }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: []
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (open) {
            if (editingRole) {
                setFormData({
                    name: editingRole.name || '',
                    description: editingRole.description || '',
                    permissions: editingRole.Permissions ? editingRole.Permissions.map(p => p.id) : []
                })
                
            } else {
                setFormData({
                    name: '',
                    description: '',
                    permissions: []
                })
            }
            setErrors({})
        }
    }, [open, editingRole])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del rol es requerido'
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'El nombre debe tener al menos 2 caracteres'
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'El nombre no puede exceder los 50 caracteres'
        }

        if (formData.description && formData.description.length > 200) { newErrors.description = 'La descripción no puede exceder los 200 caracteres' }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const handleSubmit = () => {
        if (!validateForm()) {
            showSnackbar('Por favor, corrige los errores en el formulario', 'error')
            return
        }

        const submitData = {
            name: formData.name.trim(),
            description: formData.description ? formData.description.trim() : null,
            permissions: formData.permissions
        }

        onSubmit(submitData)
    }

    const handlePermissionChange = (event) => {
        const { value } = event.target
        setFormData(prev => ({
            ...prev,
            permissions: typeof value === 'string' ? value.split(',') : value
        }))
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' } }}>
            <DialogTitle sx={{ pb: 2, backgroundColor: "#d2fadcff" }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ fontSize: 20, fontWeight: 600, color: '#29a374' }}>
                        {editingRole ? 'Editar Rol' : 'Nuevo Rol'}
                    </Box>

                    <Button onClick={onClose} sx={{ minWidth: 'auto', p: 1 }} startIcon={<CloseIcon />} />
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        Completa los campos obligatorios (*) para {editingRole ? 'actualizar' : 'crear'} el rol.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Nombre" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required size="small" error={!!errors.name} helperText={errors.name} disabled={loading} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth label="Descripción" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} size="small" error={!!errors.description} helperText={errors.description} disabled={loading} />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth size="small" error={!!errors.permissions}>
                            <Select multiple value={formData.permissions} onChange={handlePermissionChange} displayEmpty disabled={loading}
                                renderValue={(selected) => { if (selected.length === 0) { return <em>Selecciona permisos</em>; } return `${selected.length} seleccionado${selected.length > 1 ? 's' : ''}`; }}
                            >
                                {availablePermissions.map((permission) => (
                                    <MenuItem key={permission.id} value={permission.id}>
                                        <Checkbox checked={formData.permissions.indexOf(permission.id) > -1} />
                                        <ListItemText primary={permission.name} secondary={permission.description} />
                                    </MenuItem>
                                ))}
                            </Select>

                            {errors.permissions && (
                                <FormHelperText>{errors.permissions}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Nota: Los roles del sistema (Admin, Guest, Recepcionista, Cleaning) no pueden ser modificados ni eliminados. Solo los roles personalizados creados por administradores pueden ser editados y eliminados.
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <LoadingButton onClick={handleSubmit} loading={loading} variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'medium', minWidth: 120 }}>
                    {editingRole ? 'Actualizar' : 'Crear'}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default RoleFormDialog