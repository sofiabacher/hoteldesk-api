const Log = require('../models/Log')
const User = require('../models/User')
const { Op } = require('sequelize')
const { createError } = require('../utils/helpers/errorHelper')
const { admin: adminMessages } = require('../utils/messages')
const { CRITICITY } = require('../utils/constants')

const getBitacoraLogs = async (filters = {}) => {
    const { page = 1, limit = 50, startDate = null, endDate = null, action = null }=filters;
    const offset = (parseInt(page) - 1) * parseInt(limit)

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        throw createError('La fecha de fin no puede ser anterior a la fecha de inicio', 400)
    }

    let whereClause = {}

    if (startDate && endDate) {
        whereClause.createdAt = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
        }

    } else if (startDate) {
        whereClause.createdAt = {
            [Op.gte]: new Date(startDate)
        }

    } else if (endDate) {
        whereClause.createdAt = {
            [Op.lte]: new Date(endDate)
        }
    }

    if (action) { whereClause.action = { [Op.like]: `%${action}%` } }

    try {
        const { count, rows: logs } = await Log.findAndCountAll({
            where: whereClause,
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email'],
                required: false     //LEFT JOIN para incluir logs sin usuario
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        })

        const totalPages = Math.ceil(count / parseInt(limit))

        const stats = logs.reduce((acc, log) => {   // Calcular estadísticas
            acc.total++
            switch (log.criticity) {
                case CRITICITY.LOW:
                    acc.baja++
                    break
                case CRITICITY.MEDIUM:
                    acc.media++
                    break
                case CRITICITY.HIGH:
                    acc.alta++
                    break
                case CRITICITY.CRITICAL:
                    acc.critica++
                    break
            }

            return acc
        }, { total: 0, baja: 0, media: 0, alta: 0, critica: 0 })

        return {
            logs,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalLogs: count,
                hasNext: parseInt(page) < totalPages,
                hasPrev: parseInt(page) > 1,
                limit: parseInt(limit)
            },
            stats
        }

    } catch (error) {
        throw createError('Error al obtener los registros de bitácora', 500)
    }
}

const getBitacoraForExport = async (filters = {}) => {
    const { startDate = null, endDate = null, action = null } = filters

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        throw createError('La fecha de fin no puede ser anterior a la fecha de inicio', 400)
    }

    let whereClause = {}

    if (startDate && endDate) {
        whereClause.createdAt = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
        }

    } else if (startDate) {
        whereClause.createdAt = {
            [Op.gte]: new Date(startDate)
        }
        
    } else if (endDate) {
        whereClause.createdAt = {
            [Op.lte]: new Date(endDate)
        }
    }

    if (action) { whereClause.action = { [Op.like]: `%${action}%` } }

    try {
        const logs = await Log.findAll({
            where: whereClause,
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email'],
                required: false    //LEFT JOIN para incluir logs sin usuario
            }],
            order: [['createdAt', 'DESC']]
        })

        return logs

    } catch (error) {
        throw createError('Error al obtener los registros para exportación', 500)
    }
}

const generateCSV = (logs) => {
   const csvHeaders=['ID', 'Fecha y Hora', 'Usuario ID', 'Usuario Nombre', 
    'Usuario Email', 'Acción', 'Detalles', 'Criticidad',' Nivel Criticidad'];

    const csvRows = logs.map(log => [
        log.id,
        log.createdAt.toISOString(),
        log.userId || 'N/A',
        log.user?.name || 'Sistema',
        log.user?.email || 'N/A',
        log.action,
        log.details || '',
        log.criticity,
        log.criticity === CRITICITY.LOW ? 'Baja' :
        log.criticity === CRITICITY.MEDIUM ? 'Media' :
        log.criticity === CRITICITY.HIGH ? 'Alta' :
        log.criticity === CRITICITY.CRITICAL ? 'Crítica' : 'Desconocida'
    ])

    const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    return csvContent
}



module.exports = {
    getBitacoraLogs,
    getBitacoraForExport,
    generateCSV
}