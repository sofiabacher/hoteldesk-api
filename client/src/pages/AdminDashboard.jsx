import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'

import { motion } from 'framer-motion'
import { Box, Container, Typography, Card, CardContent, IconButton, CircularProgress, Alert, Snackbar, Grid, Paper, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { GlobalStyles } from '@mui/material'
import { People as PeopleIcon, MeetingRoom as RoomIcon, Event as BookingIcon, PersonAdd as NewUserIcon, Refresh as RefreshIcon, TrendingUp as TrendingUpIcon, Security as AdminIcon,
    RoomService as CleaningIcon, Person as GuestIcon, Assessment as ReportsIcon, BarChart as AnalyticsIcon, Description as BitacoraIcon, Group as RoleIcon, Backup as BackupIcon, Warning as WarningIcon, Shield as SecurityIcon } from '@mui/icons-material'
import AssessmentIcon from '@mui/icons-material/Assessment';

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'
import AdminActionCard from '../components/AdminActionCard'
import StatCard from '../components/StatCard'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [backupDialogOpen, setBackupDialogOpen] = useState(false)
    const [backupLoading, setBackupLoading] = useState(false)

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity })

    const handleCreateBackup = async () => {
        try {
            setBackupLoading(true)
            const response = await axios.post('http://localhost:3000/admin/backup')

            if (response.data.success) {
                showSnackbar('Backup creado exitosamente', 'success')
            } else {
                throw new Error(response.data.message || 'Error desconocido')
            }

        } catch (error) {
            console.error('Error al crear backup:', error)
            showSnackbar(error.response?.data?.message || 'Error al crear el backup', 'error')
        } finally {
            setBackupLoading(false)
            setBackupDialogOpen(false)
        }
    }

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

    const fetchDashboardStats = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await axios.get('http://localhost:3000/admin')
            setStats(response.data.data)

        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar las estadísticas del dashboard')
            showSnackbar(err.response?.data?.message || 'Error al cargar las estadísticas del dashboard', 'error')

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardStats()
    }, [])

  
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <NavBar avatarUrl={avatarUrl} />
                <Container maxWidth="xl" sx={{ py: 20 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={60} />
                        <Typography variant="h6" color="text.secondary">Cargando panel de administración...</Typography>
                    </Box>
                </Container>
            </Box>
        )
    }

    return (
        <>
            <GlobalStyles styles={{
                '@keyframes shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                },
                '@keyframes pulse': {
                    '0%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.7, transform: 'scale(1.1)' },
                    '100%': { opacity: 1, transform: 'scale(1)' }
                }
            }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <NavBar avatarUrl={avatarUrl} />

            <Box sx={{ flexGrow: 1, py: 8, px: { xs: 2, sm: 3, md: 4 }, pt: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: '1440px', mx: 'auto' }}>
                    <SectionTitle subtitle="Gestiona el sistema y visualiza estadísticas">Panel de Administración</SectionTitle>


                    {error && (
                        <Alert severity="error" sx={{ mb: 4, mx: 'auto', maxWidth: '600px' }} onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    {stats && (
                        <>
                            <Box sx={{ mb: 6 }}>
                                <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, boxShadow: '0 8px 32px rgba(41, 163, 116, 0.1)', border: '2px solid', borderColor: 'primary.main' }}>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
                                        🎯 Indicadores Clave del Sistema
                                    </Typography>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, alignItems: 'stretch' }}>
                                        <StatCard title="Usuarios Activos" value={stats.users.active} icon={PeopleIcon} color="primary.main" iconColor="#1976d2" subtitle={"Total registrados: " + stats.users.total} isHighlighted={true} />
                                        <StatCard title="Reservas Confirmadas" value={stats.bookings.confirmed} icon={BookingIcon} color="primary.main" iconColor="#2e7d32" subtitle={"Pendientes: " + stats.bookings.pending} trend={12} isHighlighted={true} />
                                        <StatCard title="Habitaciones Ocupadas" value={stats.rooms.occupied} icon={RoomIcon} color="primary.main" iconColor="#ff9800" subtitle={"Disponibles: " + stats.rooms.available} isHighlighted={true} />
                                        <StatCard title="Administradores" value={stats.roles.admin} icon={AdminIcon} color="primary.main" iconColor="#9c27b0" subtitle={"Staff total: " + (stats.roles.recepcionist + stats.roles.cleaning)} isHighlighted={true} />
                                    </Box>
                                </Paper>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 2 }}>
                                <Grid container spacing={4} sx={{ maxWidth: '1200px', width: '100%', justifyContent: 'center' }}>
                                <Grid item xs={12} lg={6}>
                                    <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%', border: '2px solid', borderColor: 'primary.main' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Box sx={{ backgroundColor: 'primary.main', p: 1.5, borderRadius: 2, mr: 2 }}>
                                                <PeopleIcon sx={{ fontSize: 32, color: 'white' }} />
                                            </Box>
                                           
                                            <Box>
                                                <Typography variant="h5" fontWeight="bold" color="primary.main"> Estadísticas de Usuarios </Typography>
                                                <Typography variant="body2" color="text.secondary"> Distribución y actividad de usuarios </Typography>
                                            </Box>
                                        </Box>

                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <StatCard title="Nuevos (30d)" value={stats.users.newThisMonth} icon={NewUserIcon} color="primary.main" iconColor="#2e7d32" trend={15} isHighlighted={true} />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <StatCard title="Inactivos" value={stats.users.inactive + stats.users.blocked + stats.users.deleted} icon={PeopleIcon} color="primary.main" iconColor="#d32f2f" isHighlighted={true} />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} lg={6}>
                                    <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%', border: '2px solid', borderColor: 'primary.main' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Box sx={{ backgroundColor: 'secondary.main', p: 1.5, borderRadius: 2, mr: 2 }}>
                                                <AdminIcon sx={{ fontSize: 32, color: 'white' }} />
                                            </Box>

                                            <Box>
                                                <Typography variant="h5" fontWeight="bold" color="secondary.main"> Distribución por Roles </Typography>
                                                <Typography variant="body2" color="text.secondary"> Composición del staff y huéspedes </Typography>
                                            </Box>
                                        </Box>

                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <StatCard title="Recepcionistas" value={stats.roles.recepcionist} icon={PeopleIcon} color="primary.main" iconColor="#ff9800" isHighlighted={true} />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <StatCard title="Limpieza" value={stats.roles.cleaning} icon={CleaningIcon} color="primary.main" iconColor="#2e7d32" isHighlighted={true} />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <StatCard title="Huéspedes" value={stats.roles.guest} icon={GuestIcon} color="primary.main" iconColor="#1976d2" isHighlighted={true} />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                            </Box>

                            <Box sx={{ mt: 8, mb: 4 }}>
                                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, border: '2px solid', borderColor: 'primary.main' }}>
                                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                                        <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                                            📋 Centro de Reportes
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                            Genera informes detallados y análisis del rendimiento del sistema
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                       <Grid container spacing={4} sx={{ maxWidth: '1200px', width: '100%', justifyContent: 'center', flexWrap: 'nowrap' }}>
                                        <Grid item xs={12} sm={4} sx={{ flex: '1 1 0', minWidth: 0 }}>
                                            <AdminActionCard title="Reporte de Usuarios" icon={PeopleIcon} color="primary.main" route="/admin/reports/users" isPrimary={false} navigate={navigate} />
                                        </Grid>

                                        <Grid item xs={12} sm={4} sx={{ flex: '1 1 0', minWidth: 0 }}>
                                            <AdminActionCard title="Reporte de Reservas" icon={BookingIcon} color="primary.main" route="/admin/reports/bookings" isPrimary={false} navigate={navigate} />
                                        </Grid>

                                        <Grid item xs={12} sm={4} sx={{ flex: '1 1 0', minWidth: 0 }}>
                                            <AdminActionCard title="Reporte de Integridad" icon={SecurityIcon} color="primary.main" route="/admin/reports/integrity" isPrimary={false} navigate={navigate} />
                                        </Grid>

                                        <Grid item xs={12} sm={4} sx={{ flex: '1 1 0', minWidth: 0 }}>
                                            <AdminActionCard
                                                title="Backup Manual"
                                                icon={BackupIcon}
                                                color="warning.main"
                                                isPrimary={false}
                                                action={() => setBackupDialogOpen(true)}
                                                showStats={false}
                                            />
                                        </Grid>
                                    </Grid>
                                   </Box>
                                </Paper>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>

            <Footer />

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Dialog de confirmación para backup */}
            <Dialog
                open={backupDialogOpen}
                onClose={() => setBackupDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                    Confirmar Backup Manual
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        Está a punto de crear un backup manual de la base de datos.
                    </Typography>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight="bold">
                            ⚠️ Advertencia de Rendimiento
                        </Typography>
                        <Typography variant="body2">
                            Se recomienda realizar backups durante horas de baja concurrencia de usuarios (ej: madrugada o fines de semana) para evitar afectar el rendimiento del sistema.
                        </Typography>
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                        El backup puede tardar varios minutos dependiendo del tamaño de la base de datos.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setBackupDialogOpen(false)}
                        disabled={backupLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCreateBackup}
                        variant="contained"
                        color="warning"
                        disabled={backupLoading}
                        startIcon={backupLoading ? <CircularProgress size={16} /> : <BackupIcon />}
                    >
                        {backupLoading ? 'Creando Backup...' : 'Continuar con Backup'}
                    </Button>
                </DialogActions>
            </Dialog>
            </Box>
        </>
    )
}

export default AdminDashboard