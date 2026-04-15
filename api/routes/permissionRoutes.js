const router = require('express').Router()

const { getAllPermissions, createPermission, updatePermission, deletePermission, assignPermissionToRole, removePermissionFromRole, assignPermissionToUser, removePermissionFromUser, getRolesForAssignment, getUsersForAssignment } = require('../controller/permissionController');
const isAuth = require('../middlewares/isAuth')
const checkPermission = require('../middlewares/checkPermission')

// Rutas para obtener permisos
router.get('/', isAuth, checkPermission('permissions.view'), getAllPermissions)

// Rutas para gestión de permisos
router.post('/', isAuth, checkPermission('permissions.create'), createPermission)
router.put('/:id', isAuth, checkPermission('permissions.edit'), updatePermission)
router.delete('/:id', isAuth, checkPermission('permissions.delete'), deletePermission)

// Rutas para asignación de permisos a roles
router.post('/assign-to-role', isAuth, checkPermission('permissions.assign'), assignPermissionToRole)
router.post('/remove-from-role', isAuth, checkPermission('permissions.remove'), removePermissionFromRole)

// Rutas para asignación directa de permisos a usuarios
router.post('/assign-to-user', isAuth, checkPermission('permissions.assign'), assignPermissionToUser)
router.post('/remove-from-user', isAuth, checkPermission('permissions.remove'), removePermissionFromUser)

// Rutas para obtener datos para asignación
router.get('/roles-for-assignment', isAuth, checkPermission('admin.roles.view'), getRolesForAssignment)
router.get('/users-for-assignment', isAuth, checkPermission('admin.users.view'), getUsersForAssignment)

module.exports = router