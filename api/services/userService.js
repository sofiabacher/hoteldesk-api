const User = require('../models/User')
const Role = require('../models/Role')
const UserRole = require('../models/UserRole')
const logger = require('../utils/logger')

const { createError } = require('../utils/helpers/errorHelper')
const { sendPasswordUpdateNotice } = require('./mailService/senders')
const { update: updateMessages, login: loginMessages, avatar: avatarMessages } = require('../utils/messages')
const { LOG_ACTIONS } = require('../utils/constants')
const { generateLoginToken } = require('../utils/token')

const getUserById = async (userId) => {
    const user = await User.findByPk(userId, { 
        attributes: ['id', 'name', 'lastName', 'email', 'phone', 'birthdate', 'photo'],
        include: { model: Role, through: { attributes: [] }, attributes: ['id', 'name'] }
    })

    if (!user) {
        throw createError(loginMessages.errors.notFound, 404)
    }

    return user
}

const updateUser = async (userId, data) => {
    try {
        const user = await User.findByPk(userId)

        if (!user) {
            throw createError(loginMessages.errors.notFound, 404)
        }

        const { name, lastName, phone, dni, birthDate, photo } = data

        if (name !== undefined) user.name = name
        if (lastName !== undefined) user.lastName = lastName
        if (phone !== undefined) user.phone = phone
        if (dni !== undefined) user.dni = dni
        if (birthDate !== undefined) user.birthdate = birthDate
        if (photo !== undefined) user.photo = photo

        await Promise.all([
            user.save(),

            logger(
                userId,
                LOG_ACTIONS.USER_UPDATE.message,
                `Datos actualizados para usuario ID: ${userId}`,
                LOG_ACTIONS.USER_UPDATE.criticity
            )
        ])

        return {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            dni: user.dni,
            birthdate: user.birthdate, 
            photo: user.photo
        }

    } catch(error) {
        await logger(
            userId,
            LOG_ACTIONS.UPDATE_ERROR.message,
            `Error al actualizar datos del usuario ID ${userId}: ${error.message}`,
            LOG_ACTIONS.UPDATE_ERROR.criticity
        )

        throw error
    }

}

const changePasswordUser = async (userId, newPassword) => {
    const user = await User.findByPk(userId)

    if (!user) {
        throw createError(loginMessages.errors.notFound, 404)
    }

    user.password = newPassword

    try {
        await sendPasswordUpdateNotice(user)
    } catch (err) {
        const emailError = createError(updateMessages.errors.updatePasswordMailFailed, 202)
        emailError.userId = userId
        throw emailError
    }

    await Promise.all([
        user.save(),

        logger(
            userId,
            LOG_ACTIONS.PASSWORD_CHANGE.message,
            `Cambio de contraseña para usuario ID: ${userId}`,
            LOG_ACTIONS.PASSWORD_CHANGE.criticity
        )
    ])
}

const switchRoleUser = async (userId, roleId) => {
    const roleIdNum = Number(roleId)
    const userRole = await UserRole.findOne({ where: { userId, roleId: roleIdNum } })

    if (!userRole) {
        throw createError(updateMessages.errors.invalidRole, 403)
    }

    const user = await User.findByPk(userId, {
        attributes: ['id', 'email'],
        include: { model: Role, through: { attributes: [] } }
    })

    if (!user) {
        throw createError(loginMessages.errors.notFound, 404)
    }

    const role = await Role.findByPk(roleId)
    if (!role) {
        throw createError(updateMessages.errors.invalidRole, 400)
    }

    const newtoken = generateLoginToken({ id: user.id, email: user.email, Roles: user.Roles, primaryRole: role.name })

    await logger(
        userId,
        LOG_ACTIONS.ROLE_SWITCH.message,
        `El usuario ID: ${userId} cambio su rol a ${role.name}`,
        LOG_ACTIONS.ROLE_SWITCH.criticity
    )

    return newtoken
}

const uploadUserAvatar = async (userId, file) => {
    if (!file) {
        throw createError(avatarMessages.errors.noFileUpload, 400)
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`   //Genera URL accesible públicamente

    const user = await User.findByPk(userId);
    if (!user) {
        throw createError(loginMessages.errors.notFound, 404)
    }

    user.photo = avatarUrl
    await user.save()

    return avatarUrl 
} 


module.exports = {
    getUserById,
    updateUser,
    changePasswordUser,
    switchRoleUser,
    uploadUserAvatar
}