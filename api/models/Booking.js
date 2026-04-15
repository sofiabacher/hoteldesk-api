const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
const { calcularDVH, actualizarDVV } = require('../utils/integrity')

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        index: true
    },

    roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rooms',
            key: 'id'
        },
        index: true
    },

    checkInDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        index: true
    },

    checkOutDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        index: true
    },

    guests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },

    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending'
    },

    paymentStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending'
    },

    confirmationCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },

    dvh: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'bookings',
    timestamps: true,
    
    hooks: {
        beforeCreate: async (booking) => {
            booking.dvh = calcularDVH(booking.toJSON())
        },

        beforeUpdate: async (booking) => {
            booking.dvh = calcularDVH(booking.toJSON())
        },

        afterCreate: async (booking) => {
            await actualizarDVV(Booking, 'bookings', 'status', 'confirmed')
        },

        afterUpdate: async (booking) => {
            await actualizarDVV(Booking, 'bookings', 'status', 'confirmed')
        },

        afterDestroy: async (booking) => {
            await actualizarDVV(Booking, 'bookings', 'status', 'confirmed')
        }
    }
})

module.exports = Booking