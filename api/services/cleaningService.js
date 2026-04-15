const { Room } = require('../models')
const { Op } = require('sequelize')
const { createError } = require('../utils/helpers/errorHelper')
const { LOG_ACTIONS, ROOM_STATES, ROOM_STATE_LABELS } = require('../utils/constants')
const { cleaning: cleaningMessages } = require('../utils/messages')
const logger = require('../utils/logger')

const getRoomsInCleaning = async () => {
    try {
        const rooms = await Room.findAll({
            where: {
                roomStateId: ROOM_STATES.CLEANING
            },
            order: [['name', 'ASC']]
        })

        return rooms.map(room => ({
            id: room.id,
            name: room.name,
            type: room.type,
            capacity: room.capacity,
            price: room.price,
            roomStateId: room.roomStateId,
            roomStateLabel: ROOM_STATE_LABELS[room.roomStateId] || 'Desconocido',
            createdAt: room.createdAt
        }))

    } catch (error) {
        throw createError(cleaningMessages.errors.roomsLoadingFailed, 500)
    }
}

const markRoomAsAvailable = async (roomId, userId) => {
    try {
        const room = await Room.findByPk(roomId)

        if (!room) throw createError(cleaningMessages.errors.roomNotFound, 404)
        if (room.roomStateId !== ROOM_STATES.CLEANING) {
            throw createError(cleaningMessages.errors.roomNotInCleaning, 400)
        }

        await room.update({ roomStateId: ROOM_STATES.AVAILABLE })

        await logger(
            userId,
            LOG_ACTIONS.ROOM_UPDATED.message,
            `Habitación ${room.name} marcada como disponible (limpieza completada)`,
            LOG_ACTIONS.ROOM_UPDATED.criticity
        )

        return {
            success: true,
            message: 'Habitación marcada como disponible correctamente',
            roomId: room.id,
            roomName: room.name,
            newState: 'Disponible'
        }

    } catch (error) {
        await logger(
            userId,
            LOG_ACTIONS.ROOM_UPDATE_FAILED.message,
            `Error al marcar habitación ${roomId} como disponible: ${error.message}`,
            LOG_ACTIONS.ROOM_UPDATE_FAILED.criticity
        )

        throw error
    }
}

module.exports = {
    getRoomsInCleaning,
    markRoomAsAvailable
}