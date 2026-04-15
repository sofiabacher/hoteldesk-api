    const sequelize = require('../config/db')
    const { DataTypes } = require('sequelize')
    const { calcularDVH, actualizarDVV } = require('../utils/integrity')

    const Room = sequelize.define('Room', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        size: {
            type: DataTypes.STRING(20),
            allowNull: true
        },

        beds: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        amenities: {    //Comodidades de la habitación
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },

        images: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        roomStateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

        dvh: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'rooms',
        timestamps: true,
        
        hooks: {
            beforeCreate: async (room) => {
                room.dvh = calcularDVH(room.toJSON())
            },

            beforeUpdate: async (room) => {
                room.dvh = calcularDVH(room.toJSON())
            },

            afterCreate: async (room) => {
                await actualizarDVV(Room, 'rooms', 'roomStateId')
            },

            afterUpdate: async (room) => {
                await actualizarDVV(Room, 'rooms', 'roomStateId')
            },
            
            afterDestroy: async (room) => {
                await actualizarDVV(Room, 'rooms', 'roomStateId')
            }
        }
    })

    module.exports = Room