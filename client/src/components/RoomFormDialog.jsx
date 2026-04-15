import React, { useState } from 'react'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid, Checkbox, ListItemText, Divider, Typography, Snackbar, Alert, IconButton } from '@mui/material'
import { Close as CloseIcon, Add as AddIcon, Remove as RemoveIcon, CloudUpload as UploadIcon } from '@mui/icons-material'
import { AMENITY_LABELS } from '../utils/constants'
import axios from '../utils/axiosConfig'

const RoomFormDialog = ({ open, onClose, onSubmit, formData, onInputChange, onAmenitiesChange, editingRoom, roomTypes = [], roomStates = {}, amenityOptions = [], showSnackbar }) => {
    const [errors, setErrors] = useState({})
    const [uploading, setUploading] = useState(false)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']  // Validar tipo de archivo
        if (!allowedTypes.includes(file.type)) {
            showSnackbar("Solo imágenes con formato JPEG, JPG o PNG", "error")
            return
        }

        const formData_upload = new FormData()
        formData_upload.append("image", file)

        try {
            setUploading(true)
            const response = await axios.post('http://localhost:3000/rooms/upload-image', formData_upload, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            const finalUrl = `http://localhost:3000${response.data.url.imageUrl}`
            onInputChange('images', finalUrl)
            showSnackbar("Imagen cargada exitosamente", "success")

        } catch (error) {
            showSnackbar("Error al cargar la imagen", "error")
        } finally {
            setUploading(false)
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name || formData.name.trim() === '') { newErrors.name = 'El nombre de la habitación es obligatorio' }
        if (!formData.type) { newErrors.type = 'El tipo de habitación es obligatorio' }

        if (!formData.capacity || formData.capacity < 1) {
            newErrors.capacity = 'La capacidad debe ser al menos 1 persona'
        } else if (formData.capacity > 6) {
            newErrors.capacity = 'La capacidad no puede ser mayor a 6 personas'
        }

        if (!formData.price || formData.price <= 0) { newErrors.price = 'El precio debe ser mayor a 0' }
        if (!formData.roomStateId) { newErrors.roomStateId = 'El estado de la habitación es obligatorio' }

        if (!formData.images || formData.images.trim() === '') {
            newErrors.images = 'La imagen de la habitación es obligatoria'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field, value) => {
        if (errors[field]) { setErrors(prev => ({ ...prev, [field]: undefined })) }
        onInputChange(field, value)
    }

    const handleAmenitiesChange = (event) => {
        const { value } = event.target
        onInputChange('amenities', typeof value === 'string' ? value.split(',') : value)
    }

    const handleSubmit = () => { if (validateForm()) { onSubmit() } }
    const safeAmenities = Array.isArray(formData.amenities) ? formData.amenities : []

  return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' } }}>
            <DialogTitle sx={{ pb: 2, backgroundColor: "#d2fadcff" }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ fontSize: 20, fontWeight: 600, color: '#29a374'}}>
                        {editingRoom ? 'Editar Habitación' : 'Nueva habitación'}
                    </Box>

                    <Button onClick={onClose} sx={{ minWidth: 'auto', p: 1 }} startIcon={<CloseIcon />} />
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ mb: 3}}>
                    <Typography variant="body2" color="text.secondary">
                        Completa los campos obligatorios (*) para {editingRoom ? 'actualizar' : 'crear'} la habitación.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Nombre *" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required size="small" error={!!errors.name} helperText={errors.name} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField fullWidth select label="Tipo *" value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)} required size="small" error={!!errors.type} helperText={errors.type} sx={{ '& .MuiInputBase-input': { minWidth: '60px' } }} >
                            {roomTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    <Typography sx={{ fontWeight: 500 }}>{type}</Typography>
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                            <TextField fullWidth label="Capacidad" type="number" value={formData.capacity} onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))} required size="small" 
                                inputProps={{ min: 1, max: 6, step: 1 }} sx={{ '& .MuiInputBase-input': { minWidth: '80px' } }} error={!!errors.capacity} helperText={errors.capacity} />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Precio x noche" type="number" value={formData.price} onChange={(e) => handleInputChange('price', parseFloat(e.target.value))} required size="small" inputProps={{ min: 0, step: 0.01 }}
                            InputProps={{ startAdornment: <span style={{ fontSize: '0.9rem', color: '#666' }}>$</span> }}
                            sx={{ '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 }, '& input[type=number]': { MozAppearance: 'textfield' } }} error={!!errors.price} helperText={errors.price} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Tamaño" value={formData.size} onChange={(e) => handleInputChange('size', e.target.value)} placeholder="Ej: 30" size="small"
                            InputProps={{ endAdornment: <span style={{ fontSize: '0.9rem', color: '#666' }}> m²</span> }}
                            sx={{ '& .MuiInputBase-input': { width: '75px' } }}  
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Cantidad de camas" value={formData.beds} onChange={(e) => handleInputChange('beds', e.target.value)} placeholder="Ej: 1 cama king size" size="small" />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField fullWidth select label="Estado" value={formData.roomStateId} onChange={(e) => handleInputChange('roomStateId', parseInt(e.target.value))} required size="small" error={!!errors.roomStateId} helperText={errors.roomStateId} disabled={!editingRoom} InputLabelProps={{ shrink: true }} >
                            {Object.entries(roomStates).map(([key, state]) => (
                                <MenuItem key={key} value={key}>
                                    <Typography sx={{ fontWeight: 500 }}>{state.label}</Typography>
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                       <TextField fullWidth label="Descripción" value={formData.description} onChange={(e) => onInputChange('description', e.target.value)} size="small" sx={{ '& .MuiInputBase-input': { fontSize: '1rem' } }} />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth size="small">
                            <InputLabel shrink>Comodidades</InputLabel>

                            <Select multiple value={safeAmenities} label="Comodidades" onChange={onAmenitiesChange} displayEmpty sx={{ '& .MuiInputBase-input': { fontSize: '1rem' } }}
                                renderValue={(selected) => { if (selected.length === 0) { return <em>Comodidades</em>; } return `${selected.length} seleccionada${selected.length > 1 ? 's' : ''}`; }}
                            >
                                {amenityOptions.map((amenity) => (
                                    <MenuItem key={amenity} value={amenity}>
                                        <Checkbox checked={safeAmenities.indexOf(amenity) > -1} />
                                        <ListItemText primary={`${AMENITY_LABELS[amenity]?.icon || ''} ${AMENITY_LABELS[amenity]?.label || amenity}`} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField fullWidth label="Imágenes" value={formData.images || ''} onChange={(e) => handleInputChange('images', e.target.value)} placeholder="URL o usa el botón" size="small" error={!!errors.images} helperText={errors.images} />
                            <input type="file" id="room-image-upload" accept="image/jpeg,image/jpg,image/png" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} />
                            
                            <label htmlFor="room-image-upload">
                                <IconButton color="primary" component="span" disabled={uploading} sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' }, '&:disabled': { backgroundColor: 'grey.300', color: 'grey.500' } }} title="Subir imagen">
                                    {uploading ? <div style={{ width: 20, height: 20 }}><div className="spinner" style={{ border: '2px solid #f3f3f3', borderTop: '2px solid #fff', borderRadius: '50%', width: 16, height: 16, animation: 'spin 1s linear infinite' }}></div></div> : <UploadIcon />}
                                </IconButton>
                            </label>
                        </Box>
                        {formData.images && (
                            <Box sx={{ mt: 2 }}>
                                <img src={formData.images} alt="Vista previa" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: 8 }} />
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'medium', minWidth: 120 }}>
                    {editingRoom ? 'Actualizar' : 'Crear'}
                </Button>
            </DialogActions>

            <Snackbar open={Object.keys(errors).length > 0} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => setErrors({})}>
                <Alert severity="error" onClose={() => setErrors({})} sx={{ width: '100%' }}>
                    Por favor, corrija los errores antes de continuar
                </Alert>
            </Snackbar>
        </Dialog>
    )
}

export default RoomFormDialog