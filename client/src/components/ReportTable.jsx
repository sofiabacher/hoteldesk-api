import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

const ReportTable = ({ data, reportType }) => {
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

    return (
        <TableContainer>
            {reportType === 'users' ? renderUserTable() : renderBookingTable()}
        </TableContainer>
    )
}

export default ReportTable