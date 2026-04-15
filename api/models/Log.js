const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
const { calcularDVH } = require('../utils/integrity')

const Log = sequelize.define('Log', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        index: true
    },

    action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        index: true
    },

    details: {  //Info adicional sobre el evento 
        type: DataTypes.TEXT,
        allowNull: true
    },

    criticity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,   //1 = baja,  2 = media,  3 = alta,  4 = critico
        validate: {
            min: 1,
            max: 4
        }
    }
}, {
    tableName: 'logs',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
    defaultScope: { order: [['createdAt', 'DESC']] }   //Ordena los registros de las más actual a la más antigua en cada consulta 
})

module.exports = Log