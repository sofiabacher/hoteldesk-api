import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Container, Button, Grid, Typography, Snackbar, Alert, CircularProgress } from '@mui/material'
import { ArrowBack as ArrowBackIcon, Assessment as BitacoraIcon, Warning as WarningIcon, Info as InfoIcon, Error as ErrorIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import BitacoraFilters from '../components/BitacoraFilters'
import BitacoraTable from '../components/BitacoraTable'
import AdminActionCard from '../components/AdminActionCard'
import axios from '../utils/axiosConfig'

const BitacoraManagement = () => {
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

    const [logs, setLogs] = useState([])
    const [stats, setStats] = useState({ total: 0, baja: 0, media: 0, alta: 0, critica: 0 })
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(false)
    const [error, setError] = useState('')
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1,  totalLogs: 0, hasNext: false, hasPrev: false })

    const fetchBitacora = async (page = 1, showLoading = true) => {
        try {
            if (showLoading) setLoading(true)
            setError('')

            const params = new URLSearchParams()
            params.append('page', page)
            params.append('limit', 50)

            if (startDate) { params.append('startDate', startDate.toISOString()) }
            if (endDate) { params.append('endDate', endDate.toISOString()) }

            const response = await axios.get(`http://localhost:3000/log/admin/bitacora?${params.toString()}`)
            const { logs: fetchedLogs, pagination: fetchedPagination, stats: fetchedStats } = response.data.data

            setLogs(fetchedLogs)
            setPagination(fetchedPagination)
            setStats(fetchedStats)

        } catch (err) {
            showSnackbar('Error al cargar la bitácora', 'error')

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBitacora()
    }, [startDate, endDate])

    const showSnackbar = (message, severity = 'success') => { setSnackbar({ open: true, message, severity }) }
    const handleSearch = () => { fetchBitacora(1) }
    const handleRefresh = () => { fetchBitacora(pagination.currentPage) }

    const handleDownload = async () => {
        try {
            setDownloading(true)

            const params = new URLSearchParams()
            params.append('format', 'csv')

            if (startDate) { params.append('startDate', startDate.toISOString()) }
            if (endDate) { params.append('endDate', endDate.toISOString()) }

            const response = await axios.get(`http://localhost:3000/log/admin/bitacora/download?${params.toString()}`, { responseType: 'blob' })

            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })  //Crear link de descarga
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')

            link.href = url
            link.setAttribute('download', `bitacora_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            showSnackbar('Bitácora descargada correctamente', 'success')

        } catch (err) {
            showSnackbar('Error al descargar la bitácora', 'error')
        } finally {
            setDownloading(false)
        }
    }

    const handlePageChange = (newPage) => { fetchBitacora(newPage) }

    const criticityStats = [
        {
            title: 'Total Registros',
            icon: BitacoraIcon,
            value: stats.total,
            change: `${stats.total} eventos`,
            color: theme.palette.primary.main
        },
        {
            title: 'Criticidad Baja',
            icon: InfoIcon,
            value: stats.baja,
            change: `${stats.baja} eventos`,
            color: '#4caf50'
        },
        {
            title: 'Criticidad Media',
            icon: WarningIcon,
            value: stats.media,
            change: `${stats.media} eventos`,
            color: '#ff9800'
        },
        {
            title: 'Criticidad Alta',
            icon: ErrorIcon,
            value: stats.alta,
            change: `${stats.alta} eventos`,
            color: '#f44336'
        },
        {
            title: 'Criticidad Crítica',
            icon: ErrorIcon,
            value: stats.critica,
            change: `${stats.critica} eventos`,
            color: '#9c27b0'
        }
    ]

    if (loading && logs.length === 0) {
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
                            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={()=>navigate("/admin")} sx={{mr:3,borderColor:"primary.main",color:"primary.main","&:hover":{borderColor:"primary.dark",backgroundColor:"rgba(41,163,116,0.04)"}}}>
                                Volver al Panel
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <Typography variant="h4" fontWeight="bold" color="primary.main"> Gestión de Bitácora </Typography>
                            </Box>
                        </Box>
                    </motion.div>

                    <Box sx={{ mb: 4, paddingTop: '10px', paddingBottom: '10px' }}>
                        <Box sx={{display:"flex",gap:1,justifyContent:"space-between",width:"100%",overflow:"hidden",px:1}}>
                            {criticityStats.map((stat, index) => (
                                <Box key={index} sx={{ flex: 1, minWidth: 0, maxWidth: '18%', paddingBottom: '12px', paddingTop: '5px' }}>
                                    <AdminActionCard
                                        title={stat.title}
                                        icon={stat.icon}
                                        value={stat.value}
                                        change={stat.change}
                                        showStats={true}
                                        statsColor={stat.color}
                                        changeType="neutral"
                                        sx={{ height: '120px' }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                        <BitacoraFilters
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                            onSearch={handleSearch}
                            onRefresh={handleRefresh}
                            onDownload={handleDownload}
                            loading={loading}
                            downloading={downloading}
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                        <BitacoraTable
                            logs={logs}
                            loading={loading}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                        />
                    </motion.div>
                </Container>
            </Box>

            <Footer />

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={()=>setSnackbar(prev=>({...prev,open:false}))} anchorOrigin={{vertical:"top",horizontal:"center"}}>
                <Alert onClose={()=>setSnackbar(prev=>({...prev,open:false}))} severity={snackbar.severity} sx={{width:"100%"}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default BitacoraManagement