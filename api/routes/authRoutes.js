const router = require('express').Router()

const { login, register, activate, resendActivation, recoverPassword, resetPassword, validateResetToken} = require('../controller/authController')
const validateFields = require('../middlewares/validateFields')
const { loginRules, registerRules, recoverRules, resetRules} = require('../validators/authValidator')


router.post('/login', loginRules, validateFields, login)
router.post('/register', registerRules, validateFields, register)

//Endpoints de activación de cuenta
router.post('/activate', activate)
router.post('/resend-activation', resendActivation)

//Endpoints de recuperación de contraseña - públicos
router.post('/recover-password', recoverRules, validateFields, recoverPassword)
router.post('/reset-password', resetRules, validateFields, resetPassword)
router.post('/validate-reset-token', validateResetToken)

module.exports = router