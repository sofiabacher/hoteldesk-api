import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, MenuItem, FormControl, InputLabel, Select, Alert, Snackbar, Dialog, DialogTitle, DialogActions, DialogContent, Grid, Card, CardContent, Backdrop, CircularProgress } from '@mui/material'
import { ArrowBack as ArrowBackIcon, Search as SearchIcon, FilterList as FilterIcon, Block as BlockIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Refresh as RefreshIcon, Group as GroupIcon, AdminPanelSettings as AdminIcon, Person as PersonIcon } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'

import { USER_STATE_LABELS, USER_STATE_VALUES } from '../utils/constants'
import axios from '../utils/axiosConfig'

const UsersPage = () => {
    const navigate = useNavigate()
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalUsers: 0,
        perPage: 10
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [searchType, setSearchType] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [roleFilter, setRoleFilter] = useState('')

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        userId: null,
        userName: '',
        action: '',
        message: ''
    })

    const [currentUserId, setCurrentUserId] = useState(null)
    const [firstAdminId, setFirstAdminId] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users/profile')
                const user = response.data?.data?.user
                if (user?.photo) setAvatarUrl(`http://localhost:3000${user.photo}`)
                if (user?.id) setCurrentUserId(user.id)
            } catch (err) {
                console.error('Error al obtener la foto de perfil:', err)
            }
        }

        const fetchFirstAdminId = async () => {
            try {
                const response = await axios.get('http://localhost:3000/admin/first-admin')
                setFirstAdminId(response.data.firstAdminId)
            } catch (err) {
                console.error('Error al obtener el ID del primer admin:', err)
            }
        }

        fetchUserData()
        fetchFirstAdminId()
    }, [])

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true)
            setError('')

            const params = new URLSearchParams({
                page: page,
                limit: pagination.perPage
            })

            if (searchTerm) {
                params.append('search', searchTerm)
                params.append('searchType', searchType)
            }

            if (statusFilter && statusFilter !== 'all') {
                params.append('status', statusFilter)
            }

            if (roleFilter) {
                params.append('role', roleFilter)
            }

            const response = await axios.get(`http://localhost:3000/admin/users?${params}`)
            setUsers(response.data.data.users)
            setPagination(response.data.data.pagination)

        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar usuarios')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async () => {
        if (searchTerm.trim() < 2) {
            setError('El término de búsqueda debe tener al menos 2 caracteres')
            return
        }
        fetchUsers(1)
    }

    const updateUserStatus = async (userId, userStateId, action) => {
        setActionLoading(true)
        try {
            const response = await axios.patch(`http://localhost:3000/admin/users/${userId}/status`, { userStateId, action } )
            setSuccess(response.data.message)
            fetchUsers(pagination.currentPage)

        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar el usuario')
        } finally {
            setActionLoading(false)
        }
    }

    const deleteUser = async (userId) => {
        setActionLoading(true)
        try {
            const response = await axios.delete(`http://localhost:3000/admin/users/${userId}`)
            setSuccess(response.data.message)
            fetchUsers(pagination.currentPage)

        } catch (err) {
            setError(err.response?.data?.message || 'Error al eliminar el usuario')
        } finally {
            setActionLoading(false)
        }
    }
 
    const confirmAction = (userId, user, action, message) => {
        setConfirmDialog({
            open: true,
            userId,
            userName: `${user.name} ${user.lastName}`,
            action,
            message
        })
    }
 
    const executeAction = async () => {
        const { userId, action } = confirmDialog
        setConfirmDialog({ open: false, userId: null, userName: '', action: '', message: '' })

        if (action === 'delete') {
            await deleteUser(userId)
        } else if (action === 'block') {
            await updateUserStatus(userId, USER_STATE_VALUES.BLOCKED, 'block')
        } else if (action === 'unblock') {
            await updateUserStatus(userId, USER_STATE_VALUES.ACTIVE, 'unblock')
        }
    }
 
    const getStatusColor = (statusId) => {
        const colors = {
            [USER_STATE_VALUES.ACTIVE]: 'success',   // ACTIVE - Green
            [USER_STATE_VALUES.INACTIVE]: 'warning',   // INACTIVE - Orange
            [USER_STATE_VALUES.BLOCKED]: 'error',     // BLOCKED - Red
            [USER_STATE_VALUES.DELETED]: 'default'    // DELETED - Gray
        }
        return colors[statusId] || 'default'
    }
 
    const getStatusIcon = (statusId) => {
        const icons = {
            [USER_STATE_VALUES.ACTIVE]: CheckCircleIcon,
            [USER_STATE_VALUES.INACTIVE]: PersonIcon,
            [USER_STATE_VALUES.BLOCKED]: BlockIcon,
            [USER_STATE_VALUES.DELETED]: DeleteIcon
        }
        return icons[statusId] || PersonIcon
    }
 
    const renderActionButtons = (user, isAdminManagement = false) => {
        return (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                {user.userStateId === USER_STATE_VALUES.BLOCKED ? (
                    <IconButton sx={{ backgroundColor: 'success.main', color: 'white', '&:hover': { backgroundColor: 'success.dark' }, '&:disabled': { backgroundColor: 'grey.300', color: 'grey.500' } }}
                        onClick={() => confirmAction(user.id, user, 'unblock', `¿Estás seguro de desbloquear a ${user.name} ${user.lastName}?`)} title="Desbloquear usuario" disabled={actionLoading}
                    >
                        <CheckCircleIcon sx={{ fontSize: 20 }} />
                    </IconButton>

                ) : user.userStateId === USER_STATE_VALUES.ACTIVE ? (
                    <IconButton sx={{ backgroundColor: 'warning.main', color: 'white', '&:hover': { backgroundColor: 'warning.dark' }, '&:disabled': { backgroundColor: 'grey.300', color: 'grey.500' } }}
                        onClick={() => confirmAction(user.id, user, 'block', `¿Estás seguro de bloquear a ${user.name} ${user.lastName}?`)}  title="Bloquear usuario" disabled={actionLoading}
                    >
                        <BlockIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                ) : null}

                <IconButton
                    sx={{ backgroundColor: 'error.main', color: 'white', '&:hover': { backgroundColor: 'error.dark' }, '&:disabled': { backgroundColor: 'grey.300', color: 'grey.500' } }}
                    onClick={() => confirmAction(user.id, user, 'delete', `¿Estás seguro de eliminar a ${user.name} ${user.lastName}?`)} title="Eliminar usuario" disabled={actionLoading}
                >
                    <DeleteIcon sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>
        )
    }

    const renderUserActions = (user) => {
        const isAdmin = user.Roles?.some(role => role.name === 'admin')
        const isDeleted = user.userStateId === USER_STATE_VALUES.DELETED
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
                        {renderActionButtons(user, true)}
                    </Box>
                )
            } else {
                return (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {isFirstAdmin && (
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Principal
                            </Typography>
                        )}
                    </Box>
                )
            }
        }

        return renderActionButtons(user)
    }

    const getRoleIcon = (roleName) => {
        switch (roleName) {
            case 'admin': return AdminIcon
            case 'recepcionist': return PersonIcon
            default: return PersonIcon
        }
    }

    useEffect(() => {
        fetchUsers(1)
    }, [])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <NavBar avatarUrl={avatarUrl} />

            <Box sx={{ flexGrow: 1, py: 8, px: { xs: 2, sm: 3, md: 4 }, pt: '120px' }}>
                <Container maxWidth="xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')}
                                sx={{ mr: 3, borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}
                            >
                                Volver al Panel
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                               <Typography variant="h4" fontWeight="bold" color="primary.main"> Gestión de Usuarios </Typography>
                            </Box>
                        </Box>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)', border: '2px solid', borderColor: 'primary.main' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <FilterIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                                    <Typography variant="h5" fontWeight="bold" color="primary.main"> Filtros de Búsqueda </Typography>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                       <TextField fullWidth label="Buscar usuarios..." sx={{ backgroundColor: 'white' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} size="small"
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton onClick={handleSearch} size="small">
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
                                                <MenuItem value={USER_STATE_VALUES.ACTIVE}>Activo</MenuItem>
                                                <MenuItem value={USER_STATE_VALUES.INACTIVE}>Inactivo</MenuItem>
                                                <MenuItem value={USER_STATE_VALUES.BLOCKED}>Bloqueado</MenuItem>
                                                <MenuItem value={USER_STATE_VALUES.DELETED}>Eliminado</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={2}>
                                        <LoadingButton variant="contained" startIcon={<RefreshIcon />} onClick={() => fetchUsers(pagination.currentPage)} loading={loading} sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>
                                            Actualizar
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                        <Paper elevation={2} sx={{ borderRadius: 3 }}>
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
                                                    <Typography variant="h6" color="text.secondary"> No se encontraron usuarios con los filtros seleccionados </Typography>
                                                </TableCell>
                                            </TableRow>

                                        ) : (
                                            users.map((user) => {
                                                const StatusIcon = getStatusIcon(user.userStateId)
                                                return (
                                                    <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: 'rgba(41, 163, 116, 0.04)' } }} >
                                                        <TableCell>{user.id}</TableCell>
                                                        <TableCell sx={{ fontWeight: 'medium' }}> {user.name} {user.lastName} </TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell> {user.Roles?.map((role, index) => (  <Chip key={index} icon={getRoleIcon(role.name, { sx: { fontSize: 16 } })} label={role.name} size="small" sx={{ mr: 0.5, backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }} /> ))} </TableCell>
                                                        <TableCell> <Chip icon={<StatusIcon style={{ fontSize: 16 }} />} label={USER_STATE_LABELS[user.userStateId] || 'Desconocido'} color={getStatusColor(user.userStateId)} size="small" sx={{ fontWeight: 'bold' }} /> </TableCell>
                                                        <TableCell> {new Date(user.createdAt).toLocaleDateString('es-ES')} </TableCell>
                                                        <TableCell align="center"> {renderUserActions(user)} </TableCell>
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
                                        
                                        <Button variant="outlined" size="small" disabled={pagination.currentPage === 1} onClick={() => fetchUsers(pagination.currentPage - 1)}>
                                            Anterior
                                        </Button>
                                        <Button variant="outlined" size="small" disabled={pagination.currentPage >= pagination.totalPages} onClick={() => fetchUsers(pagination.currentPage + 1)}>
                                            Siguiente
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Paper>
                    </motion.div>
                </Container>
            </Box>

            <Footer />

            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })} maxWidth="sm" fullWidth>
                <DialogTitle>Confirmar Acción</DialogTitle>
                
                <DialogContent>
                    <Typography variant="body1"> {confirmDialog.message} </Typography>
                    {confirmDialog.userName && (
                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
                            Usuario: {confirmDialog.userName}
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })} variant="outlined">
                        Cancelar
                    </Button>
                    <LoadingButton onClick={executeAction} loading={actionLoading} variant="contained" color={confirmDialog.action === 'delete' ? 'error' : confirmDialog.action === 'block' ? 'warning' : 'success'}>
                        {confirmDialog.action === 'delete' ? 'Eliminar' :
                         confirmDialog.action === 'block' ? 'Bloquear' : 'Desbloquear'}
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="success" onClose={() => setSuccess('')} sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={actionLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    )
}

export default UsersPage