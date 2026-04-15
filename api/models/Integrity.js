const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const Integrity = sequelize.define('Integrity', {
  tableName: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false
  },
  dvv: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'integrity',
  timestamps: false
})

module.exports = Integrity