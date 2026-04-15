const { Permission } = require('../models')
const permissionService = require('../services/permissionService')

const getAllPermissions = async (req, res, next) => {
    try {
        const permissions = await permissionService.getAllPermissions()

        res.status(200).json({
            success: true,
            data: permissions,
            message: 'Permisos obtenidos correctamente'
        })

    } catch (error) {
        next(error)
    }
}

const createPermission = async (req, res, next) => {
    try {
        const userId = req.user.id
        const permission = await permissionService.createPermission(req.body, userId)

        res.status(201).json({
            success: true,
            data: permission,
            message: 'Permiso creado correctamente'
        })

    } catch (error) {
        next(error)
    }
}

const updatePermission = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user.id
        const permission = await permissionService.updatePermission(id, req.body, userId)

        res.status(200).json({
            success: true,
            data: permission,
            message: 'Permiso actualizado correctamente'
        })

    } catch (error) {
        next(error)
    }
}

const deletePermission = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user.id
        await permissionService.deletePermission(id, userId)

        res.status(200).json({
            success: true,
            message: 'Permiso eliminado correctamente'
        })

    } catch (error) {
        next(error)
    }
}

const assignPermissionToRole = async (req, res, next) => {
    try {
        const { roleId, permissionId } = req.body
        const userId = req.user.id
        await permissionService.assignPermissionToRole(roleId, permissionId, userId)

        res.status(200).json({
            success: true,
            message: 'Permiso asignado al rol correctamente'
        })

    } catch (error) {
        next(error)
    }
}

const removePermissionFromRole = async (req, res, next) => {
    try {
        const { roleId, permissionId } = req.body
        const userId = req.user.id
        await permissionService.removePermissionFromRole(roleId, permissionId, userId)

        res.status(200).json({
            success: true,
            message: 'Permiso eliminado del rol correctamente'
        })

    } catch (error) {
        next(error)
    }
}

const assignPermissionToUser = async (req, res, next) => {
    try {
        const { userId, permissionId } = req.body
        const adminUserId = req.user.id
        await permissionService.assignPermissionToUser(userId, permissionId, adminUserId)

        res.status(200).json({
            success: true,
            message: 'Permiso asignado al usuario correctamente'
        })

    } catch (error) {
        next(error)
    }
}

const removePermissionFromUser = async (req, res, next) => {
    try {
        const { userId, permissionId } = req.body
        const adminUserId = req.user.id
        await permissionService.removePermissionFromUser(userId, permissionId, adminUserId)

        res.status(200).json({
            success: true,
            message: 'Permiso eliminado del usuario correctamente'
        })

    } catch (error) {
        next(error)
    }
}

const getRolesForAssignment = async (req, res, next) => {
    try {
        const roles = await permissionService.getRolesForPermissionAssignment()

        res.status(200).json({
            success: true,
            data: roles,
            message: 'Roles obtenidos correctamente'
        })

    } catch (error) {
        next(error)
    }
}

const getUsersForAssignment = async (req, res, next) => {
    try {
        const users = await permissionService.getUsersForPermissionAssignment()

        res.status(200).json({
            success: true,
            data: users,
            message: 'Usuarios obtenidos correctamente'
        })
        
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    assignPermissionToRole,
    removePermissionFromRole,
    assignPermissionToUser,
    removePermissionFromUser,
    getRolesForAssignment,
    getUsersForAssignment
}