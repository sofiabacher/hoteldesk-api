const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
const { calcularDVH, actualizarDVV } = require('../utils/integrity')

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    dvh: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'roles',
    timestamps: true,

    hooks: {
        beforeCreate: async (role) => {
            role.dvh = calcularDVH(role.toJSON())
        },

        beforeUpdate: async (role) => {
            role.dvh = calcularDVH(role.toJSON())
        },

        afterCreate: async (role) => {
            await actualizarDVV(Role, 'roles', null, 1)
        },

        afterUpdate: async (role) => {
            await actualizarDVV(Role, 'roles', null, 1)
        },

        afterDestroy: async (role) => {
            await actualizarDVV(Role, 'roles', null, 1)
        }
    }
})

module.exports = Role