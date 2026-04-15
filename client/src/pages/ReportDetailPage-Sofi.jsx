import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'
import { motion } from 'framer-motion'
import { Box, Container, Typography, Paper, Button, Alert, Snackbar, CircularProgress, Backdrop, Grid, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon, DateRange as DateRangeIcon, FilterList as FilterIcon, Assessment as AssessmentIcon, People as PeopleIcon, Event as EventIcon, Room as RoomIcon, Security as SecurityIcon, Build as RepairAllIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'

import ReportHeader from '../components/ReportHeader'
import ReportFilters from '../components/ReportFilters'
import ReportActions from '../components/ReportActions'
import ReportTable from '../components/ReportTable'
import ReportMetricsCard from '../components/ReportMetricsCard'

const ReportDetailPage = () => {
    const { reportId } = useParams()
    const navigate = useNavigate()
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [reportData, setReportData] = useState(null)
   
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        status: 'all',
        userType: 'all'
    })

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [repairingAll, setRepairingAll] = useState(false)
    const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity })

    const reportConfig = {
        'users': {
            title: 'Reporte de Usuarios',
            subtitle: 'Análisis completo del comportamiento y actividad de usuarios',
            icon: PeopleIcon,
            color: '#1976d2',
            filters: ['startDate', 'endDate', 'userType']
        },

        'bookings': {
            title: 'Reporte de Reservas',
            subtitle: 'Estadísticas detalladas de reservas y ocupación',
            icon: EventIcon,
            color: '#2e7d32',
            filters: ['startDate', 'endDate', 'status']
        },

        'integrity': {
            title: 'Reporte de Integridad',
            subtitle: 'Verificación de hashes DVH y estado de la base de datos',
            icon: SecurityIcon,
            color: '#f44336',
            filters: []
        }
    }

    const currentReport = reportConfig[reportId] || reportConfig['users']

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

    const handleGenerateReport = async () => {
        setGenerating(true)
        try {
            const params = new URLSearchParams()

            if (filters.startDate) {
                const startDateStr = filters.startDate.toISOString().split('T')[0]
                params.append('startDate', startDateStr)
            }

            if (filters.endDate) {
                const endDateStr = filters.endDate.toISOString().split('T')[0]
                params.append('endDate', endDateStr)
            }

            if (filters.status !== 'all') {
                params.append('status', filters.status)
            }

            if (filters.userType !== 'all') {
                params.append('userType', filters.userType)
            }

            const response = await axios.get(`http://localhost:3000/admin/reports/${reportId}?${params.toString()}`)

            if (response.data.success && response.data.data) {
                const reportResult = response.data.data

                if (reportResult.reportData) {
                    setReportData(reportResult)
                    showSnackbar('Reporte generado exitosamente', 'success')

                } else if (Array.isArray(reportResult)) {
                    setReportData({ reportData: reportResult })
                    showSnackbar('Reporte generado exitosamente', 'success')

                } else {
                    throw new Error('No se encontraron datos de reporte en la respuesta')
                }

            } else if (response.data.data) {
                const reportResult = response.data.data
                setReportData(reportResult.reportData ? reportResult : { reportData: reportResult })
                showSnackbar('Reporte generado exitosamente', 'success')

            } else {
                throw new Error('Estructura de respuesta inválida: ' + JSON.stringify(response.data))
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                                error.message ||
                                'Error al generar el reporte'
            showSnackbar(errorMessage, 'error')

        } finally {
            setGenerating(false)
        }
    }

    const handleExportReport = async () => {
        try {
            const params = new URLSearchParams()

            if (filters.startDate) {
                params.append('startDate', filters.startDate.toISOString().split('T')[0])
            }

            if (filters.endDate) {
                params.append('endDate', filters.endDate.toISOString().split('T')[0])
            }

            if (filters.status !== 'all') {
                params.append('status', filters.status)
            }

            if (filters.userType !== 'all') {
                params.append('userType', filters.userType)
            }

            const response = await axios.get(`http://localhost:3000/admin/reports/${reportId}/export?${params.toString()}`, { responseType: 'blob' } )
            
            const blob = new Blob([response.data], { type: 'text/plain;charset=utf-8' })
            const url = window.URL.createObjectURL(blob)
            const filename = 'reporte_' + reportId + '_' + new Date().toISOString().split('T')[0] + '.txt'

            //Crear un link temporal de descarga
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            link.style.display = 'none'
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            showSnackbar('Reporte descargado exitosamente', 'success')

        } catch (error) {
            console.error('Error exporting report:', error)
            showSnackbar('Error al descargar el reporte', 'error')
        }
    }

    const handleBackToDashboard = () => { navigate('/admin') }

    const handleRepairTable = async (tableName) => {
        try {
            const response = await axios.post(`http://localhost:3000/integrity/repair/${tableName}`)

            if (response.data.success) {
                showSnackbar(`Integridad de la tabla '${tableName}' reparada exitosamente`, 'success')
                // Recargar el reporte después de reparar
                setTimeout(() => {
                    handleGenerateReport()
                }, 1000)
            } else {
                throw new Error(response.data.message || 'Error al reparar la tabla')
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                                error.message ||
                                `Error al reparar la tabla '${tableName}'`
            showSnackbar(errorMessage, 'error')
        }
    }

    const handleRepairAllTables = async () => {
        try {
            setRepairingAll(true)
            const response = await axios.post('http://localhost:3000/integrity/recalculate-all')

            if (response.data.success) {
                const successful = response.data.data.filter(r => r.success).length
                const failed = response.data.data.filter(r => !r.success).length

                showSnackbar(
                    `Reparación completada: ${successful} tablas reparadas, ${failed} con errores`,
                    failed > 0 ? 'warning' : 'success'
                )

                // Recargar el reporte después de reparar
                setTimeout(() => {
                    handleGenerateReport()
                }, 2000)
            } else {
                throw new Error('Error al reparar todas las tablas')
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                                error.message ||
                                'Error al reparar todas las tablas'
            showSnackbar(errorMessage, 'error')
        } finally {
            setRepairingAll(false)
        }
    }

    const renderVisualizationArea = () => {
        if (!reportData) {
            return (
                <Paper elevation={2} sx={{ p: 8, borderRadius: 3, textAlign: 'center' }}>
                    <AssessmentIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No hay datos para mostrar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Configura los parámetros del reporte y haz clic en "Generar Reporte" para ver los resultados
                    </Typography>
                </Paper>
            )
        }

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <AssessmentIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                        <Typography variant="h5" fontWeight="bold" color="primary.main"> Resultados del Reporte </Typography>
                    </Box>

                    {reportId === 'system' || reportId === 'integrity' ? (
                        <Grid container spacing={3}>
                            {reportData.reportData?.map((metric, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <ReportMetricsCard metric={metric} index={index} />
                                </Grid>
                            ))}

                            {/* Show table details for integrity report */}
                            {reportId === 'integrity' && reportData.tableDetails && (
                                <Grid item xs={12}>
                                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mt: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <SecurityIcon sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                                                <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                    Detalles por Tabla
                                                </Typography>
                                            </Box>

                                            {reportData.tableDetails.some(table => !table.isValid || table.severity === 'error') && (
                                                <LoadingButton
                                                    loading={repairingAll}
                                                    loadingPosition="start"
                                                    startIcon={<RepairAllIcon />}
                                                    variant="outlined"
                                                    color="warning"
                                                    onClick={handleRepairAllTables}
                                                    sx={{
                                                        borderRadius: 2,
                                                        fontWeight: 'bold',
                                                        '&:hover': { backgroundColor: 'warning.light' }
                                                    }}
                                                >
                                                    {repairingAll ? 'Reparando...' : 'Reparar Todas'}
                                                </LoadingButton>
                                            )}
                                        </Box>
                                        <ReportTable
                                            data={reportData.reportData}
                                            reportType={reportId}
                                            tableDetails={reportData.tableDetails}
                                            onRepairTable={handleRepairTable}
                                        />
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <ReportTable data={reportData} reportType={reportId} />
                    )}
                </Paper>
            </motion.div>
        )
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <NavBar avatarUrl={avatarUrl} />

            <Box sx={{ flexGrow: 1, py: 8, px: { xs: 2, sm: 3, md: 4 }, pt: '120px' }}>
                <Container maxWidth="xl">
                    <ReportHeader title={currentReport.title} subtitle={currentReport.subtitle} icon={currentReport.icon} color={currentReport.color} />
                    <ReportFilters filters={filters} onFilterChange={setFilters} reportConfig={currentReport} />
                    <ReportActions onGenerate={handleGenerateReport} onExport={handleExportReport} generating={generating} hasData={!!reportData} />
                    {renderVisualizationArea()}
                </Container>
            </Box>

            <Footer />

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    )
}

export default ReportDetailPage