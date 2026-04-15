const router = require('express').Router()

const { logAccessDenied, logLogout, getBitacora, downloadBitacora } = require('../controller/logController')
const { bitacoraFiltersRules } = require('../validators/bitacoraValidator')

const validateFields = require('../middlewares/validateFields')
const isAuth = require('../middlewares/isAuth')
const checkPermission = require('../middlewares/checkPermission')

// Endpoints para manejo de logs del sistema
router.post('/access-denied', logAccessDenied)     // Registra intentos de acceso fallidos
router.post('/logout', logLogout)                   // Registra cierres de sesión

// Endpoints para gestión de bitácora (solo administradores)
router.get('/admin/bitacora', isAuth, checkPermission('admin.bitacora.view'), bitacoraFiltersRules, validateFields, getBitacora)
router.get('/admin/bitacora/download', isAuth, checkPermission('admin.bitacora.download'), bitacoraFiltersRules, validateFields, downloadBitacora)

module.exports = router

