import React, { useState, useEffect } from 'react'
import { Snackbar, Alert } from '@mui/material'

const SessionExpiredSnackbar = () => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleSessionExpired = (event) => {
      const sessionMessage = event?.detail?.message || 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      setMessage(sessionMessage)
      setOpen(true)

      setTimeout(() => { window.location.href = '/login' }, 3000)
    }

    window.addEventListener('sessionExpired', handleSessionExpired)

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ marginTop: '64px', zIndex: 9999 }} >
      <Alert onClose={handleClose} severity="warning" variant="filled" sx={{ width: '100%', backgroundColor: '#ff9800', color: 'white', fontWeight: 'bold', fontSize: '16px', '& .MuiAlert-icon': { color: 'white' } }} >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SessionExpiredSnackbar