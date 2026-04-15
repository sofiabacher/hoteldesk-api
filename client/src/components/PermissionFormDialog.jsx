import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import { Close as CloseIcon } from '@mui/icons-material'

const PermissionFormDialog = ({ open, onClose, onSubmit, editingPermission = null, loading = false, showSnackbar }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        module: '',
        action: ''
    })

    const [errors, setErrors] = useState({})

    const modules = [
        { value: 'admin', label: 'Administración' },
        { value: 'users', label: 'Usuarios' },
        { value: 'roles', label: 'Roles' },
        { value: 'rooms', label: 'Habitaciones' },
        { value: 'bookings', label: 'Reservas' },
        { value: 'reports', label: 'Reportes' },
        { value: 'bitacora', label: 'Bitácora' },
        { value: 'payments', label: 'Pagos' }
    ]

    const actions = [
        { value: 'view', label: 'Ver' },
        { value: 'create', label: 'Crear' },
        { value: 'edit', label: 'Editar' },
        { value: 'delete', label: 'Eliminar' },
        { value: 'manage', label: 'Gestionar' },
        { value: 'assign', label: 'Asignar' },
        { value: 'export', label: 'Exportar' }
    ]

    useEffect(() => {
        if (open) {
            if (editingPermission) {
                setFormData({
                    name: editingPermission.name || '',
                    description: editingPermission.description || '',
                    module: editingPermission.module || '',
                    action: editingPermission.action || ''
                })

            } else {
                setFormData({
                    name: '',
                    description: '',
                    module: '',
                    action: ''
                })
            }
            setErrors({})
        }
    }, [open, editingPermission])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del permiso es requerido'
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres'
        } else if (formData.name.trim().length > 100) {
            newErrors.name = 'El nombre no puede exceder los 100 caracteres'
        }

        if (!formData.module) {
            newErrors.module = 'El módulo es requerido'
        }

        if (!formData.action) {
            newErrors.action = 'La acción es requerida'
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'La descripción no puede exceder los 500 caracteres'
        }

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

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validateForm()) return

        const submitData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            module: formData.module,
            action: formData.action
        }

        onSubmit(submitData)
    }

    const handleClose = () => {
        setErrors({})
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' } }}>
            <DialogTitle sx={{ pb: 2, borderBottom: '2px solid', borderColor: 'primary.main', backgroundColor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                    {editingPermission ? 'Editar Permiso' : 'Nuevo Permiso'}
                </Typography>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Nombre del Permiso" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} error={!!errors.name} helperText={errors.name} placeholder="Ej: admin.users.view" disabled={loading} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.module}>
                                <InputLabel>Módulo *</InputLabel>
                                <Select value={formData.module} label="Módulo" onChange={(e) => handleChange('module', e.target.value)} disabled={loading} sx={{ borderRadius: 2, width: '180px' }}>
                                    {modules.map((module) => (
                                        <MenuItem key={module.value} value={module.value}>
                                            {module.label}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {errors.module && (
                                    <FormHelperText>{errors.module}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField fullWidth label="Descripción" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} error={!!errors.description} helperText={errors.description || 'Descripción opcional del permiso'} placeholder="Describe qué permite hacer este permiso..." disabled={loading} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.action}>
                                <InputLabel>Acción *</InputLabel>
                                <Select value={formData.action} label="Acción *" onChange={(e) => handleChange('action', e.target.value)} disabled={loading} sx={{ borderRadius: 2, width: '150px' }}>
                                    {actions.map((action) => (
                                        <MenuItem key={action.value} value={action.value}>
                                            {action.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.action && (
                                    <FormHelperText>{errors.action}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {formData.name && formData.module && formData.action && (
                            <Grid item xs={12}>
                                <Box sx={{ p: 2, border: '2px dashed', borderColor: 'primary.main', borderRadius: 2, backgroundColor: 'rgba(41, 163, 116, 0.05)' }}>
                                    <Typography variant="subtitle2" color="primary.main" fontWeight="bold" gutterBottom>
                                        Vista previa del permiso:
                                    </Typography>
                                    
                                    <Typography variant="body1" fontFamily="monospace" sx={{ backgroundColor: 'grey.100', p: 1, borderRadius: 1, border: '1px solid', borderColor: 'grey.300' }}>
                                        {formData.module}.{formData.action}
                                    </Typography>

                                    {formData.description && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            {formData.description}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button onClick={handleClose} disabled={loading} startIcon={<CloseIcon />} sx={{ borderRadius: 2, px: 3 }}>
                        Cancelar
                    </Button>

                    <LoadingButton type="submit" loading={loading} variant="contained" sx={{ borderRadius: 2, px: 3, backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>
                        {editingPermission ? 'Actualizar' : 'Crear'}
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default PermissionFormDialog