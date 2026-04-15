const router = require('express').Router()

const { getProfile, updateProfile, changePassword, switchRole, uploadAvatar } = require('../controller/userController')
const { updateRules, changePasswordRules, switchRoleRules, } = require('../validators/userValidator')

const isAuth = require('../middlewares/isAuth')
const upload = require('../middlewares/upload')
const validateFields = require('../middlewares/validateFields')
const checkPermission = require('../middlewares/checkPermission')

//Endpoint obtener datos del usuario autenticado
router.get('/profile', isAuth, checkPermission('user.profile.view'), getProfile)
 
//Endpoint modificar usuario
router.put('/profile', isAuth, checkPermission('user.profile.update'), updateRules, validateFields, updateProfile)   //Actualizar datos personales
router.put('/password', isAuth, checkPermission('user.password.change'), changePasswordRules, validateFields, changePassword )   //Cambiar contraseña
router.put('/switch-role', isAuth, checkPermission('user.role.switch'), switchRoleRules, validateFields, switchRole)  //Cambiar a rol activo
router.post('/upload-avatar', isAuth, checkPermission('user.avatar.upload'), upload.single('photo'), uploadAvatar )   //Cambiar foto de perfil
 
module.exports = router

