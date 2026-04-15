import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Chip } from '@mui/material'
import { Person as PersonIcon, Group as GroupIcon } from '@mui/icons-material'

const PermissionsTable = ({ permissions = [], loading }) => {

    const getModuleColor = (module) => {
        const moduleColors = {
            'admin': 'primary',
            'users': 'secondary',
            'rooms': 'success',
            'bookings': 'info',
            'reports': 'warning'
        };
        return moduleColors[module] || 'default';
    };

    return (
        <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Módulo</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acción</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Roles</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuarios</TableCell>
                          </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <CircularProgress color="primary" />
                                    <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}> Cargando permisos... </Typography>
                                </TableCell>
                            </TableRow>

                        ) : permissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <Typography variant="h6" sx={{ color: 'text.secondary' }}> No hay permisos registrados </Typography>
                                </TableCell>
                            </TableRow>

                        ) : permissions.map((permission) => {
                            return (
                                <TableRow key={permission.id} hover>
                                    <TableCell> {permission.id} </TableCell>

                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {permission.name}
                                        </Typography>
                                        {permission.description && (
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                {permission.description}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={permission.module}
                                            size="small"
                                            color={getModuleColor(permission.module)}
                                            variant="outlined"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Typography variant="body2">
                                            {permission.action}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <GroupIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {permission.roleCount || 0}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PersonIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {permission.userCount || 0}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default PermissionsTable