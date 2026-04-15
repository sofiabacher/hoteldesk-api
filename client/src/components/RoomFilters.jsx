import React from 'react'
import { Box, Grid, TextField, MenuItem, FormControl, InputLabel, Select, Button, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { FilterList as FilterIcon, Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material'

const RoomFilters = ({ searchTerm, setSearchTerm, typeFilter, setTypeFilter, statusFilter, setStatusFilter, onSearch, onRefresh, loading, roomTypes = [], roomStates = {} }) => {
    return (
       <Box sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)', border: '2px solid', borderColor: 'primary.main', borderRadius: 2, p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FilterIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                <Box>
                    <Box sx={{ fontSize: 20, fontWeight: 'bold', color: 'primary.main' }}> Filtros de Búsqueda </Box>
                    <Box sx={{ fontSize: 14, color: 'text.secondary' }}> Filtra habitaciones por nombre, tipo o estado </Box>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Buscar habitaciones..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && onSearch()} size="small" sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={onSearch} size="small">
                                    <SearchIcon />
                                </IconButton>
                            )
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Tipo</InputLabel>
                        
                        <Select value={typeFilter || 'TODOS'} label="Tipo" onChange={(e) => setTypeFilter(e.target.value === 'TODOS' ? '' : e.target.value)} sx={{ backgroundColor: 'white' }}>
                            <MenuItem value="TODOS">Todos</MenuItem>
                            {roomTypes.map((type) => (
                                <MenuItem key={type} value={type}> {type} </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Estado</InputLabel>
                        
                        <Select value={statusFilter || 'TODOS'} label="Estado" onChange={(e) => setStatusFilter(e.target.value === 'TODOS' ? '' : e.target.value)} sx={{ backgroundColor: 'white' }}>
                            <MenuItem value="TODOS">Todos</MenuItem>
                            {Object.entries(roomStates).map(([key, state]) => (
                                <MenuItem key={key} value={key}> {state.label} </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <LoadingButton variant="contained" startIcon={<RefreshIcon />} onClick={onRefresh} loading={loading} sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, minWidth: 'auto', px: 3 }}>
                        Actualizar
                    </LoadingButton>
                </Grid>
            </Grid>
        </Box>
    )
}

export default RoomFilters