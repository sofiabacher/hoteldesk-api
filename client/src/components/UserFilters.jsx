import React from 'react'
import { Box, Grid, TextField, MenuItem, FormControl, InputLabel, Select, Button, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { FilterList as FilterIcon, Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material'

const UserFilters = ({ searchTerm, setSearchTerm, searchType, setSearchType, statusFilter, setStatusFilter, roleFilter, setRoleFilter, onSearch, onRefresh, loading, pagination, userStateValues, userStateLabels, roles = [] }) => {
    return (
        <Box sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)', border: '2px solid', borderColor: 'primary.main', borderRadius: 2, p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FilterIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                <Box>
                    <Box sx={{ fontSize: 20, fontWeight: 'bold', color: 'primary.main' }}> Filtros de Búsqueda </Box>
                    <Box sx={{ fontSize: 14, color: 'text.secondary' }}> Filtra usuarios por nombre, email, estado o rol </Box>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                   <TextField fullWidth label="Buscar usuarios..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && onSearch()} size="small" sx={{ backgroundColor: 'white', borderRadius: 1 }}
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
                        
                        <Select value={searchType} label="Tipo" onChange={(e) => setSearchType(e.target.value)} sx={{ backgroundColor: 'white' }}>
                            <MenuItem value="all">Todos</MenuItem>
                            <MenuItem value="name">Nombre</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Estado</InputLabel>
                        
                        <Select value={statusFilter} label="Estado" onChange={(e) => setStatusFilter(e.target.value)} sx={{ backgroundColor: 'white' }}>
                            <MenuItem value="all">Todos</MenuItem>
                            <MenuItem value={userStateValues.ACTIVE}>Activo</MenuItem>
                            <MenuItem value={userStateValues.INACTIVE}>Inactivo</MenuItem>
                            <MenuItem value={userStateValues.BLOCKED}>Bloqueado</MenuItem>
                            <MenuItem value={userStateValues.DELETED}>Eliminado</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Rol</InputLabel>
                        
                        <Select value={roleFilter || 'TODOS'} label="Rol" onChange={(e) => setRoleFilter(e.target.value === 'TODOS' ? '' : e.target.value)} sx={{ backgroundColor: 'white' }}>
                            <MenuItem value="TODOS">Todos</MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role} value={role}> {role} </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                    <LoadingButton fullWidth variant="contained" startIcon={<RefreshIcon />} onClick={onRefresh} loading={loading} sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, height: 40 }}>
                        Actualizar
                    </LoadingButton>
                </Grid>
            </Grid>
        </Box>
    )
}

export default UserFilters