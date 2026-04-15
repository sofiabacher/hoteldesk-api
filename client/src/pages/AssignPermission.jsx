import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Container, Button, Grid, Typography, Snackbar, Alert, CircularProgress, Chip, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { Assignment as AssignIcon, RemoveCircle as RemoveIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from '../utils/axiosConfig'

const AssignPermission = () => {
    const navigate = useNavigate()
    const theme = useTheme()
    const [avatarUrl, setAvatarUrl] = useState(null)

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

    // Estados para el toggle entre modos
    const [isAssignMode, setIsAssignMode] = useState(true) // true para asignar, false para desasignar
    const [assignmentType, setAssignmentType] = useState('role') // 'role' o 'user'

    // Estados para los datos
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [permissions, setPermissions] = useState([])
    const [loading, setLoading] = useState(false)

    // Estados para la selección
    const [selectedUser, setSelectedUser] = useState('')
    const [selectedRole, setSelectedRole] = useState('')
    const [selectedPermissions, setSelectedPermissions] = useState([])

    // Estados para las asignaciones existentes
    const [userPermissions, setUserPermissions] = useState([])
    const [rolePermissions, setRolePermissions] = useState([])

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [usersRes, rolesRes, permissionsRes] = await Promise.all([
                    axios.get('http://localhost:3000/roles/users'),
                    axios.get('http://localhost:3000/roles'),
                    axios.get('http://localhost:3000/permissions')
                ])

                setUsers(usersRes.data.data || [])
                setRoles(rolesRes.data.data || [])
                setPermissions(permissionsRes.data.data || [])
            } catch (err) {
                showSnackbar('Error al cargar los datos', 'error')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Cargar permisos del usuario seleccionado
    useEffect(() => {
        if (selectedUser && assignmentType === 'user') {
            const loadUserPermissions = async () => {
                try {
                    // Filtrar permisos que tienen usuarios asignados directamente
                    const userPermissionsList = permissions.filter(p =>
                        p.Users && p.Users.some(u => u.id == selectedUser)
                    )
                    setUserPermissions(userPermissionsList)
                } catch (err) {
                    console.error('Error al cargar permisos del usuario:', err)
                    setUserPermissions([])
                }
            }
            loadUserPermissions()
        }
    }, [selectedUser, assignmentType, permissions])

    // Cargar permisos del rol seleccionado
    useEffect(() => {
        if (selectedRole && assignmentType === 'role') {
            // Obtener permisos del rol
            const rolePermissionsList = permissions.filter(p =>
                p.Roles && p.Roles.some(r => r.id == selectedRole)
            )
            setRolePermissions(rolePermissionsList)
        }
    }, [selectedRole, assignmentType, permissions])

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity })
    }

    const toggleMode = () => {
        setIsAssignMode(!isAssignMode)
        setSelectedUser('')
        setSelectedRole('')
        setSelectedPermissions([])
        setUserPermissions([])
        setRolePermissions([])
    }

    const handleAssignment = async () => {
        if (!selectedPermissions.length) {
            showSnackbar('Debe seleccionar al menos un permiso', 'error')
            return
        }

        if (assignmentType === 'role' && !selectedRole) {
            showSnackbar('Debe seleccionar un rol', 'error')
            return
        }

        if (assignmentType === 'user' && !selectedUser) {
            showSnackbar('Debe seleccionar un usuario', 'error')
            return
        }

        setLoading(true)
        try {
            for (const permissionId of selectedPermissions) {
                if (isAssignMode) {
                    if (assignmentType === 'role') {
                        await axios.post('http://localhost:3000/permissions/assign-to-role', {
                            roleId: selectedRole,
                            permissionId
                        })
                    } else {
                        await axios.post('http://localhost:3000/permissions/assign-to-user', {
                            userId: selectedUser,
                            permissionId
                        })
                    }
                } else {
                    if (assignmentType === 'role') {
                        await axios.post('http://localhost:3000/permissions/remove-from-role', {
                            roleId: selectedRole,
                            permissionId
                        })
                    } else {
                        await axios.post('http://localhost:3000/permissions/remove-from-user', {
                            userId: selectedUser,
                            permissionId
                        })
                    }
                }
            }

            showSnackbar(
                isAssignMode
                    ? `Permisos ${assignmentType === 'role' ? 'asignados al rol' : 'asignados al usuario'} correctamente`
                    : `Permisos ${assignmentType === 'role' ? 'eliminados del rol' : 'eliminados del usuario'} correctamente`,
                'success'
            )

            // Resetear selección
            setSelectedPermissions([])

            // Recargar datos
            if (assignmentType === 'role' && selectedRole) {
                const rolePermissionsList = permissions.filter(p =>
                    p.Roles && p.Roles.some(r => r.id == selectedRole)
                )
                setRolePermissions(rolePermissionsList)
            }

        } catch (err) {
            showSnackbar(`Error al ${isAssignMode ? 'asignar' : 'eliminar'} permisos: ${err.response?.data?.message || err.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleTogglePermission = (permissionId) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        )
    }

    const handlePermissionChipClick = (permission) => {
        const permissionId = permission.id
        if (isAssignMode) {
            // En modo asignar, solo permitir seleccionar permisos que no tenga asignados
            const currentPermissions = assignmentType === 'role' ? rolePermissions : userPermissions
            if (!currentPermissions.some(p => p.id === permissionId)) {
                handleTogglePermission(permissionId)
            }
        } else {
            // En modo desasignar, solo permitir seleccionar permisos que sí tenga asignados
            const currentPermissions = assignmentType === 'role' ? rolePermissions : userPermissions
            if (currentPermissions.some(p => p.id === permissionId)) {
                handleTogglePermission(permissionId)
            }
        }
    }

    const getAvailablePermissionsForSelection = () => {
        const currentPermissions = assignmentType === 'role' ? rolePermissions : userPermissions

        if (isAssignMode) {
            // En modo asignar, mostrar solo permisos que NO tiene asignados
            return permissions.filter(p =>
                !currentPermissions.some(cp => cp.id === p.id)
            )
        } else {
            // En modo desasignar, mostrar solo permisos que SÍ tiene asignados
            return permissions.filter(p =>
                currentPermissions.some(cp => cp.id === p.id)
            )
        }
    }

  
    if (loading && users.length === 0) {
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
                            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/permissions')} sx={{ mr: 3, borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}>
                                Volver a Permisos
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <Typography variant="h4" fontWeight="bold" color="primary.main">
                                    {isAssignMode ? 'Asignar Permisos' : 'Eliminar Permisos'}
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                        <Box sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)', border: '2px solid', borderColor: 'primary.main', borderRadius: 2, p: 4, textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                                <Button
                                    variant={isAssignMode ? 'contained' : 'outlined'}
                                    onClick={() => setIsAssignMode(true)}
                                    sx={{
                                        backgroundColor: isAssignMode ? 'primary.main' : 'transparent',
                                        color: isAssignMode ? 'white' : 'primary.main',
                                        borderColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: isAssignMode ? 'primary.dark' : 'rgba(41, 163, 116, 0.04)'
                                        }
                                    }}
                                >
                                    Asignar Permisos
                                </Button>

                                <Button
                                    variant={!isAssignMode ? 'contained' : 'outlined'}
                                    onClick={() => setIsAssignMode(false)}
                                    sx={{
                                        backgroundColor: !isAssignMode ? 'error.main' : 'transparent',
                                        color: !isAssignMode ? 'white' : 'error.main',
                                        borderColor: 'error.main',
                                        '&:hover': {
                                            backgroundColor: !isAssignMode ? 'error.dark' : 'rgba(244, 67, 54, 0.04)'
                                        }
                                    }}
                                >
                                    Eliminar Permisos
                                </Button>

                                <Button
                                    variant={assignmentType === 'role' ? 'contained' : 'outlined'}
                                    onClick={() => setAssignmentType('role')}
                                    sx={{
                                        backgroundColor: assignmentType === 'role' ? 'secondary.main' : 'transparent',
                                        color: assignmentType === 'role' ? 'white' : 'secondary.main',
                                        borderColor: 'secondary.main',
                                        '&:hover': {
                                            backgroundColor: assignmentType === 'role' ? 'secondary.dark' : 'rgba(156, 39, 176, 0.04)'
                                        }
                                    }}
                                >
                                    A Rol
                                </Button>

                                <Button
                                    variant={assignmentType === 'user' ? 'contained' : 'outlined'}
                                    onClick={() => setAssignmentType('user')}
                                    sx={{
                                        backgroundColor: assignmentType === 'user' ? 'info.main' : 'transparent',
                                        color: assignmentType === 'user' ? 'white' : 'info.main',
                                        borderColor: 'info.main',
                                        '&:hover': {
                                            backgroundColor: assignmentType === 'user' ? 'info.dark' : 'rgba(3, 169, 244, 0.04)'
                                        }
                                    }}
                                >
                                    A Usuario
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                {assignmentType === 'role' && (
                                    <>
                                        <Box sx={{ minWidth: 200 }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Seleccionar Rol:
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: 1,
                                                    minHeight: 40,
                                                    border: '2px solid',
                                                    borderColor: 'primary.main',
                                                    borderRadius: 2,
                                                    p: 1,
                                                    backgroundColor: 'rgba(41, 163, 116, 0.05)'
                                                }}
                                            >
                                                {roles.map((role) => (
                                                    <Chip
                                                        key={role.id}
                                                        label={role.name}
                                                        onClick={() => setSelectedRole(role.id === selectedRole ? '' : role.id)}
                                                        color={selectedRole === role.id ? 'primary' : 'default'}
                                                        clickable
                                                        sx={{
                                                            backgroundColor: selectedRole === role.id ? 'primary.main' : 'white',
                                                            color: selectedRole === role.id ? 'white' : 'text.primary',
                                                            fontWeight: selectedRole === role.id ? 'bold' : 'normal'
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    </>
                                )}

                                {assignmentType === 'user' && (
                                    <>
                                        <Box sx={{ minWidth: 200 }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Seleccionar Usuario:
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: 1,
                                                    minHeight: 40,
                                                    border: '2px solid',
                                                    borderColor: 'primary.main',
                                                    borderRadius: 2,
                                                    p: 1,
                                                    backgroundColor: 'rgba(41, 163, 116, 0.05)'
                                                }}
                                            >
                                                {users.map((user) => (
                                                    <Chip
                                                        key={user.id}
                                                        label={`${user.name} (${user.email})`}
                                                        onClick={() => setSelectedUser(user.id === selectedUser ? '' : user.id)}
                                                        color={selectedUser === user.id ? 'info' : 'default'}
                                                        clickable
                                                        sx={{
                                                            backgroundColor: selectedUser === user.id ? 'info.main' : 'white',
                                                            color: selectedUser === user.id ? 'white' : 'text.primary',
                                                            fontWeight: selectedUser === user.id ? 'bold' : 'normal'
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </motion.div>

                    {((assignmentType === 'role' && selectedRole) || (assignmentType === 'user' && selectedUser)) && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    {isAssignMode
                                        ? `Permisos disponibles para asignar${assignmentType === 'role' ? ' al rol' : ' al usuario'}`
                                        : `Permisos asignados${assignmentType === 'role' ? ' al rol' : ' al usuario'} para eliminar`
                                    }
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    minHeight: 60,
                                    p: 2,
                                    border: '2px dashed',
                                    borderColor: 'grey.400',
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                }}>
                                    {getAvailablePermissionsForSelection().length > 0 ? (
                                        getAvailablePermissionsForSelection().map((permission) => {
                                            const isSelected = selectedPermissions.includes(permission.id)
                                            return (
                                                <Box
                                                    key={permission.id}
                                                    onClick={() => handlePermissionChipClick(permission)}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        position: 'relative'
                                                    }}
                                                >
                                                    <Chip
                                                        label={permission.name}
                                                        variant={isSelected ? 'filled' : 'outlined'}
                                                        color={isSelected ? (isAssignMode ? 'success' : 'error') : 'default'}
                                                        clickable
                                                        sx={{
                                                            backgroundColor: isSelected
                                                                ? (isAssignMode ? theme.palette.success.main : theme.palette.error.main)
                                                                : 'white',
                                                            color: isSelected ? 'white' : 'text.primary',
                                                            fontWeight: isSelected ? 'bold' : 'normal',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)'
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            )
                                        })
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            {isAssignMode
                                                ? 'No hay permisos disponibles para asignar'
                                                : 'No hay permisos asignados para eliminar'
                                            }
                                        </Typography>
                                    )}
                                </Box>

                                {selectedPermissions.length > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {selectedPermissions.length} permiso{selectedPermissions.length !== 1 ? 's' : ''} seleccionado{selectedPermissions.length !== 1 ? 's' : ''}:
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                                            {selectedPermissions.map((permissionId) => {
                                                const permission = permissions.find(p => p.id === permissionId)
                                                return permission ? (
                                                    <Chip
                                                        key={permissionId}
                                                        label={permission.name}
                                                        onDelete={() => handleTogglePermission(permissionId)}
                                                        deleteIcon={<RemoveIcon />}
                                                        color="primary"
                                                        sx={{ backgroundColor: theme.palette.success.main, color: 'white' }}
                                                    />
                                                ) : null
                                            })}
                                        </Box>
                                    </Box>
                                )}

                                <LoadingButton
                                    variant="contained"
                                    size="large"
                                    onClick={handleAssignment}
                                    loading={loading}
                                    disabled={!selectedPermissions.length}
                                    sx={{
                                        mt: 3,
                                        backgroundColor: isAssignMode ? 'success.main' : 'error.main',
                                        '&:hover': {
                                            backgroundColor: isAssignMode ? 'success.dark' : 'error.dark'
                                        },
                                        minWidth: 200
                                    }}
                                >
                                    {isAssignMode ? 'Asignar Permisos' : 'Eliminar Permisos'}
                                </LoadingButton>
                            </Box>
                        </motion.div>
                    )}

                    {((assignmentType === 'role' && !selectedRole) || (assignmentType === 'user' && !selectedUser)) && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                            <Box sx={{ mb: 4, textAlign: 'center', p: 4, border: '2px dashed', borderColor: 'grey.400', borderRadius: 2 }}>
                                <Typography variant="h6" color="text.secondary">
                                    Por favor, selecciona un {assignmentType === 'role' ? 'rol' : 'usuario'} para continuar
                                </Typography>
                            </Box>
                        </motion.div>
                    )}
                </Container>
            </Box>

            <Footer />

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default AssignPermission