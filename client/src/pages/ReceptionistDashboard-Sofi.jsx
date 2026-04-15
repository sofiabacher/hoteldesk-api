import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Container, Grid, Typography, Paper, IconButton, Tooltip, Card, CardContent, Button } from '@mui/material'
import { Login as CheckInIcon, Logout as CheckOutIcon, Hotel as HotelIcon, PeopleAlt as GuestsIcon, Assignment as BookingIcon, CleaningServices as CleaningIcon, CalendarToday as CalendarIcon, Sync as SyncIcon, PersonOutline as ProfileIcon, PowerSettingsNew as LogoutIcon, Build as OutOfServiceIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'
import AdminActionCard from '../components/AdminActionCard'
import axios from '../utils/axiosConfig'

const ReceptionistDashboard = () => {
    const theme = useTheme()
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [stats, setStats] = useState({
        totalRooms: 0,
        occupiedRooms: 0,
        availableRooms: 0,
        cleaningRooms: 0,
        outOfServiceRooms: 0,
        todayCheckins: 0,
        todayCheckouts: 0,
        pendingCheckins: 0,
        pendingCheckouts: 0
    })

    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState('')

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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                const response = await axios.get('http://localhost:3000/receptionist/dashboard/stats')

                if (response.data.success) {
                    setStats(response.data.data)
                    setLastUpdate(response.data.data.lastUpdate)
                } else {
                    throw new Error(response.data.message || 'Error al cargar estadísticas')
                }

            } catch (error) {
                console.error('Error al cargar estadísticas:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
        const interval = setInterval(fetchStats, 30000)   // Actualizar cada 30 segundos
        return () => clearInterval(interval)

    }, [])

    const actionCards = [
        {
            title: 'Check-in',
            icon: CheckInIcon,
            count: stats.pendingCheckins,
            subtitle: 'Pendientes de procesar',
            color: theme.palette.success.main,
            description: 'Procesar llegadas de huéspedes'
        },
        {
            title: 'Check-out',
            icon: CheckOutIcon,
            count: stats.pendingCheckouts,
            subtitle: 'Pendientes de procesar',
            color: theme.palette.warning.main,
            description: 'Procesar salidas de huéspedes'
        },
        {
            title: 'Habitaciones Totales',
            icon: HotelIcon,
            count: stats.totalRooms,
            subtitle: 'Total del hotel',
            color: theme.palette.primary.main,
            description: 'Ver todas las habitaciones'
        },
        {
            title: 'Habitaciones Ocupadas',
            icon: BookingIcon,
            count: stats.occupiedRooms,
            subtitle: 'Actualmente ocupadas',
            color: theme.palette.info.main,
            description: 'Habitaciones con huéspedes'
        }
    ]

    const statusCards = [
        {
            title: 'Disponibles',
            value: stats.availableRooms,
            total: stats.totalRooms,
            color: theme.palette.success.main,
            icon: HotelIcon
        },
        {
            title: 'Ocupadas',
            value: stats.occupiedRooms,
            total: stats.totalRooms,
            color: theme.palette.warning.main,
            icon: BookingIcon
        },
        {
            title: 'En Limpieza',
            value: stats.cleaningRooms,
            total: stats.totalRooms,
            color: theme.palette.info.main,
            icon: CleaningIcon
        },
        {
            title: 'Fuera de Servicio',
            value: stats.outOfServiceRooms,
            total: stats.totalRooms,
            color: theme.palette.error.main,
            icon: OutOfServiceIcon
        }
    ]

    if (loading) {
        return (
            <>
                <NavBar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <SyncIcon sx={{ fontSize: 60, color: 'primary.main', animation: 'spin 1s linear infinite' }} />
                        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}> Cargando panel de recepción... </Typography>
                    </Box>
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
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <SectionTitle subtitle="Panel de gestión hotelera"> Panel de Recepcionista </SectionTitle>
                                <Typography variant="body2" color="text.secondary">
                                    Última actualización: {lastUpdate}
                                </Typography>
                            </Box>
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {actionCards.map((card, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                                        <Card sx={{ cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                                            <Box sx={{ backgroundColor: card.color, color: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <card.icon sx={{ fontSize: 28 }} />
                                                
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="h6" fontWeight="bold"> {card.title} </Typography>
                                                    <Typography variant="caption"> {card.description} </Typography>
                                                </Box>
                                            </Box>

                                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 1 }}>
                                                <Typography variant="h3" fontWeight="bold" color={card.color}> {card.count} </Typography>
                                                <Typography variant="body2" color="text.secondary"> {card.subtitle} </Typography>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '30px' }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'text.secondary' }}> Estado de Habitaciones </Typography>
                            
                            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                                {statusCards.map((card, index) => (
                                    <Grid item xs={12} sm={6} md={3} lg={2.4} key={index}>
                                        <AdminActionCard
                                            title={card.title}
                                            icon={card.icon}
                                            value={card.value}
                                            change={`${Math.round((card.value / card.total) * 100)}% del total`}
                                            showStats={true}
                                            statsColor={card.color}
                                            changeType={card.value === 0 ? 'error' : 'success'}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            <Footer />
        </Box>
    )
}

export default ReceptionistDashboard