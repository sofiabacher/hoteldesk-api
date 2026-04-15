const { processPayment, getPaymentDetails } = require('../services/paymentService')
const { payment: paymentMessages } = require('../utils/messages')

const processBookingPayment = async (req, res, next) => {
    const userId = req.user.id
    const { bookingId } = req.body

    try {
        const result = await processPayment(bookingId, userId)

        res.status(200).json({
            success: true,
            message: paymentMessages.success,
            data: result.data
        })

    } catch (error) {
        next(error)
    }
}

const getPaymentInfo = async (req, res, next) => {
    const userId = req.user.id
    const { bookingId } = req.params

    try {
        const result = await getPaymentDetails(bookingId, userId)

        res.status(200).json({
            success: true,
            message: paymentMessages.confirmed,
            data: result.data
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    processBookingPayment,
    getPaymentInfo
}