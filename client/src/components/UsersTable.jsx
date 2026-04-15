import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Chip } from '@mui/material'
import { AdminPanelSettings as AdminIcon, Person as PersonIcon, CheckCircle as CheckCircleIcon, Block as BlockIcon, Delete as DeleteIcon } from '@mui/icons-material'

const UsersTable = ({ users = [], loading, pagination, onPageChange, currentUserId, firstAdminId, actionLoading, onConfirmAction, userStateValues, userStateLabels, searchTerm = '', searchType = 'all', statusFilter = 'all', roleFilter = '' }) => {
    const getStatusColor = (statusId) => {
        const colors = {
            [userStateValues.ACTIVE]: 'success',
            [userStateValues.INACTIVE]: 'warning',
            [userStateValues.BLOCKED]: 'error',
            [userStateValues.DELETED]: 'default'
        }
        return colors[statusId] || 'default'
    }

    const getStatusIcon = (statusId) => {
        const icons = {
            [userStateValues.ACTIVE]: CheckCircleIcon,
            [userStateValues.INACTIVE]: PersonIcon,
            [userStateValues.BLOCKED]: BlockIcon,
            [userStateValues.DELETED]: DeleteIcon
        }
        return icons[statusId] || PersonIcon
    }

    const getRoleIcon = (roleName) => {
        switch (roleName) {
            case 'admin': return AdminIcon
            case 'recepcionist': return PersonIcon
            default: return PersonIcon
        }
    }

    const renderActionButtons = (user) => (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
            {user.userStateId === userStateValues.BLOCKED ? (
                <Box component="button" onClick={() => onConfirmAction(user.id, user, 'unblock', `¿Estás seguro de desbloquear a ${user.name} ${user.lastName}?`)} disabled={actionLoading}  title="Desbloquear usuario"
                    sx={{ backgroundColor: 'success.main', color: 'white', border: 'none', borderRadius: 1, p: 0.75, cursor: 'pointer', minWidth: 'auto', '&:hover': { backgroundColor: 'success.dark' }, '&:disabled': { backgroundColor: 'grey.300', color: 'grey.500' } }}  
                >
                    <CheckCircleIcon sx={{ fontSize: 18 }} />
                </Box>

            ) : user.userStateId === userStateValues.ACTIVE ? (
                <Box component="button" onClick={() => onConfirmAction(user.id, user, 'block', `¿Estás seguro de bloquear a ${user.name} ${user.lastName}?`)} disabled={actionLoading} title="Bloquear usuario"
                    sx={{ backgroundColor: 'warning.main', color: 'white', border: 'none', borderRadius: 1, p: 0.75, cursor: 'pointer', minWidth: 'auto', '&:hover': { backgroundColor: 'warning.dark' }, '&:disabled': { backgroundColor: 'grey.300', color: 'grey.500' } }}   
                >
                    <BlockIcon sx={{ fontSize: 18 }} />
                </Box>
            ) : null}

            <Box component="button" onClick={() => onConfirmAction(user.id, user, 'delete', `¿Estás seguro de eliminar a ${user.name} ${user.lastName}?`)} disabled={actionLoading} title="Eliminar usuario"
                sx={{ backgroundColor: 'error.main', color: 'white', border: 'none', borderRadius: 1, p: 0.75, cursor: 'pointer', minWidth: 'auto', '&:hover': { backgroundColor: 'error.dark' }, '&:disabled': { backgroundColor: 'grey.300', color: 'grey.500' } }}   
            >
                <DeleteIcon sx={{ fontSize: 18 }} />
            </Box>
        </Box>
    )

    const renderUserActions = (user) => {
        const isAdmin = user.Roles?.some(role => role.name === 'admin')
        const isDeleted = user.userStateId === userStateValues.DELETED
        const isAdminPrincipal = currentUserId === firstAdminId
        const isFirstAdmin = user.id === firstAdminId

        if (isDeleted) {
            return (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Typography variant="caption" color="text.secondary"> Eliminado </Typography>
                </Box>
            )
        }

        if (isAdmin) {
            if (isAdminPrincipal && !isFirstAdmin) {
                return (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {isFirstAdmin && (
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Principal
                            </Typography>
                        )}
                        {renderActionButtons(user)}
                    </Box>
                )

            } else {
                return (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {isFirstAdmin ? (
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Principal
                            </Typography>
                        ) : (
                            <Typography variant="caption" color="text.secondary">
                                Admin
                            </Typography>
                        )}
                    </Box>
                )
            }
        }

        return renderActionButtons(user)
    }

    const highlightText = (text, term) => {
        if (!term || !text) return text

        const regex = new RegExp(`(${term})`, 'gi')
        const parts = text.split(regex)

        return parts.map((part, index) =>
            regex.test(part) ? (
                <Box component="span" key={index} sx={{ backgroundColor: 'warning.light', fontWeight: 'bold' }}> {part} </Box>
            ) : (
                part
            )
        )
    }

    return (
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Roles</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Registro</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                    <CircularProgress color="primary" />
                                    <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}> Cargando usuarios... </Typography>
                                </TableCell>
                            </TableRow>

                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        {searchTerm || statusFilter !== 'all' || roleFilter
                                            ? 'No se encontraron usuarios con los filtros seleccionados'
                                            : 'No hay usuarios para mostrar'}
                                    </Typography>
                                </TableCell>
                            </TableRow>

                        ) : (
                            users.map((user) => {
                                const StatusIcon = getStatusIcon(user.userStateId)
                                return (
                                    <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}>
                                        <TableCell sx={{ fontWeight: 'medium' }}>{user.id}</TableCell>
                                        
                                        <TableCell sx={{ fontWeight: 'medium' }}>
                                            {(searchType === 'all' || searchType === 'name') && searchTerm
                                                ? highlightText(`${user.name} ${user.lastName}`, searchTerm)
                                                : `${user.name} ${user.lastName}`}
                                        </TableCell>

                                        <TableCell>
                                            {(searchType === 'all' || searchType === 'email') && searchTerm
                                                ? highlightText(user.email, searchTerm)
                                                : user.email}
                                        </TableCell>

                                        <TableCell>
                                            {user.Roles?.map((role, index) => (
                                                <Chip key={index} label={role.name} size="small" sx={{ mr: 0.5, backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }} />
                                            ))}
                                        </TableCell>

                                        <TableCell>
                                            <Chip icon={<StatusIcon style={{ fontSize: 16 }} />} label={userStateLabels[user.userStateId] || 'Desconocido'} color={getStatusColor(user.userStateId)} size="small" sx={{ fontWeight: 'bold' }} />
                                        </TableCell>

                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString('es-ES')}
                                        </TableCell>

                                        <TableCell align="center">
                                            {renderUserActions(user)}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {pagination.totalUsers > 0 && (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Mostrando {(pagination.currentPage - 1) * pagination.perPage + 1} - {Math.min(pagination.currentPage * pagination.perPage, pagination.totalUsers)} de {pagination.totalUsers} usuarios
                        </Typography>

                        <Box component="button" onClick={() => onPageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}
                            sx={{ px: 2, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, backgroundColor: 'white', cursor: 'pointer', '&:hover:not(:disabled)': { backgroundColor: 'grey.50' }, '&:disabled': { opacity: 0.5, cursor: 'default' } }}
                        >
                            Anterior
                        </Box>

                        <Box component="button" onClick={() => onPageChange(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages}
                            sx={{ px: 2, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, backgroundColor: 'white', cursor: 'pointer', '&:hover:not(:disabled)': { backgroundColor: 'grey.50' }, '&:disabled': { opacity: 0.5, cursor: 'default' } }}
                        >
                            Siguiente
                        </Box>
                    </Box>
                </Box>
            )}
        </Paper>
    )
}

export default UsersTable