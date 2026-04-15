const { loginUser, registerUser, activateUser, resendActivationUser, recoverPasswordUser, resetPasswordUser, validateTokenReset } = require('../services/authService')
const { generateLoginToken } = require('../utils/token')
const messages = require('../utils/messages')

const login = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await loginUser({ email, password })
        const token = generateLoginToken(user)

        res.status(200).json({
            success: true,
            message: messages.login.success,
            data: { token, user: { avatar: user.avatar } }
        })

    } catch (error) {
        next(error)   //Enviamos el error al middleware global
    }
}

const register = async (req, res, next) => {
    const { name, lastName, email, password } = req.body

    try {
        await registerUser({ name, lastName, email, password })

        res.status(201).json({
            success: true,
            message: messages.register.pendingActivation + ". " + messages.register.activationEmailSent
        })

    } catch (error) {
        if (error.status === 202) {
            return res.status(202).json({
                success: true,
                message: error.message,
                userId: error.userId   //para reenviar el email
            })
        }
       
        next(error)
    }
}

const activate = async (req, res, next) => {
    const { token } = req.body
    
    try {
        const result = await activateUser(token)
        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}

const resendActivation = async (req, res, next) => {
    const { email } = req.body

    try {
        const result = await resendActivationUser(email)
        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}

const recoverPassword = async (req, res, next) => {   //Iniciar recuperación de contraseña
    const { email } = req.body

    try {
        const result = await recoverPasswordUser(email)
        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req, res, next) => {  //Restablecer contraseña 
    const { token, password, confirmPassword } = req.body

    try {
        const result = await resetPasswordUser(token, password, confirmPassword)
        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}

const validateResetToken = async (req, res) => {
    const { token } = req.body

    try {
        const result = await validateTokenReset(token)
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

module.exports = {
    login,
    register,
    activate,
    resendActivation,
    recoverPassword,
    resetPassword,
    validateResetToken
}