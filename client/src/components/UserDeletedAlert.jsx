import React, { useState, useEffect } from 'react'
import { Alert, Snackbar } from '@mui/material'

const UserDeletedAlert = () => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleUserDeleted = (event) => {
      const deletedMessage = event?.detail?.message || 'Tu cuenta ha sido eliminada del sistema.'
      setMessage(deletedMessage)
      setOpen(true)

      setTimeout(() => { window.location.href = '/login' }, 3000)
    }

    window.addEventListener('userDeleted', handleUserDeleted)

    return () => { window.removeEventListener('userDeleted', handleUserDeleted) }
  }, [])

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ zIndex: 9999 }}>
      <Alert severity="error" variant="filled" onClose={() => {}} sx={{ fontSize: '16px', fontWeight: 'bold' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default UserDeletedAlert