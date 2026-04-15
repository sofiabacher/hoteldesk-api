const logger = require('../utils/logger')
const { LOG_ACTIONS } = require('../utils/constants')
const { log: logMessages } = require('../utils/messages')
const { getBitacoraLogs, getBitacoraForExport, generateCSV } = require('../services/bitacoraService')

const logAccessDenied = async (req, res, next) => {
    const { userId = null, attemptedRole = 'Desconocido', path } = req.body

    try {
        await logger(
            userId,
            LOG_ACTIONS.ACCESS_DENIED.message,
            `Intento de acceso denegado a ${path} con rol '${attemptedRole}'`,
            LOG_ACTIONS.ACCESS_DENIED.criticity
        )

        res.status(200).json({
            success: true,
            message: logMessages.accessDenied
        })

    } catch (error) {
        next(error)
    }
}

const logLogout = async (req, res, next) => {
    const userId = req.user?.id || req.body.userId?.id || req.body.userId   //lee el id del token o del body

    try {
        await logger(
            userId,
            LOG_ACTIONS.LOGOUT.message,
            `El usuario ID: ${userId} cerró sesión`,
            LOG_ACTIONS.LOGOUT.criticity
        )

        res.status(200).json({ message: logMessages.logout })

    } catch (error) {
        next(error)
    }
}


const getBitacora = async (req, res, next) => {
    const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        page: req.query.page,
        limit: req.query.limit,
        action: req.query.action
    }

    try {
        const result = await getBitacoraLogs(filters)

        res.status(200).json({
            success: true,
            data: {
                logs: result.logs,
                pagination: result.pagination,
                stats: result.stats
            },
            message: 'Bitácora obtenida exitosamente'
        })

    } catch (error) {
        next(error)
    }
}

const downloadBitacora = async (req, res, next) => {
    const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        action: req.query.action
    }

    try {
        const logs = await getBitacoraForExport(filters)
        const csvContent = generateCSV(logs)

        const fileName = `bitacora_${new Date().toISOString().split('T')[0]}.csv`

        res.setHeader('Content-Type', 'text/csv; charset=utf-8')
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

        // Agregar BOM para que Excel reconozca los caracteres especiales (UTF-8)
        res.send('\ufeff' + csvContent)

    } catch (error) {
        next(error)
    }
}

module.exports = {
    logAccessDenied,
    logLogout,
    getBitacora,
    downloadBitacora
}