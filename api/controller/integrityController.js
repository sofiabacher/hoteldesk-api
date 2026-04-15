const { generarReporteIntegrity, repararDVV, verificarDVHRegistro, getTableModels, getTableConfigurations } = require('../utils/integrity')
const { integrity: integrityMessages } = require('../utils/messages')


const getIntegrityReport = async (req, res, next) => {   //Generar un reporte completo del estado de integridad
    try {
        const report = await generarReporteIntegrity()

        res.status(200).json({
            success: true,
            message: integrityMessages.reportSuccess,
            data: report
        })

    } catch (error) {
        next(error)
    }
}

const getIntegrityStatus = async (req, res, next) => {   //Devuelve el estado general de las tablas (resumido)
    try {
        const report = await generarReporteIntegrity()

        res.status(200).json({
            success: true,
            data: {
                status: report.summary.status,
                totalTables: report.summary.totalTables,
                validTables: report.summary.validTables,
                invalidTables: report.summary.invalidTables,
                timestamp: report.summary.timestamp
            }
        })

    } catch (error) {
        next(error)
    }
}

const repairTableIntegrity = async (req, res, next) => {   //Repara el DVV de una tabla específica
    const { tableName } = req.params

    try {
        const tableModels = getTableModels()
        const Model = tableModels[tableName]   //Convierte el nombre en texto a un modelo real
        if (!Model) {
            return res.status(400).json({ success: false, message: integrityMessages.errors.invalidtableName })
        }

        const result = await repararDVV(Model, tableName)

        res.status(200).json({
            success: result.success,
            message: result.message,
            data: result.success ? { dvv: result.dvv } : null
        })

    } catch (error) {
        next(error)
    }
}

const verifyRecordIntegrity = async (req, res, next) => {   //Verifica el DVH de un registro específico
    const { tableName, id } = req.params

    try {
        const tableModels = getTableModels()
        const Model = tableModels[tableName]
        if (!Model) {
            return res.status(400).json({ success: false, message: integrityMessages.errors.invalidtableName })
        }

        const isValid = await verificarDVHRegistro(Model, parseInt(id))

        res.status(200).json({
            success: true,
            data: {
                table: tableName,
                id: parseInt(id),
                valid: isValid,
                status: isValid ? 'DVH válido' : 'DVH inválido'
            }
        })

    } catch (error) {
        next(error)
    }
}

const recalculateAllDVV = async (req, res, next) => {   //Recalcula el DVV de todas las tablas
    try {
        const { tables } = getTableConfigurations()
        const results = []

        for (const table of tables) {
            try {
                const result = await repararDVV(
                    table.Model,
                    table.name,
                    table.estadoCampo,
                    table.estadoActivo
                )

                results.push({
                    table: table.name,
                    success: result.success,
                    message: result.message,
                    dvv: result.success ? result.dvv : null
                })

            } catch (error) {
                results.push({
                    table: table.name,
                    success: false,
                    error: error.message
                })
            }
        }

        res.status(200).json({
            success: true,
            message: integrityMessages.repairDVV,
            data: results
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getIntegrityReport,
    getIntegrityStatus,
    repairTableIntegrity,
    verifyRecordIntegrity,
    recalculateAllDVV
}