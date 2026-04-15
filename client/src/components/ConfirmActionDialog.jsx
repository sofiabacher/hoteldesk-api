import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'

const ConfirmActionDialog = ({ open, onClose, onConfirm, title = "Confirmar Acción", message, userName, actionType, loading = false, entityType = "usuario" }) => {
    const getActionText = (action) => {
        switch (action) {
            case 'delete': return 'Eliminar'
            case 'block': return 'Bloquear'
            case 'unblock': return 'Desbloquear'
            case 'out-of-service': return 'Marcar como Fuera de Servicio'
            default: return 'Confirmar'
        }
    }

    const getActionColor = (action) => {
        switch (action) {
            case 'delete': return 'error'
            case 'block': return 'warning'
            case 'unblock': return 'success'
            case 'out-of-service': return 'warning'
            default: return 'primary'
        }
    }

    return (
        <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' } }}>
            <DialogTitle sx={{ fontSize: 20, fontWeight: 'bold', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider', pb: 2, backgroundColor: "#d2fadcff" }}>
                {title}
            </DialogTitle>

            <DialogContent sx={{ paddinTop: 5, marginTop: 3 }}>
                <Typography variant="body1" color="text.primary"> {message} </Typography>
                
                {userName && (
                    <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}>
                        {entityType.charAt(0).toUpperCase() + entityType.slice(1)}: {userName}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={onClose} variant="outlined" disabled={loading} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'medium' }}>
                    Cancelar
                </Button>

                <LoadingButton onClick={onConfirm} loading={loading} variant="contained" color={getActionColor(actionType)} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'medium', minWidth: 120 }}>
                    {getActionText(actionType)}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmActionDialog