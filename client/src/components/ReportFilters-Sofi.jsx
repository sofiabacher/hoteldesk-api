import React from 'react'
import { Box, Grid, Paper, TextField, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material'
import { FilterList as FilterIcon } from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'

const ReportFilters = ({ filters, onFilterChange, reportConfig }) => {
    const handleDateChange = (field, value) => { onFilterChange({ ...filters, [field]: value }) }
    const handleSelectChange = (field, value) => { onFilterChange({ ...filters, [field]: value }) }

    // No mostrar filtros para el reporte de integridad
    if (reportConfig.title === 'Reporte de Integridad') {
        return null
    }

    return (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FilterIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" fontWeight="bold" color="primary.main"> Parámetros del Reporte </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker label="Fecha de Inicio" value={filters.startDate} onChange={(newValue) => handleDateChange('startDate', newValue)} slotProps={{ textField: { fullWidth: true } }} />
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker label="Fecha de Fin" value={filters.endDate} onChange={(newValue) => handleDateChange('endDate', newValue)} slotProps={{ textField: { fullWidth: true } }} />
                    </LocalizationProvider>
                </Grid>

                {reportConfig.filters.includes('status') && (
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="status-label">Estado</InputLabel>

                            <Select labelId="status-label" value={filters.status} label="Estado" onChange={(e) => handleSelectChange('status', e.target.value)}>
                                <MenuItem value="all">Todos</MenuItem>
                                {reportConfig.title === 'Reporte de Reservas' ? [
                                    <MenuItem key="pending" value="pending">Pendiente</MenuItem>,
                                    <MenuItem key="confirmed" value="confirmed">Confirmada</MenuItem>,
                                    <MenuItem key="cancelled" value="cancelled">Cancelada</MenuItem>,
                                    <MenuItem key="completed" value="completed">Finalizada</MenuItem>,
                                    <MenuItem key="in_progress" value="in_progress">En curso</MenuItem>
                                ] : [
                                    <MenuItem key="active" value="active">Activo</MenuItem>,
                                    <MenuItem key="inactive" value="inactive">Inactivo</MenuItem>,
                                    <MenuItem key="blocked" value="blocked">Bloqueado</MenuItem>,
                                    <MenuItem key="deleted" value="deleted">Eliminado</MenuItem>
                                ]}
                            </Select>
                        </FormControl>
                    </Grid>
                )}

                {reportConfig.filters.includes('userType') && (
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="user-type-label">Tipo de Usuario</InputLabel>
                            <Select labelId="user-type-label" value={filters.userType} label="Tipo de Usuario" onChange={(e) => handleSelectChange('userType', e.target.value)}>
                                <MenuItem value="all">Todos</MenuItem>
                                <MenuItem value="admin">Administradores</MenuItem>
                                <MenuItem value="recepcionist">Recepcionistas</MenuItem>
                                <MenuItem value="guest">Huéspedes</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                )}
            </Grid>
        </Paper>
    )
}

export default ReportFilters