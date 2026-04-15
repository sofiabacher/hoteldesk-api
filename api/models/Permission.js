const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')


const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true 
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    module: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    action: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    dvh: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'permissions',
    timestamps: true
})

module.exports = Permission