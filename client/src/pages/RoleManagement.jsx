import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Container, Button, Grid, Typography, Snackbar, Alert, CircularProgress } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import { ArrowBack as ArrowBackIcon, Group as RoleIcon, Security as SystemIcon, Add as AddIcon, PersonAdd as PersonAddIcon, PersonRemove as PersonRemoveIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'
import RolesTable from '../components/RolesTable'
import RoleFormDialog from '../components/RoleFormDialog'
import AdminActionCard from '../components/AdminActionCard'
import ConfirmActionDialog from '../components/ConfirmActionDialog'
import axios from '../utils/axiosConfig'

const RoleManagement = () => {
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

    const [roles, setRoles] = useState([])
    const [permissions, setPermissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const [openDialog, setOpenDialog] = useState(false)
    const [editingRole, setEditingRole] = useState(null)
        const [confirmDialog, setConfirmDialog] = useState({ open: false, role: null, message: '' })

    const fetchRoles = async () => {
        try {
            setLoading(true)
            setError('')

            const [rolesResponse, permissionsResponse] = await Promise.all([
                axios.get('http://localhost:3000/roles'),
                axios.get('http://localhost:3000/permissions')
            ])

            setRoles(rolesResponse.data.data || [])
            setPermissions(permissionsResponse.data.data || [])

        } catch (err) {
            showSnackbar('Error al cargar los roles', 'error')

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    const showSnackbar = (message, severity = 'success') => { setSnackbar({ open: true, message, severity }) }
    const handleRefresh = () => { fetchRoles() }

    const handleManageRoles = () => {
        navigate('/admin/assign-role')
    }

    const handleOpenDialog = (role = null) => {
        setEditingRole(role)
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setEditingRole(null)
    }

    const handleSaveRole = async (roleData) => {
        try {
            if (editingRole) {
                await axios.put(`http://localhost:3000/roles/${editingRole.id}`, roleData)
                showSnackbar('Rol actualizado correctamente')
            } else {
                await axios.post('http://localhost:3000/roles', roleData)
                showSnackbar('Rol creado correctamente')
            }

            handleCloseDialog()
            fetchRoles()

        } catch (err) {
            showSnackbar(`Error al ${editingRole ? 'actualizar' : 'crear'} el rol: ${err.response?.data?.message || err.message}`, 'error')
        }
    }

    const confirmDeleteRole = (role) => {
        setConfirmDialog({
            open: true,
            role,
            message: `¿Está seguro de que desea eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`
        })
    }

    const handleDeleteRole = async () => {
        const { role } = confirmDialog
        setConfirmDialog({ open: false, role: null, message: '' })

        try {
            await axios.delete(`http://localhost:3000/roles/${role.id}`)
            showSnackbar('Rol eliminado correctamente')
            fetchRoles()

        } catch (err) {
            showSnackbar(`Error al eliminar el rol: ${err.response?.data?.message || err.message}`, 'error')
        }
    }

    const roleStats = [
        {
            title: 'Total Roles',
            icon: RoleIcon,
            value: roles.length,
            change: `${roles.length} roles`,
            color: theme.palette.primary.main
        },
        {
            title: 'Roles del Sistema',
            icon: SystemIcon,
            value: roles.filter(r => ['admin', 'guest', 'recepcionist', 'cleaning'].includes(r.name.toLowerCase())).length,
            change: 'Roles protegidos',
            color: theme.palette.warning.main
        },
        {
            title: 'Roles Personalizados',
            icon: RoleIcon,
            value: roles.filter(r => !['admin', 'guest', 'recepcionist', 'cleaning'].includes(r.name.toLowerCase())).length,
            change: 'Roles editables',
            color: theme.palette.success.main
        }
    ]

    if (loading && roles.length === 0) {
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
                            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')} sx={{ mr: 3, borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}>
                                Volver al Panel
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <Typography variant="h4" fontWeight="bold" color="primary.main"> Gestión de Roles </Typography>
                            </Box>
                        </Box>
                    </motion.div>

                    <Box sx={{ mb: 4, paddingTop: '10px', paddingBottom: '10px' }}>
                        <Grid container justifyContent="center" spacing={2} sx={{ maxWidth: 1200, mx: 'auto' }}>
                            {roleStats.map((stat, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                                    <AdminActionCard
                                        title={stat.title}
                                        icon={stat.icon}
                                        value={stat.value}
                                        change={stat.change}
                                        showStats={true}
                                        statsColor={stat.color}
                                        changeType="neutral"
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                    <Box sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)', border: '2px solid', borderColor: 'primary.main', borderRadius: 2, p: 4, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>
                                Nuevo Rol
                            </Button>

                            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleManageRoles} sx={{ backgroundColor: 'success.main', '&:hover': { backgroundColor: 'success.dark' } }}>
                                Gestionar Roles de Usuario
                            </Button>

                            <LoadingButton variant="contained" startIcon={<RefreshIcon />} onClick={handleRefresh} loading={loading} sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, minWidth: '120px' }}>
                                Actualizar
                            </LoadingButton>
                        </Box>
                    </Box>
                </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                        <RolesTable
                            roles={roles}
                            loading={loading}
                            onEditRole={handleOpenDialog}
                            onDeleteRole={confirmDeleteRole}
                        />
                    </motion.div>
                </Container>
            </Box>

            <Footer />

            <RoleFormDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSubmit={handleSaveRole}
                editingRole={editingRole}
                availablePermissions={permissions}
                loading={loading}
                showSnackbar={showSnackbar}
            />

            <ConfirmActionDialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
                onConfirm={handleDeleteRole}
                message={confirmDialog.message}
                userName={confirmDialog.role?.name || ''}
                actionType="delete"
                loading={loading}
                entityType="rol"
            />

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
               <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default RoleManagement