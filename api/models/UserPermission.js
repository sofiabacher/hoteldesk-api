const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
const { calcularDVH, actualizarDVV } = require('../utils/integrity')

const UserPermission = sequelize.define('UserPermission', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'users',
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
    tableName: 'user_permissions',
    timestamps: false,

    hooks: {
        beforeCreate: async (userPermission) => {
            userPermission.dvh = calcularDVH(userPermission.toJSON())
        },

        beforeUpdate: async (userPermission) => {
            userPermission.dvh = calcularDVH(userPermission.toJSON())
        },

        afterCreate: async (userPermission) => {
            await actualizarDVV(UserPermission, 'user_permissions', 'permissionId')
        },

        afterUpdate: async (userPermission) => {
            await actualizarDVV(UserPermission, 'user_permissions', 'permissionId')
        },

        afterDestroy: async (userPermission) => {
            await actualizarDVV(UserPermission, 'user_permissions', 'permissionId')
        }
    }
})

module.exports = UserPermission