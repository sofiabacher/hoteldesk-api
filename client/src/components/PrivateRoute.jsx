import React, { useState, useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { Snackbar, Alert } from '@mui/material'
import axios, { clearSession } from '../utils/axiosConfig'


const PrivateRoute = ({ children, allowRoles }) => {   //Recibe componentes hijos (la página) y los roles permitidos para acceder
    const [accessDenied, setAccessDenied] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [shouldRender, setShouldRender] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const loggedRef = useRef(false)  //No registrar dos veces en la bitácora

    useEffect(() => {
        if (loggedRef.current) return
        loggedRef.current = true

        const token = localStorage.getItem('token')
        if (!token) {
            setSnackbarMessage('Acceso denegado: no hay token')
            setAccessDenied(true)

            axios.post('http://localhost:3000/log/access-denied', {
                userId: null,
                attemptedRole: 'Desconocido',
                path: window.location.pathname
            }).catch(err => console.error('No se pudo loguear acceso denegado', err))
            return
        }

        try {
            const decoded = jwtDecode(token)

            // Verificar si el token está expirado
            const currentTime = Date.now() / 1000
            if (decoded.exp < currentTime) {
                // Token expirado - limpiar sesión y mostrar mensaje
                clearSession()

                // Disparar evento personalizado para el snackbar global
                const sessionExpiredEvent = new CustomEvent('sessionExpired', {
                    detail: { message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' }
                })
                window.dispatchEvent(sessionExpiredEvent)

                // Redirigir al login
                setRedirect(true)
                return
            }

            if (!allowRoles.includes(decoded.primaryRole)) {
                setSnackbarMessage('Acceso denegado: rol no autorizado')
                setAccessDenied(true)

                axios.post('http://localhost:3000/log/access-denied', {
                    userId: decoded.id || null,
                    attemptedRole: decoded.primaryRole || 'Desconocido',
                    path: window.location.pathname
                }).catch(err => console.error('No se pudo loguear acceso denegado', err))
                return
            }
            setShouldRender(true)

        } catch (error) {
            // Token inválido - limpiar sesión
            clearSession()

            setSnackbarMessage('Acceso denegado: token inválido')
            setAccessDenied(true)

            axios.post('http://localhost:3000/log/access-denied', {
                userId: null,
                attemptedRole: 'Desconocido',
                path: window.location.pathname
            }).catch(err => console.error('No se pudo loguear acceso denegado', err))
        }
    }, [allowRoles])

    useEffect(() => {
        if (accessDenied) {
            const timer = setTimeout(() => setRedirect(true), 3000)
            return () => clearTimeout(timer)
        }
    }, [accessDenied])

    if (redirect) return <Navigate to="/login" replace />

    if (accessDenied) {
        return (
            <Snackbar open autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="error" variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        )
    }

    return shouldRender ? children : null
}

export default PrivateRoute