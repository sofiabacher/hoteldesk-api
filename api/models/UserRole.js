const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
const { calcularDVH, actualizarDVV } = require('../utils/integrity')

const UserRole = sequelize.define('UserRole', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,  //PK compuesta
        references: {
            model: 'users',
            key: 'id'
        }
    },

    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,  //PK compuesta
        references: {
            model: 'roles',
            key: 'id'
        }
    },

    dvh: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'user_roles',
    timestamps: false,

    hooks: {
        beforeCreate: async (userRole) => {
            userRole.dvh = calcularDVH(userRole.toJSON())
        },

        beforeUpdate: async (userRole) => {
            userRole.dvh = calcularDVH(userRole.toJSON())
        },

        afterCreate: async (userRole) => {
            await actualizarDVV(UserRole, 'user_roles', 'roleId')
        },

        afterUpdate: async (userRole) => {
            await actualizarDVV(UserRole, 'user_roles', 'roleId')
        },

        afterDestroy: async (userRole) => {
            await actualizarDVV(UserRole, 'user_roles', 'roleId')
        }
    }
})

module.exports = UserRole