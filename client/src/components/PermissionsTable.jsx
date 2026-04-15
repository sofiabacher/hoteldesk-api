import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Tooltip, IconButton, Chip, Button } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon, Group as GroupIcon, Security as SecurityIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material'

const PermissionsTable = ({ permissions = [], loading, onEditPermission, onDeletePermission, currentUserRole = 'admin' }) => {
    const canEditPermission = (permission) => {
        const systemPermissions = ['admin.users.view', 'admin.users.edit', 'admin.users.delete', 'admin.roles.view', 'admin.roles.create', 'admin.roles.edit', 'admin.roles.delete', 'admin.rooms.view', 'admin.rooms.create', 'admin.rooms.edit', 'admin.rooms.delete', 'admin.bitacora.view', 'admin.reports.view', 'permissions.manage', 'permissions.view', 'permissions.create', 'permissions.edit', 'permissions.delete', 'permissions.assign', 'permissions.remove'];
        return !systemPermissions.includes(permission.name.toLowerCase());
    }

    const renderActionButtons = (permission) => {
        const canEdit = canEditPermission(permission);

        if (!canEdit) {
            return (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>  - </Typography>
            )
        }

        return (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Tooltip title="Editar permiso">
                    <IconButton size="small" onClick={() => onEditPermission(permission)} sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' }, p: 0.75 }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Eliminar permiso">
                   <IconButton size="small" onClick={() => onDeletePermission(permission)} sx={{ backgroundColor: 'error.main', color: 'white', '&:hover': { backgroundColor: 'error.dark' }, p: 0.75 }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    };

    const getPermissionTypeLabel = (permission) => {
        const systemPermissions = ['admin.users.view', 'admin.users.edit', 'admin.users.delete', 'admin.roles.view', 'admin.roles.create', 'admin.roles.edit', 'admin.roles.delete', 'admin.rooms.view', 'admin.rooms.create', 'admin.rooms.edit', 'admin.rooms.delete', 'admin.bitacora.view', 'admin.reports.view', 'permissions.manage', 'permissions.view', 'permissions.create', 'permissions.edit', 'permissions.delete', 'permissions.assign', 'permissions.remove'];
        if (systemPermissions.includes(permission.name.toLowerCase())) {
            return {
                label: 'Sistema',
                color: 'warning',
                icon: <SecurityIcon style={{ fontSize: '14px' }} />
            };
        }
        return {
            label: 'Personalizado',
            color: 'success',
            icon: <AdminIcon style={{ fontSize: '14px' }} />
        };
    };

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
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Roles</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuarios</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                                    <CircularProgress color="primary" />
                                    <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}> Cargando permisos... </Typography>
                                </TableCell>
                            </TableRow>

                        ) : permissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                                    <Typography variant="h6" sx={{ color: 'text.secondary' }}> No hay permisos registrados </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}> Comience creando un nuevo permiso </Typography>
                                </TableCell>
                            </TableRow>

                        ) : permissions.map((permission) => {
                            const permissionType = getPermissionTypeLabel(permission);
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
                                        <Chip
                                            icon={permissionType.icon}
                                            label={permissionType.label}
                                            size="small"
                                            color={permissionType.color}
                                            variant="outlined"
                                        />
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

                                    <TableCell>
                                        <Chip
                                            label={permission.isActive ? 'Activo' : 'Inactivo'}
                                            size="small"
                                            color={permission.isActive ? 'success' : 'error'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    
                                    <TableCell align="center">
                                        {renderActionButtons(permission)}
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