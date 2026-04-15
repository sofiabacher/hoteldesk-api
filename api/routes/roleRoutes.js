const router = require('express').Router()

const { getRoles, createNewRole, updateExistingRole, deleteExistingRole, getUsersByRole,  assignRole, removeRole, getUsersForAssignment } = require('../controller/roleController')
const { roleRules, roleIdRules } = require('../validators/roleValidator')

const validateFields = require('../middlewares/validateFields')
const isAuth = require('../middlewares/isAuth')
const checkPermission = require('../middlewares/checkPermission')

// Endpoints para gestión de roles (solo administradores)
router.get('/', isAuth, checkPermission('admin.roles.view'), getRoles)
router.post('/', isAuth, checkPermission('admin.roles.create'), roleRules, validateFields, createNewRole)
router.get('/users', isAuth, checkPermission('admin.users.view'), getUsersForAssignment)

// Endpoints para asignación de roles a usuarios
router.post('/assign', isAuth, checkPermission('admin.users.edit'), assignRole)
router.post('/remove', isAuth, checkPermission('admin.users.edit'), removeRole)

// Endpoints específicos de rol por ID
router.get('/:id/users', isAuth, checkPermission('admin.roles.view'), roleIdRules, validateFields, getUsersByRole)
router.put('/:id', isAuth, checkPermission('admin.roles.edit'), roleIdRules, roleRules, validateFields, updateExistingRole)
router.delete('/:id', isAuth, checkPermission('admin.roles.delete'), roleIdRules, validateFields, deleteExistingRole)

module.exports = router