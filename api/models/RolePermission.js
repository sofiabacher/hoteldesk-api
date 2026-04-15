const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
const { calcularDVH, actualizarDVV } = require('../utils/integrity')

const RolePermission = sequelize.define('RolePermission', {
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'roles',
            key: 'id'
        }
    },

    permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'permissions',
            key: 'id'
        }
    },

    dvh: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'role_permissions',
    timestamps: false,

    hooks: {
        beforeCreate: async (rolePermission) => {
            rolePermission.dvh = calcularDVH(rolePermission.toJSON())
        },

        beforeUpdate: async (rolePermission) => {
            rolePermission.dvh = calcularDVH(rolePermission.toJSON())
        },

        afterCreate: async (rolePermission) => {
            await actualizarDVV(RolePermission, 'role_permissions', 'permissionId')
        },

        afterUpdate: async (rolePermission) => {
            await actualizarDVV(RolePermission, 'role_permissions', 'permissionId')
        },

        afterDestroy: async (rolePermission) => {
            await actualizarDVV(RolePermission, 'role_permissions', 'permissionId')
        }
    }
})

module.exports = RolePermission