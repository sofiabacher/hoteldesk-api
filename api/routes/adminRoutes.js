const router = require('express').Router()

const { getDashboard, getUsers, updateStatus, userDelete, getByStatus, searchUser, getReports, exportReport, getFirstAdmin, createManualBackup } = require('../controller/adminController')
const { adminUserRules, userIdRules, searchUsersRules } = require('../validators/adminValidator')

const validateFields = require('../middlewares/validateFields')
const isAuth = require('../middlewares/isAuth')
const checkPermission = require('../middlewares/checkPermission')
const schedulerService = require('../services/schedulerService')

// Dashboard de administrador
router.get('/', isAuth, checkPermission('admin.users.manage'), getDashboard)

//Endpoints para gestionar usuarios
router.get('/users', isAuth, checkPermission('admin.users.view'), getUsers)  //Obtener todos los usuarios
router.post('/users/search', isAuth, checkPermission('admin.users.view'), searchUsersRules, validateFields, searchUser)  //Buscar usuarios con filtros específicos
router.get('/users/status/:statusId', isAuth, checkPermission('admin.users.view'), getByStatus)  //Obtener usuarios por estado
router.get('/first-admin', isAuth, checkPermission('admin.users.view'), getFirstAdmin)  //Obtener ID del primer admin (admin principal)

// Modificar estado de usuario (bloquear/desbloquear)
router.patch('/users/:userId/status', isAuth, checkPermission('admin.users.edit'), userIdRules, validateFields, updateStatus)

// Eliminar usuario (soft delete)
router.delete('/users/:userId', isAuth, checkPermission('admin.users.delete'), userIdRules, validateFields, userDelete)

// Report endpoints
router.get('/reports/:reportType', isAuth, checkPermission('admin.reports.view'), getReports)
router.get('/reports/:reportType/export', isAuth, checkPermission('admin.reports.view'), exportReport)

// Endpoint manual para backup por admin
router.post('/backup', isAuth, checkPermission('admin.backup.manual'), createManualBackup)

module.exports = router