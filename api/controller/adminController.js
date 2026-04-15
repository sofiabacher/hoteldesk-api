const { getAllUsers, getUsersByStatus, searchUsersBy, updateUserStatus, deleteUser, getDashboardStats, generateReport, getFirstAdminId } = require('../services/adminService')
const { admin: adminMessages } = require('../utils/messages')
const schedulerService = require('../services/schedulerService')

const getDashboard = async (req, res, next) => {
    try {
        const stats = await getDashboardStats()

        res.status(200).json({
            success: true,
            data: stats,
            message: adminMessages.dashboard
        })

    } catch (error) {
        next(error)
    }
}

const getUsers = async (req, res, next) => {
    const filters = req.query

    try {
        const result = await getAllUsers(filters)

        res.status(200).json({
            success: true,
            data: result,
            message: adminMessages.users.success.fetched
        })

    } catch (error) {
        next(error)
    }
}

const getFirstAdmin = async (req, res, next) => {
    try {
        const firstAdminId = await getFirstAdminId()

        res.status(200).json({
            success: true,
            firstAdminId
        })

    } catch (error) {
        next(error)
    }
}

const getByStatus = async (req, res, next) => {
    const { statusId } = req.params

    try {
        const result = await getUsersByStatus(statusId)

        res.status(200).json({
            success: true,
            data: result,
            message: adminMessages.users.success.fetched
        })

    } catch (error) {
        next(error)
    }
}

const searchUser = async (req, res, next) => {
    const { searchTerm, searchType } = req.body

    try {
        const result = await searchUsersBy(searchTerm, searchType)

        res.status(200).json({
            success: true,
            data: result,
            message: adminMessages.users.success.fetched
        })

    } catch (error) {
        next(error)
    }
}

const updateStatus = async (req, res, next) => {
    const { userId } = req.params
    const { userStateId, action } = req.body
    const adminId = req.user.id

    try {
        const result = await updateUserStatus(userId, userStateId, action, adminId)

        const statusMessage =
            result.action === 'block' ? adminMessages.users.success.blocked :
            result.action === 'unblock' ? adminMessages.users.success.unblocked :
            result.action === 'delete' ? adminMessages.users.success.deleted :
            adminMessages.users.success.statusUpdated

        res.status(200).json({
            success: true,
            data: result,
            message: statusMessage
        })

    } catch (error) {
        next(error)
    }
}

const userDelete = async (req, res, next) => {
    const { userId } = req.params
    const adminId = req.user.id

    try {
        const result = await deleteUser(userId, adminId)

        res.status(200).json({
            success: true,
            data: result,
            message: adminMessages.users.success.deleted
        })

    } catch (error) {
        next(error)
    }
}

const getReports = async (req, res, next) => {
    const { reportType } = req.params
    const filters = req.query

    try {
        const reportData = await generateReport(reportType, filters)

        res.status(200).json({
            success: true,
            data: reportData,
            message: adminMessages.reports.success.generated
        })

    } catch (error) {
        next(error)
    }
}

const exportReport = async (req, res, next) => {
    const { reportType } = req.params
    const filters = req.query

    try {
        const reportData = await generateReport(reportType, filters)
        const content = generateReportText(reportType, reportData)
        const filename = 'reporte_' + reportType + '_' + new Date().toISOString().split('T')[0] + '.txt'

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"')

        res.status(200).send(content)

    } catch (error) {
        next(error)
    }
}

const generateReportText = (reportType, reportData) => { //Función para generar el contenido de los reportes
    let content = ''

    content += '=' .repeat(80) + '\n'
    content += 'REPORTE DE ' + reportType.toUpperCase() + '\n'
    content += 'Generado: ' + new Date().toLocaleString('es-ES') + '\n'
    content += '=' .repeat(80) + '\n\n'

    if (reportData.metadata) {
        content += 'METADATOS:\n'
        content += 'Tipo de Reporte: ' + reportData.metadata.reportType + '\n'
        content += 'Fecha de Generación: ' + new Date(reportData.metadata.generatedAt).toLocaleString('es-ES') + '\n\n'
    }

    if (reportData.metrics) {
        content += 'MÉTRICAS:\n'
        content += '-'.repeat(40) + '\n'
        Object.entries(reportData.metrics).forEach(([key, value]) => {
            content += key + ': ' + JSON.stringify(value) + '\n'
        })
        content += '\n'
    }

    if (reportData.reportData && Array.isArray(reportData.reportData)) {
        content += 'DATOS DEL REPORTE:\n'
        content += '-'.repeat(40) + '\n'

        if (reportData.reportData.length === 0) {
            content += 'No se encontraron datos para mostrar.\n'
        } else {
            const headers = Object.keys(reportData.reportData[0])
            content += headers.join(' | ') + '\n'
            content += '-'.repeat(headers.length * 15) + '\n'

            reportData.reportData.forEach(row => {
                const values = headers.map(header => {
                    const value = row[header]
                    return typeof value === 'object' ? JSON.stringify(value) : String(value)
                })
                content += values.join(' | ') + '\n'
            })
        }
    }

    content += '\n' + '=' .repeat(80) + '\n'
    content += 'FIN DEL REPORTE\n'
    content += '=' .repeat(80) + '\n'

    return content
}

const createManualBackup = async (req, res, next) => {
    try {
        const result = await schedulerService.runDatabaseBackup()

        res.status(200).json({
            success: true,
            data: result,
            message: 'Backup manual creado exitosamente'
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getDashboard,
    getUsers,
    getFirstAdmin,
    getByStatus,
    searchUser,
    updateStatus,
    userDelete,
    getReports,
    exportReport,
    createManualBackup
}