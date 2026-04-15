import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Container, Button, Grid, Typography, Snackbar, Alert, CircularProgress, Paper, FormControl, InputLabel, Select, MenuItem, Chip, Avatar, Card, CardContent, CardActions, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import { ArrowBack as ArrowBackIcon, Group as RoleIcon, Person as PersonIcon, Assignment as AssignmentIcon, PersonRemove as PersonRemoveIcon, Security as SecurityIcon, Check as CheckIcon, Close as CloseIcon, FilterList as FilterIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'
import axios from '../utils/axiosConfig'

const AssignRole = () => {
    const navigate = useNavigate()
    const theme = useTheme()
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [isAssignMode, setIsAssignMode] = useState(true) // true para asignar, false para desasignar

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users/profile')
                const user = response.data?.data?.user
                if (user?.photo) setAvatarUrl(`http://localhost:3000${user.photo}`)
            } catch (err) {
                console.error('Error al obtener la foto de perfil:', err)
            }
        }
        fetchUserData()
    }, [])

    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [selectedUser, setSelectedUser] = useState('')
    const [selectedRole, setSelectedRole] = useState('')
    const [userRoles, setUserRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState('')
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [confirmDialog, setConfirmDialog] = useState({ open: false, user: null, role: null })

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/roles/users')
            setUsers(response.data.data || [])
        } catch (err) {
            showSnackbar('Error al cargar los usuarios', 'error')
        }
    }

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:3000/roles')
            setRoles(response.data.data || [])
        } catch (err) {
            showSnackbar('Error al cargar los roles', 'error')
        }
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                await Promise.all([fetchUsers(), fetchRoles()])
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity })
    }

    const handleRefresh = () => {
        fetchUsers()
        fetchRoles()
    }

    const fetchUserRoles = async (userId) => {
        if (!userId) {
            setUserRoles([])
            return
        }

        try {
            const selectedUserData = users.find(u => u.id == userId)
            if (selectedUserData && selectedUserData.Roles) {
                setUserRoles(selectedUserData.Roles)
            } else {
                setUserRoles([])
            }
        } catch (err) {
            setUserRoles([])
        }
    }

    useEffect(() => {
        fetchUserRoles(selectedUser)
    }, [selectedUser, users])

    const handleAssignRole = async () => {
        if (!selectedUser || !selectedRole) {
            showSnackbar('Por favor seleccione un usuario y un rol', 'warning')
            return
        }

        try {
            setProcessing(true)
            await axios.post('http://localhost:3000/roles/assign', {
                userId: selectedUser,
                roleId: selectedRole
            })

            showSnackbar('Rol asignado correctamente', 'success')

            setSelectedUser('')
            setSelectedRole('')

            // Recargar usuarios para mostrar los roles actualizados
            await fetchUsers()

        } catch (err) {
            showSnackbar(err.response?.data?.message || 'Error al asignar el rol', 'error')

        } finally {
            setProcessing(false)
        }
    }

    const confirmRemoveRole = () => {
        if (!selectedUser || !selectedRole) {
            showSnackbar('Por favor seleccione un usuario y un rol', 'warning')
            return
        }

        const user = users.find(u => u.id == selectedUser)
        const role = userRoles.find(r => r.id == selectedRole)

        if (user && role) {
            setConfirmDialog({
                open: true,
                user,
                role
            })
        }
    }

    const handleRemoveRole = async () => {
        const { user, role } = confirmDialog
        setConfirmDialog({ open: false, user: null, role: null })

        try {
            setProcessing(true)
            await axios.post('http://localhost:3000/roles/remove', {
                userId: user.id,
                roleId: role.id
            })
            showSnackbar('Rol eliminado correctamente del usuario', 'success')

            setSelectedUser('')
            setSelectedRole('')
            setUserRoles([])

            // Recargar usuarios para mostrar los roles actualizados
            await fetchUsers()

        } catch (err) {
            showSnackbar(err.response?.data?.message || 'Error al eliminar el rol del usuario', 'error')

        } finally {
            setProcessing(false)
        }
    }

    const handleUserChange = (event) => { setSelectedUser(event.target.value) }
    const handleRoleChange = (event) => { setSelectedRole(event.target.value) }

    const toggleMode = () => {
        setIsAssignMode(!isAssignMode)
        setSelectedUser('')
        setSelectedRole('')
        setUserRoles([])
    }

    const canRemoveRole = (role) => {
        return role.name.toLowerCase() !== 'admin'
    }

    const getRoleTypeLabel = (role) => {
        const systemRoles = ['admin', 'guest', 'recepcionist', 'cleaning'];
        if (systemRoles.includes(role.name.toLowerCase())) {
            return {
                label: 'Sistema',
                color: 'warning'
            };
        }
        return {
            label: 'Personalizado',
            color: 'success'
        };
    }

    const getUserDisplayName = (user) => {  return `${user.name} ${user.lastName || ''}`.trim() }

    const getUserInitials = (user) => {
        const name = user.name || ''
        const lastName = user.lastName || ''
        return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    if (loading) {
        return (
            <>
                <NavBar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={60} thickness={4} />
                </Container>
                <Footer />
            </>
        )
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <NavBar avatarUrl={avatarUrl} />

            <Box sx={{ flexGrow: 1, py: 8, px: { xs: 2, sm: 3, md: 4 }, pt: '120px' }}>
                <Container maxWidth="xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/role-management')} sx={{ mr: 3, borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}>
                                Volver a Gestión de Roles
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                <Button variant="contained" onClick={toggleMode} sx={{ backgroundColor: isAssignMode ? 'success.main' : 'error.main', '&:hover': { backgroundColor: isAssignMode ? 'success.dark' : 'error.dark' } }}>
                                    {isAssignMode ? 'Asignar Rol' : 'Desasignar Rol'}
                                </Button>

                                <Typography variant="h4" fontWeight="bold" color="primary.main">
                                    {isAssignMode ? 'Asignar Rol a Usuario' : 'Desasignar Rol de Usuario'}
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                        <Box sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)', border: '2px solid', borderColor: 'primary.main', borderRadius: 2, p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <FilterIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                                <Box>
                                    <Box sx={{ fontSize: 20, fontWeight: 'bold', color: 'primary.main' }}>
                                        {isAssignMode ? 'Asignación de Roles' : 'Desasignación de Roles'}
                                    </Box>

                                    <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                                        {isAssignMode
                                            ? 'Seleccione un usuario y un rol para asignar'
                                            : 'Seleccione un usuario y un rol para desasignar'
                                        }
                                    </Box>
                                </Box>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={5}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="user-select-label">Usuario</InputLabel>
                                        <Select labelId="user-select-label" value={selectedUser} label="Usuario" onChange={handleUserChange} disabled={processing} sx={{ backgroundColor: 'white', minHeight: '45px', minWidth: '300px' }}>
                                            {users.map((user) => (
                                                <MenuItem key={user.id} value={user.id}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                                            {getUserInitials(user)}
                                                        </Avatar>

                                                        <Box>
                                                            <Typography variant="body2" fontWeight="medium"> {getUserDisplayName(user)} </Typography>
                                                            <Typography variant="caption" color="text.secondary"> {user.email} </Typography>
                                                        </Box>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="role-select-label"> {isAssignMode ? 'Rol' : 'Rol a Desasignar'} </InputLabel>
                                        
                                        <Select labelId="role-select-label" value={selectedRole} label={isAssignMode ? 'Rol' : 'Rol a Desasignar'} onChange={handleRoleChange} disabled={processing || (!isAssignMode && userRoles.length === 0)} sx={{ backgroundColor: 'white', minHeight: '45px', minWidth: '600px' }}>
                                            {isAssignMode ? (
                                                roles.map((role) => (
                                                    <MenuItem key={role.id} value={role.id}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <RoleIcon sx={{ color: 'primary.main' }} />
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="medium">
                                                                    {role.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {role.description || 'Sin descripción'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                userRoles.map((role) => {   // Modo desasignación: mostrar solo roles del usuario seleccionado
                                                    const roleType = getRoleTypeLabel(role)
                                                    const canRemove = canRemoveRole(role)
                                                    
                                                    return (
                                                        <MenuItem key={role.id} value={role.id} disabled={!canRemove}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                                                <RoleIcon sx={{ color: canRemove ? 'error.main' : 'grey.400' }} />
                                                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                                    <Typography variant="body2" fontWeight="medium" color={canRemove ? 'text.primary' : 'text.secondary'}>
                                                                        {role.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {role.description || 'Sin descripción'}
                                                                    </Typography>
                                                                </Box>

                                                                <Chip label={roleType.label} size="small" sx={{ backgroundColor: roleType.color === 'warning' ? 'warning.light' : 'success.light', color: roleType.color === 'warning' ? 'warning.contrastText' : 'success.contrastText' }} />
                                                                {!canRemove && (
                                                                    <Tooltip title="Este rol no puede ser eliminado">
                                                                        <SecurityIcon sx={{ color: 'grey.400', fontSize: 20 }} />
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        </MenuItem>
                                                    )
                                                })
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={2}>
                                   {isAssignMode ? (
                                       <LoadingButton variant="contained" fullWidth startIcon={<AssignmentIcon />} onClick={handleAssignRole} loading={processing} disabled={!selectedUser || !selectedRole} sx={{ backgroundColor: 'success.main', '&:hover': { backgroundColor: 'success.dark' }, '&:disabled': { backgroundColor: 'grey.300', color: 'grey.500' }, py: 1.5 }}>
                                           Asignar
                                       </LoadingButton>

                                   ) : (
                                       <LoadingButton variant="contained" fullWidth startIcon={<PersonRemoveIcon />} onClick={confirmRemoveRole} loading={processing} disabled={!selectedUser || !selectedRole} sx={{ backgroundColor: 'error.main', '&:hover': { backgroundColor: 'error.dark' }, '&:disabled': { backgroundColor: 'grey.300', color: 'grey.500' }, py: 1.5 }}>
                                           Desasignar
                                       </LoadingButton>
                                   )}
                                </Grid>
                            </Grid>
                        </Box>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: 'primary.main', paddingTop: 2 }}>
                            Usuarios Disponibles
                        </Typography>

                        <Grid container spacing={3}>
                            {users.map((user) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                                    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)', border: '2px solid', borderColor: 'primary.main',
                                        borderRadius: 2, transition: 'all 0.2s', '&:hover': { elevation: 4, transform: 'translateY(-2px)' } }}
                                    >
                                        <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
                                                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                                                    {getUserInitials(user)}
                                                </Avatar>

                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="h6" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
                                                        {getUserDisplayName(user)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                                                        {user.email}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'center' }}>
                                                <Typography variant="body2" fontWeight="medium" color="text.secondary">
                                                    Roles actuales:
                                                </Typography>

                                                {user.Roles && user.Roles.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                                                        {user.Roles.map((role) => (
                                                            <Chip key={role.id} label={role.name} size="small" icon={<RoleIcon sx={{ fontSize: 14 }} />} sx={{ backgroundColor: 'success.main', color: 'white', '& .MuiChip-icon': { color: 'white' } }} />
                                                        ))}
                                                    </Box>
                                                    
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary" fontStyle="italic">
                                                        Sin roles asignados
                                                    </Typography>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            <Footer />

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}> Confirmar Desasignación de Rol </DialogTitle>
                
                <DialogContent>
                    <Typography> ¿Está seguro de que desea desasignar el rol <strong>{confirmDialog.role?.name}</strong> del usuario <strong>{getUserDisplayName(confirmDialog.user || {})}</strong>? </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Esta acción puede afectar los permisos y accesos del usuario en el sistema.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false, user: null, role: null })} disabled={processing}>
                        Cancelar
                    </Button>

                    <Button onClick={handleRemoveRole} variant="contained" color="error" disabled={processing} startIcon={processing ? <CircularProgress size={20} /> : <PersonRemoveIcon />}>
                        {processing ? 'Desasignando...' : 'Desasignar Rol'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default AssignRole