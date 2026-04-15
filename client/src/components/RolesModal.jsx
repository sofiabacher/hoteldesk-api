import React from 'react'
import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Box, Typography } from '@mui/material'


const RolesModal = ({ open, onClose, roles, onSelect }) => {
    const hasRoles = roles && roles.length > 0

    return (
        <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', textAlign: 'center' }}>
                Seleccionar Rol
            </DialogTitle>
            
            {!hasRoles ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        No hay roles disponibles para cambiar.
                    </Typography>
                </Box>
            ) : (
                <List>
                    {roles.map((role) => (
                        <ListItem disablePadding key={role.id}>
                            <ListItemButton onClick={() => onSelect(role.name)}>
                                <ListItemText primary={role.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Dialog>
    )
}

export default RolesModal