import axios from 'axios' 

// Configurar axios global directamente
axios.defaults.timeout = 10000
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Función centralizada para limpiar sesión
export const clearSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.clear()

  // Eliminar cualquier otro dato de sesión que pueda existir
  Object.keys(localStorage).forEach(key => {
    if (key.includes('auth') || key.includes('user') || key.includes('token')) {
      localStorage.removeItem(key)
    }
  })
}

// Variable global para evitar múltiples redirecciones
let isRedirecting = false

// Interceptor: agrega el token antes de cada request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization // por si no hay token
  }

  return config

}, (error) => Promise.reject(error))

// Interceptor: detecta respuestas 401 y 423
axios.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, la devuelve

  (error) => {
    // Detectar si es un error 401 (Unauthorized)
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || ''
      const isTokenExpired = errorMessage.toLowerCase().includes('expirad') ||
                            errorMessage.toLowerCase().includes('token') ||
                            error.config?.url?.includes('/auth/login') === false

      if (isTokenExpired) {
        if (isRedirecting) return Promise.reject(error)
        isRedirecting = true
        clearSession()

        const sessionExpiredEvent = new CustomEvent('sessionExpired', {
          detail: { message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' }
        })
        window.dispatchEvent(sessionExpiredEvent)

        setTimeout(() => {
          window.location.href = '/login'
          isRedirecting = false
        }, 100)
      }
    }

    // Detectar si es un error 423 (User Deleted)
    if (error.response?.status === 423) {
      if (isRedirecting) return Promise.reject(error)

      isRedirecting = true
      clearSession()

      const message = error.response?.data?.message || 'Tu cuenta ha sido eliminada del sistema.'

      const userDeletedEvent = new CustomEvent('userDeleted', {
        detail: { message }
      })
      window.dispatchEvent(userDeletedEvent)

      setTimeout(() => {
        window.location.href = '/login'
      }, 3000)

      return new Promise(() => {})
    }

    return Promise.reject(error)
  }
)

export default axios
