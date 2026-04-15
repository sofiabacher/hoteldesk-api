import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Tooltip, IconButton, Chip, Button } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon, Group as GroupIcon, Security as SecurityIcon } from '@mui/icons-material'

const RolesTable = ({ roles = [], loading, onEditRole, onDeleteRole, onViewUsers, currentUserRole = 'admin' }) => {
    const canEditRole = (role) => {
        const systemRoles = ['admin', 'guest', 'recepcionist', 'cleaning'];
        return !systemRoles.includes(role.name.toLowerCase());
    }

    const renderActionButtons = (role) => {
        const canEdit = canEditRole(role);

        if (!canEdit) {
            return (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>  - </Typography>
            )
        }

        return (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Tooltip title="Editar rol">
                    <IconButton size="small" onClick={() => onEditRole(role)} sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' }, p: 0.75 }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Eliminar rol">
                   <IconButton size="small" onClick={() => onDeleteRole(role)} sx={{ backgroundColor: 'error.main', color: 'white', '&:hover': { backgroundColor: 'error.dark' }, p: 0.75 }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    };

  
    const getRoleTypeLabel = (role) => {
        const systemRoles = ['admin', 'guest', 'recepcionist', 'cleaning'];
        if (systemRoles.includes(role.name.toLowerCase())) {
            return {
                label: 'Sistema',
                color: 'warning',
                icon: <SecurityIcon style={{ fontSize: '14px' }} />
            };
        }
        return {
            label: 'Personalizado',
            color: 'success',
            icon: <GroupIcon style={{ fontSize: '14px' }} />
        };
    };

    return (
        <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuarios</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Permisos</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                    <CircularProgress color="primary" />
                                    <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}> Cargando roles... </Typography>
                                </TableCell>
                            </TableRow>

                        ) : roles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                    <GroupIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary"> No hay roles para mostrar </Typography>
                                </TableCell>
                            </TableRow>

                        ) : (
                            roles.map((role) => {
                                const roleType = getRoleTypeLabel(role);

                                return (
                                    <TableRow key={role.id} sx={{ '&:hover': { backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}>
                                        <TableCell sx={{ fontWeight: 'medium' }}>#{role.id}</TableCell>

                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}> {role.name} </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip icon={roleType.icon} label={roleType.label} size="small"
                                                sx={{ backgroundColor: roleType.color === 'warning' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(76, 175, 80, 0.1)', color: roleType.color === 'warning' ? '#ff9800' : '#4caf50', border: `1px solid ${roleType.color === 'warning' ? '#ff9800' : '#4caf50'}`, fontWeight: 'bold', '& .MuiChip-icon': { color: roleType.color === 'warning' ? '#ff9800' : '#4caf50' } }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon fontSize="small" color="action" />
                                                <Typography variant="body2"> {role.userCount || 0} </Typography>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <SecurityIcon fontSize="small" color="action" />
                                                <Typography variant="body2"> {role.permissionCount || 0} </Typography>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2" sx={{ maxWidth: 200 }}> {role.description || 'Sin descripción'} </Typography>
                                        </TableCell>

                                        <TableCell align="center"> {renderActionButtons(role)} </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default RolesTable