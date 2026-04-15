const { getTodayCheckIns, getTodayCheckOuts, processCheckIn, processCheckOut, getDashboardStats, getReceptionistSummary } = require('../services/receptionistService')
const { receptionist: receptionistMessages } = require('../utils/messages')


const getTodayCheckInsController = async (req, res, next) => {  // Obtener check-ins del día
    try {
        const checkIns = await getTodayCheckIns()

        res.status(200).json({
            success: true,
            message: receptionistMessages.checkInsFetched,
            data: {
                checkIns,
                total: checkIns.length,
                pending: checkIns.filter(ci => ci.status === 'pending').length,
                confirmed: checkIns.filter(ci => ci.status === 'confirmed').length
            }
        })

    } catch (error) {
        next(error)
    }
}

const getTodayCheckOutsController = async (req, res, next) => {  // Obtener check-outs del día
    try {
        const checkOuts = await getTodayCheckOuts()

        res.status(200).json({
            success: true,
            message: receptionistMessages.checkOutsFetched,
            data: {
                checkOuts,
                total: checkOuts.length,
                pending: checkOuts.filter(co => co.status === 'pending').length,
                confirmed: checkOuts.filter(co => co.status === 'confirmed').length,
                processing: checkOuts.filter(co => co.status === 'processing').length
            }
        })

    } catch (error) {
        next(error)
    }
}

const processCheckInController = async (req, res, next) => {  // Procesar check-in
    const { bookingId } = req.params
    const userId = req.user.id

    try {
        const result = await processCheckIn(parseInt(bookingId), userId)

        res.status(200).json({
            success: true,
            message: receptionistMessages.checkInProcessed,
            data: {
                bookingId: result.bookingId,
                confirmationCode: result.confirmationCode,
                roomNumber: result.roomNumber,
                guestName: result.guestName
            }
        })

    } catch (error) {
        next(error)
    }
}

const processCheckOutController = async (req, res, next) => {  // Procesar check-out
    const { bookingId } = req.params
    const checkoutData = req.body
    const userId = req.user.id

    try {
        const result = await processCheckOut(parseInt(bookingId), checkoutData, userId)

        res.status(200).json({
            success: true,
            message: receptionistMessages.checkOutProcessed,
            data: {
                bookingId: result.bookingId,
                confirmationCode: result.confirmationCode,
                roomNumber: result.roomNumber,
                guestName: result.guestName,
                additionalCharges: result.additionalCharges,
                notes: result.notes
            }
        })

    } catch (error) {
        next(error)
    }
}

const getDashboardStatsController = async (req, res, next) => {  // Obtener estadísticas del dashboard
    try {
        const stats = await getDashboardStats()

        res.status(200).json({
            success: true,
            message: receptionistMessages.dashboardStatsFetched,
            data: stats
        })

    } catch (error) {
        next(error)
    }
}

// Obtener resumen completo para el dashboard
const getReceptionistSummaryController = async (req, res, next) => {
    try {
        const [stats, checkIns, checkOuts] = await Promise.all([
            getDashboardStats(),
            getTodayCheckIns(),
            getTodayCheckOuts()
        ])

        res.status(200).json({
            success: true,
            message: receptionistMessages.summaryFetched,
            data: {
                stats,
                todayActivity: {
                    checkIns: {
                        total: checkIns.length,
                        pending: checkIns.filter(ci => ci.status === 'pending').length,
                        confirmed: checkIns.filter(ci => ci.status === 'confirmed').length,
                        list: checkIns.slice(0, 5) // Últimos 5 check-ins
                    },
                    checkOuts: {
                        total: checkOuts.length,
                        pending: checkOuts.filter(co => co.status === 'pending').length,
                        confirmed: checkOuts.filter(co => co.status === 'confirmed').length,
                        list: checkOuts.slice(0, 5) // Últimos 5 check-outs
                    }
                },
                lastUpdate: new Date().toLocaleTimeString()
            }
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getTodayCheckInsController,
    getTodayCheckOutsController,
    processCheckInController,
    processCheckOutController,
    getDashboardStatsController,
    getReceptionistSummaryController
}