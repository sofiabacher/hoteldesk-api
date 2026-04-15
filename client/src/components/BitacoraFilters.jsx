import React, { useState } from 'react'
import { Box, Grid, TextField, Button, IconButton, Alert } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'
import { FilterList as FilterIcon, Search as SearchIcon, Refresh as RefreshIcon, Download as DownloadIcon } from '@mui/icons-material'

const BitacoraFilters=({startDate,  setStartDate,endDate, setEndDate, onSearch, onRefresh, onDownload, loading=false, downloading=false })=>{
    const [dateError, setDateError] = useState('')

    const validateDates = (start, end) => {
        if (start && end && start > end) {
            setDateError('La fecha de fin no puede ser anterior a la fecha de inicio')
            return false
        }
        setDateError('')
        return true
    }

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue)
        if (newValue && endDate) {
            validateDates(newValue, endDate)
        } else {
            setDateError('')
        }
    }

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue)
        if (startDate && newValue) {
            validateDates(startDate, newValue)
        } else {
            setDateError('')
        }
    }

    const handleSearch = () => {
        if (validateDates(startDate, endDate)) {
            onSearch()
        }
    }

    const handleDownload = () => {
        if (validateDates(startDate, endDate)) {
            onDownload()
        }
    }
    return (
        <Box sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)', border: '2px solid', borderColor: 'primary.main', borderRadius: 2, p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FilterIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                <Box>
                    <Box sx={{ fontSize: 20, fontWeight: 'bold', color: 'primary.main' }}> Filtros de Búsqueda </Box>
                    <Box sx={{ fontSize: 14, color: 'text.secondary' }}> Filtra la bitácora por rango de fechas </Box>
                </Box>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <DatePicker label="Fecha de inicio" value={startDate} onChange={handleStartDateChange} inputFormat="dd/MM/yyyy"
                            renderInput={(params) => ( <TextField {...params} fullWidth size="small" sx={{backgroundColor:"white",borderRadius:1,"& .MuiInputBase-root":{height:"40px"}}} /> )}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <DatePicker label="Fecha de fin" value={endDate} onChange={handleEndDateChange} inputFormat="dd/MM/yyyy"
                            renderInput={(params) => ( <TextField {...params} fullWidth size="small" sx={{backgroundColor:"white",borderRadius:1,"& .MuiInputBase-root":{height:"40px"}}} /> )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', gap: 2, height: '40px', alignItems: 'center' }}>
                            <LoadingButton variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} loading={loading} disabled={!!dateError} sx={{backgroundColor:"primary.main","&:hover":{backgroundColor:"primary.dark"},minWidth:"120px"}}>
                                Buscar
                            </LoadingButton>

                            <LoadingButton variant="outlined" startIcon={<RefreshIcon />} onClick={onRefresh} loading={loading} sx={{borderColor:"primary.main",color:"primary.main","&:hover":{borderColor:"primary.dark",backgroundColor:"rgba(41,163,116,0.04)"},minWidth:"120px"}} >
                                Actualizar
                            </LoadingButton>

                            <LoadingButton variant="outlined" color="success" startIcon={<DownloadIcon />} onClick={handleDownload} loading={downloading} disabled={!!dateError} sx={{borderColor:"success.main",color:"success.main","&:hover":{borderColor:"success.dark",backgroundColor:"rgba(76,175,80,0.04)"},minWidth:"140px"}}>
                                Descargar
                            </LoadingButton>

                        </Box>
                    </Grid>
                </Grid>

                {dateError && (
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="error" sx={{ borderRadius: 1 }}>
                            {dateError}
                        </Alert>
                    </Box>
                )}
            </LocalizationProvider>
        </Box>
    )
}

export default BitacoraFilters