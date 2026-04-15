import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Chip, Tooltip, TablePagination } from '@mui/material'
import { Person as PersonIcon, Warning as WarningIcon, Info as InfoIcon, Error as ErrorIcon } from '@mui/icons-material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const BitacoraTable = ({ logs = [], loading, pagination, onPageChange }) => {
    const getCriticityInfo = (level) => {
        const criticityMap = {
            1: { label: 'Baja', color: '#4caf50', icon: InfoIcon, bgColor: 'rgba(76, 175, 80, 0.1)' },
            2: { label: 'Media', color: '#ff9800', icon: WarningIcon, bgColor: 'rgba(255, 152, 0, 0.1)' },
            3: { label: 'Alta', color: '#f44336', icon: ErrorIcon, bgColor: 'rgba(244, 67, 54, 0.1)' },
            4: { label: 'Crítica', color: '#9c27b0', icon: ErrorIcon, bgColor: 'rgba(156, 39, 176, 0.1)' }
        }
        return criticityMap[level] || criticityMap[1]
    }

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy HH:mm:ss", { locale: es })
        } catch (error) {
            return dateString
        }
    }

    if (loading) {
        return (
            <Paper elevation={2} sx={{ borderRadius: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ backgroundColor: 'primary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acción</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Criticidad</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Detalles</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                    <CircularProgress color="primary" />
                    <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}> Cargando bitácora... </Typography>
                </Box>
            </Paper>
        )
    }

    return (
        <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acción</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Criticidad</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Detalles</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <Box sx={{ fontSize: 60, color: 'text.secondary', mb: 2, textAlign: 'center' }}>📋</Box>
                                    <Typography variant="h6" color="text.secondary">
                                        No hay registros en la bitácora para mostrar
                                    </Typography>
                                </TableCell>
                            </TableRow>

                        ) : (
                            logs.map((log) => {
                                const criticityInfo = getCriticityInfo(log.criticity)
                                const CriticityIcon = criticityInfo.icon

                                return (
                                    <TableRow key={log.id} sx={{ '&:hover': { backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}>
                                        <TableCell sx={{ fontWeight: 'medium' }}>#{log.id}</TableCell>

                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                {formatDate(log.createdAt)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                        {log.user?.name || 'Sistema'}
                                                    </Typography>
                                                    {log.user?.email && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {log.user.email}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}> {log.action} </Typography>
                                        </TableCell>

                                        <TableCell>
                                           <Chip icon={<CriticityIcon style={{fontSize:"14px"}} />} label={criticityInfo.label} size="small" sx={{backgroundColor:criticityInfo.bgColor,color:criticityInfo.color,border:`1px solid ${criticityInfo.color}`,fontWeight:"bold","& .MuiChip-icon":{color:criticityInfo.color}}} />
                                        </TableCell>

                                        <TableCell>
                                            {log.details ? (
                                                <Box sx={{ maxWidth: 400 }}>
                                                    <Typography variant="body2" sx={{lineHeight:1.4,wordWrap:"break-word",whiteSpace:"normal"}}>
                                                        {log.details}
                                                    </Typography>
                                                </Box>
                                                
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    Sin detalles
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {pagination && (
                <TablePagination
                    component="div"
                    count={pagination.totalLogs}
                    page={pagination.currentPage - 1}
                    onPageChange={(event, newPage) => onPageChange(newPage + 1)}
                    rowsPerPage={50}
                    rowsPerPageOptions={[50]}
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    sx={{
                        borderTop: '1px solid rgba(224, 224, 224, 1)',
                        '& .MuiTablePagination-toolbar': {
                            backgroundColor: 'rgba(41, 163, 116, 0.02)'
                        }
                    }}
                />
            )}
        </Paper>
    )
}

export default BitacoraTable