const { getRoomsInCleaning, markRoomAsAvailable } = require('../services/cleaningService')

const getRoomsInCleaningController = async (req, res) => {
    try {
        const rooms = await getRoomsInCleaning()

        res.json({
            success: true,
            data: { rooms },
            message: 'Habitaciones en limpieza obtenidas correctamente'
        })

    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message || 'Error al obtener habitaciones en limpieza'
        })
    }
}

const markRoomAsAvailableController = async (req, res) => {
    try {
        const { roomId } = req.params
        const userId = req.user.id

        const result = await markRoomAsAvailable(roomId, userId)

        res.json(result)

    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message || 'Error al marcar habitación como disponible'
        })
    }
}

module.exports = {
    getRoomsInCleaningController,
    markRoomAsAvailableController
}