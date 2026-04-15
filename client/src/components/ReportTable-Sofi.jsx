import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Box, Button, IconButton, Tooltip } from '@mui/material'
import { CheckCircle as CheckIcon, Error as ErrorIcon, Warning as WarningIcon, Build as RepairIcon } from '@mui/icons-material'

const ReportTable = ({ data, reportType, tableDetails, onRepairTable }) => {
    if (!data || data.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No hay datos disponibles para mostrar
            </Typography>
        )
    }

    const renderUserTable = () => (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha de Registro</TableCell>
                </TableRow>
            </TableHead>
            
            <TableBody>
                {data.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.role}</TableCell>
                        <TableCell>
                            <Typography variant="body2" color={row.status === 'active' ? 'success.main' : 'text.secondary'} fontWeight="600">
                                {row.status}
                            </Typography>
                        </TableCell>
                        <TableCell>{row.registrationDate}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    const renderBookingTable = () => (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Huésped</TableCell>
                    <TableCell>Habitación</TableCell>
                    <TableCell>Check-in</TableCell>
                    <TableCell>Check-out</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Total</TableCell>
                </TableRow>
            </TableHead>
            
            <TableBody>
                {data.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.guestName}</TableCell>
                        <TableCell>{row.room}</TableCell>
                        <TableCell>{row.checkIn}</TableCell>
                        <TableCell>{row.checkOut}</TableCell>
                        <TableCell>
                            <Typography variant="body2" color={row.status === 'confirmed' ? 'success.main' : 'warning.main'} fontWeight="600">
                                {row.status}
                            </Typography>
                        </TableCell>
                        <TableCell>{row.total}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    const renderIntegrityTable = () => {
        const details = tableDetails || []

        if (!details || details.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No hay detalles de integridad disponibles
                </Typography>
            )
        }

        const getStatusChip = (isValid, severity) => {
            if (isValid || severity === 'success') {
                return (
                    <Chip
                        icon={<CheckIcon />}
                        label="Íntegro"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                )
            } else if (severity === 'warning') {
                return (
                    <Chip
                        icon={<WarningIcon />}
                        label="Advertencia"
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                )
            } else {
                return (
                    <Chip
                        icon={<ErrorIcon />}
                        label="Con errores"
                        color="error"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                )
            }
        }

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tabla</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total Registros</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Registros Activos</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Integridad</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>DVV Actual</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Última Verificación</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {details.map((table, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ fontWeight: '600', fontFamily: 'monospace' }}>
                                {table.table || table.tableName}
                            </TableCell>
                            <TableCell>
                                {getStatusChip(table.isValid, table.severity)}
                            </TableCell>
                            <TableCell>{table.totalRecords}</TableCell>
                            <TableCell>{table.activeRecords}</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {typeof table.integrityPercentage === 'string' && table.integrityPercentage === 'VACÍA' ? (
                                        <>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'info.main'
                                                }}
                                            >
                                                VACÍA
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                (sin registros)
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: parseFloat(table.integrityPercentage) >= 90 ? 'success.main' :
                                                           parseFloat(table.integrityPercentage) >= 70 ? 'warning.main' : 'error.main'
                                                }}
                                            >
                                                {table.integrityPercentage}%
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ({table.activeRecords}/{table.totalRecords})
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                {table.currentDVV}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.85rem' }}>
                                {new Date(table.lastVerification).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </TableCell>
                            <TableCell>
                                {(!table.isValid || table.severity === 'error') && (
                                    <Tooltip title="Reparar integridad de esta tabla">
                                        <IconButton
                                            size="small"
                                            color="warning"
                                            onClick={() => onRepairTable && onRepairTable(table.table || table.tableName)}
                                            sx={{ '&:hover': { backgroundColor: 'warning.light' } }}
                                        >
                                            <RepairIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {table.isValid && (
                                    <Chip
                                        label="OK"
                                        size="small"
                                        color="success"
                                        sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return (
        <TableContainer>
            {reportType === 'users' ? renderUserTable() :
             reportType === 'bookings' ? renderBookingTable() :
             renderIntegrityTable()}
        </TableContainer>
    )
}

export default ReportTable