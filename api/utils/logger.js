const Log = require('../models/Log')
const { CRITICITY } = require('./constants')


const logger = async (userId, action, details, criticity = CRITICITY.LOW ) => {
    try {
        await Log.create({
            userId,
            action,
            details, 
            criticity
        })

    } catch (error) {
        console.error('Error al registrar log:', error.message)
    }
}

module.exports = logger