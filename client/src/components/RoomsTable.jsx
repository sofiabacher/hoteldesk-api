import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Tooltip, IconButton, Chip } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, PersonOutline as PersonOutlineIcon, MeetingRoom as RoomIcon } from '@mui/icons-material'

const RoomsTable = ({ rooms = [], loading, onEditRoom, onDeleteRoom, roomStates = {}, searchTerm = '', typeFilter = '', statusFilter = '' }) => {
    
    const getColorFromTheme = (colorName) => {
        const colorMap = {
            primary: '#29a374',
            secondary: '#dc004e',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3',
            success: '#4caf50',
            disabled: '#9e9e9e'
        }
        return colorMap[colorName] || '#29a374'
    }

    const highlightText = (text, term) => {
        if (!term || !text) return text

        const regex = new RegExp(`(${term})`, 'gi')
        const parts = text.split(regex)

        return parts.map((part, index) =>
            regex.test(part) ? (
                <Box component="span" key={index} sx={{ backgroundColor: 'warning.light', fontWeight: 'bold' }}> {part} </Box>
            ) : (
                part
            )
        )
    }

    const renderActionButtons = (room) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Tooltip title="Editar habitación">
                <IconButton size="small" onClick={() => onEditRoom(room)} sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' }, p: 0.75 }}>
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar habitación">
                <IconButton size="small" onClick={() => onDeleteRoom(room.id, room.name)} sx={{ backgroundColor: 'error.main', color: 'white', '&:hover': { backgroundColor: 'error.dark' }, p: 0.75 }}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    )

    return (
        <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Habitación</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Capacidad</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Precio</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                    <CircularProgress color="primary" />
                                    <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                                        Cargando habitaciones...
                                    </Typography>
                                </TableCell>
                            </TableRow>

                        ) : rooms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                    <RoomIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">
                                        {searchTerm || typeFilter || statusFilter
                                            ? 'No se encontraron habitaciones con los filtros seleccionados'
                                            : 'No hay habitaciones para mostrar'}
                                    </Typography>
                                </TableCell>
                            </TableRow>

                        ) : (
                            rooms.map((room) => {
                                const stateColor = roomStates[room.roomStateId]?.color || 'primary'
                                const stateLabel = roomStates[room.roomStateId]?.label || 'Desconocido'

                                return (
                                    <TableRow key={room.id} sx={{ '&:hover': { backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}>
                                        <TableCell sx={{ fontWeight: 'medium' }}>#{room.id}</TableCell>

                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                                                    {searchTerm ? highlightText(room.name, searchTerm) : room.name}
                                                </Typography>
                                                {room.size && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {room.size}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Chip label={room.type} size="small" sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }} />
                                        </TableCell>

                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonOutlineIcon fontSize="small" />
                                                <Typography>{room.capacity}</Typography>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                ${room.price.toFixed(0)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip label={stateLabel} size="small" sx={{ backgroundColor: `${getColorFromTheme(stateColor)}15`, color: getColorFromTheme(stateColor), border: `1px solid ${getColorFromTheme(stateColor)}`, fontWeight: 'bold' }} />
                                        </TableCell>

                                        <TableCell align="center"> {renderActionButtons(room)} </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default RoomsTable