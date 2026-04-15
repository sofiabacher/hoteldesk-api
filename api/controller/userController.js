const { getUserById, updateUser, changePasswordUser, switchRoleUser, uploadUserAvatar } = require('../services/userService')
const messages = require('../utils/messages')

const getProfile = async (req, res, next) => {
    const userId = req.user.id

    try {
        const user = await getUserById(userId)

        res.status(200).json({
            success: true,
            message: messages.update.userProfileFetched,
            data: { user }
        })

    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res, next) => {
    const userId = req.user.id
    const { name, lastName, phone, dni, birthDate, photo } = req.body

    try {
        const updatedUser = await updateUser(userId, { name, lastName, phone, dni, birthDate, photo })

        res.status(200).json({
            success: true,
            message: messages.update.success,
            data: updatedUser
        })

    } catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
    const userId = req.user.id
    const { newPassword } = req.body

    try {
        await changePasswordUser(userId, newPassword)

        res.status(200).json({
            success: true,
            message: messages.update.passwordUpdated
        })

    } catch (error) {
        next(error)
    }
}

const switchRole = async (req, res, next) => {
    const userId = req.user.id
    const { roleId } = req.body

    try {
        const newRoleToken = await switchRoleUser(userId, roleId)

        res.status(200).json({
            success: true,
            message: messages.update.roleSwitched,
            data: { newRoleToken }
        })

    } catch (error) {
        next(error)
    }
}

const uploadAvatar = async (req, res, next) => {
    const userId = req.user.id
    const file = req.file

    try {
        const avatarUrl = await uploadUserAvatar(userId, file)

        res.status(200).json({
            message: messages.avatar.success,
            url: { avatarUrl }
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    switchRole,
    uploadAvatar
}