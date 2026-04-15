const User = require('../models/User')
const Role = require('../models/Role')
const logger = require('../utils/logger')
const { Op } = require('sequelize')

const { createError } = require('../utils/helpers/errorHelper')
const { login: loginMessages, register: registerMessages, token: tokenMessages, recovery: recoveryMessages } = require('../utils/messages')
const { USER_STATES, LOGIN_MAX_ATTEMPTS, LOG_ACTIONS, USER_STATE_LABELS, CRITICITY } = require('../utils/constants')
const { generateToken, verifyToken, generateLoginToken } = require('../utils/token')
const { sendActivationEmail, sendRecoveryEmail } = require('../services/mailService/senders');


const loginUser = async ({ email, password }) => {
    const user = await User.findOne({
        where: {
            email,
            userStateId: {
                [Op.in]: [
                    USER_STATES.ACTIVE,    // Usuario activo
                    USER_STATES.INACTIVE   // Usuario inactivo (pendiente de activación)
                ]
            }
        },
        include: { model: Role, through: { attributes: [] } }  //Oculta datos de user_roles (sólo agrega el id y name del role)
    })

    if (!user) {
        await logger(
            null,
            LOG_ACTIONS.LOGIN_FAIL.message,
            `Intento de login con email no registrado: ${email}`,
            LOG_ACTIONS.LOGIN_FAIL.criticity
        )

        throw createError(loginMessages.errors.notFound, 400)
    }

    if (user.userStateId !== USER_STATES.ACTIVE) {
        await logger(
            user.id,
            LOG_ACTIONS.LOGIN_FAIL.message,
            `${loginMessages.errors.inactive} - Estado actual: ${USER_STATE_LABELS[user.userStateId]}`,
            LOG_ACTIONS.LOGIN_FAIL.criticity
        )

        throw createError(loginMessages.errors.inactive, 403)
    }

    const valid = await user.validPassword(password)  //Validar contraseña ingresada
    if (!valid) {
        user.failedAttempts += 1

        await logger(
            user.id,
            LOG_ACTIONS.LOGIN_FAIL.message,
            `${loginMessages.errors.wrongPassword} - Intento ${user.failedAttempts}/${LOGIN_MAX_ATTEMPTS}`,
            LOG_ACTIONS.LOGIN_FAIL.criticity
        )

        if (user.failedAttempts >= LOGIN_MAX_ATTEMPTS) {
            user.userStateId = USER_STATES.BLOCKED

            await logger(
                user.id,
                LOG_ACTIONS.USER_BLOCKED.message,
                `${loginMessages.errors.blocked} ${LOGIN_MAX_ATTEMPTS} intentos fallidos`,
                LOG_ACTIONS.USER_BLOCKED.criticity
            )
        }

        await user.save()

        throw createError(user.userStateId === USER_STATES.BLOCKED ? loginMessages.errors.blocked : loginMessages.errors.wrongPassword, user.userStateId === USER_STATES.BLOCKED ? 403 : 401)
    }

    user.failedAttempts = 0  //Login exitoso

    await Promise.all([
        user.save(),

        logger(
            user.id,
            LOG_ACTIONS.LOGIN_SUCCESS.message,
            `${loginMessages.success} para usuario ID ${user.id} - Email: ${user.email}`,
            LOG_ACTIONS.LOGIN_SUCCESS.criticity
        )
    ])

    return user 
}

const registerUser = async ({ name, lastName, email, password }) => {
    const existsUser = await User.findOne({
        where: {
            email,
            userStateId: {
                [Op.in]: [
                    USER_STATES.ACTIVE,    // Usuario activo
                    USER_STATES.INACTIVE   // Usuario inactivo (pendiente de activación)
                ]
            }
        }
    })

    if (existsUser) {
        throw createError(registerMessages.errors.duplicatedEmail, 400)
    }

    const newUser = await User.create({
        name,
        lastName,
        email,
        password,
        userStateId: USER_STATES.INACTIVE,
        dvh: null
    })

    await Promise.all([
        newUser.save(),

        logger(
            newUser.id,
            LOG_ACTIONS.REGISTER_SUCCESS.message,
            `${registerMessages.pendingActivation} para usuario ID: ${newUser.id} - Email: ${newUser.email}`,
            LOG_ACTIONS.REGISTER_SUCCESS.criticity
        )
    ])

    const token = generateToken(newUser.id)

    try {
        await sendActivationEmail(newUser, token)
    } catch (err) {
        const emailError = createError("Usuario creado pero ocurrio un error al enviar la notificación", 202)
        emailError.userId = newUser.id
        throw emailError
    }

    return { success: true, userId: newUser.id }
}

const activateUser = async (token) => {
    const { valid, payload } = verifyToken(token)

    if (!valid) {
        throw createError(tokenMessages.invalidOrExpiredToken, 400)
    }

    const user = await User.findByPk(payload.userId)
    if (!user) {
        throw createError(loginMessages.errors.notFound, 400)
    }

    if (user.userStateId !== USER_STATES.ACTIVE) {
        user.userStateId = USER_STATES.ACTIVE
        user.activatedAt = new Date()

        await Promise.all([
            user.save(),

            logger(
                user.id,
                LOG_ACTIONS.REGISTER_SUCCESS.message,
                `Usuario activado: ID ${user.id} - Email ${user.email}`,
                CRITICITY.MEDIUM
            )
        ])
    }

    return {
        success: true,
        message: registerMessages.success + ". Ya puedes iniciar sesión"
    }
}

const resendActivationUser = async (email) => {
    const user = await User.findOne({
        where: {
            email,
            userStateId: {
                [Op.in]: [
                    USER_STATES.ACTIVE,    // Usuario activo
                    USER_STATES.INACTIVE   // Usuario inactivo (pendiente de activación)
                ]
            }
        }
    })

    if (!user) {
        throw createError(loginMessages.errors.notFound, 400)
    }

    if (user.userStateId === USER_STATES.ACTIVE) {
        throw createError("La cuenta ya está activada", 400)
    }

    const token = generateToken(user.id)

    try {
        await sendActivationEmail(user, token)
    } catch (err) {
        throw createError(registerMessages.errors.activationMailFailed, 500)
    }

    return {
        success: true,
        message: registerMessages.activationResent
    }
}

const recoverPasswordUser = async (email) => {
    const user = await User.findOne({
        where: {
            email,
            userStateId: {
                [Op.in]: [
                    USER_STATES.ACTIVE,    // Usuario activo
                    USER_STATES.INACTIVE   // Usuario inactivo (pendiente de activación)
                ]
            }
        }
    })

    if (!user) {
        throw createError(loginMessages.errors.notFound, 400)
    }

    if (user.userStateId !== USER_STATES.ACTIVE) {
        throw createError(loginMessages.errors.inactive, 403)
    }

    const token = generateToken(user.id)

    try {
        await sendRecoveryEmail(user, token)
    } catch (err) {
        throw createError(recoveryMessages.errors.recoveryMailFailed, 500)
    }

    return { success: true, message: recoveryMessages.recoveryEmailSent }
}

const resetPasswordUser = async (token, password, confirmPassword) => {
    const { valid, payload } = verifyToken(token)

    if (!valid) {
        throw createError(tokenMessages.invalidOrExpiredToken, 400)
    }

    if (password !== confirmPassword) {
        throw createError(recoveryMessages.errors.differentsPassword, 400)
    }

    const user = await User.findByPk(payload.userId)
    if (!user) {
        throw createError(loginMessages.errors.notFound, 400)
    }

    user.password = password  //Asigno nueva password al campo password

    await Promise.all([
        user.save(),

        logger(
            user.id,
            LOG_ACTIONS.PASSWORD_CHANGE.message,
            `Contraseña actualizada para usuario: ID ${user.id} - Email ${user.email}`,
            LOG_ACTIONS.PASSWORD_CHANGE.criticity
        )
    ])

    return { success: true, message: recoveryMessages.success }
}

const validateTokenReset = async (token) => {
    const { valid, payload } = verifyToken(token)

    if (!valid) {
        throw createError(tokenMessages.invalidOrExpiredToken, 400)
    }

    return { success: true, message: tokenMessages.success }
}


module.exports = {
    loginUser,
    registerUser,
    activateUser,
    resendActivationUser,
    recoverPasswordUser,
    resetPasswordUser,
    validateTokenReset
}
