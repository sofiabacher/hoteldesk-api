import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Container, Button, Grid, Typography, Snackbar, Alert, CircularProgress } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import { ArrowBack as ArrowBackIcon, Security as PermissionIcon, Gavel as SystemIcon, Assignment as AssignIcon, Person as PersonIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'
import PermissionsTable from '../components/PermissionsTable'
import AdminActionCard from '../components/AdminActionCard'
import axios from '../utils/axiosConfig'

const PermissionManagement = () => {
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

    const [permissions, setPermissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  
    const fetchPermissions = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await axios.get('http://localhost:3000/permissions')
            setPermissions(response.data.data || [])

        } catch (err) {
            showSnackbar('Error al cargar los permisos', 'error')

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPermissions()
    }, [])

    const showSnackbar = (message, severity = 'success') => { setSnackbar({ open: true, message, severity }) }
    const handleRefresh = () => { fetchPermissions() }

    const handleManagePermissions = () => { navigate('/admin/assign-permission') }

    
    const permissionStats = [
        {
            title: 'Total Permisos',
            icon: PermissionIcon,
            value: permissions.length,
            change: `${permissions.length} permisos`,
            color: theme.palette.primary.main
        },
        {
            title: 'Permisos del Sistema',
            icon: SystemIcon,
            value: permissions.filter(p => ['admin.users.view', 'admin.users.edit', 'admin.users.delete', 'admin.roles.view', 'admin.roles.create', 'admin.roles.edit', 'admin.roles.delete', 'admin.rooms.view', 'admin.rooms.create', 'admin.rooms.edit', 'admin.rooms.delete', 'admin.bitacora.view', 'admin.reports.view', 'permissions.manage', 'permissions.view', 'permissions.create', 'permissions.edit', 'permissions.delete', 'permissions.assign', 'permissions.remove'].includes(p.name.toLowerCase())).length,
            change: 'Permisos protegidos',
            color: theme.palette.warning.main
        },
        {
            title: 'Permisos Personalizados',
            icon: PermissionIcon,
            value: permissions.filter(p => !['admin.users.view', 'admin.users.edit', 'admin.users.delete', 'admin.roles.view', 'admin.roles.create', 'admin.roles.edit', 'admin.roles.delete', 'admin.rooms.view', 'admin.rooms.create', 'admin.rooms.edit', 'admin.rooms.delete', 'admin.bitacora.view', 'admin.reports.view', 'permissions.manage', 'permissions.view', 'permissions.create', 'permissions.edit', 'permissions.delete', 'permissions.assign', 'permissions.remove'].includes(p.name.toLowerCase())).length,
            change: 'Permisos editables',
            color: theme.palette.success.main
        }
    ]

    if (loading && permissions.length === 0) {
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
                                <Typography variant="h4" fontWeight="bold" color="primary.main"> Visualización de Permisos </Typography>
                            </Box>
                        </Box>
                    </motion.div>

                    <Box sx={{ mb: 4, paddingTop: '10px', paddingBottom: '10px' }}>
                        <Grid container justifyContent="center" spacing={2} sx={{ maxWidth: 1200, mx: 'auto' }}>
                            {permissionStats.map((stat, index) => (
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
                            <Button variant="contained" startIcon={<AssignIcon />} onClick={handleManagePermissions} sx={{ backgroundColor: 'success.main', '&:hover': { backgroundColor: 'success.dark' } }}>
                                Gestionar Asignación de Permisos
                            </Button>

                            <LoadingButton variant="contained" startIcon={<RefreshIcon />} onClick={handleRefresh} loading={loading} sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, minWidth: '120px' }}>
                                Actualizar
                            </LoadingButton>
                        </Box>
                    </Box>
                </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                        <PermissionsTable
                            permissions={permissions}
                            loading={loading}
                        />
                    </motion.div>
                </Container>
            </Box>

            <Footer />
        </Box>
    )
}

export default PermissionManagement