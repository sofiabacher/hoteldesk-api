const router = require('express').Router()

const { processBookingPayment, getPaymentInfo } = require('../controller/paymentController')
const { paymentProcessingRules, bookingIdRules } = require('../validators/paymentValidator')

const validateFields = require('../middlewares/validateFields')
const isAuth = require('../middlewares/isAuth')
const checkPermission = require('../middlewares/checkPermission')


router.post('/process', isAuth, checkPermission('payment.process'), paymentProcessingRules, validateFields, processBookingPayment)  //Pagar una reserva
router.get('/info/:bookingId', isAuth, checkPermission('payment.info'), bookingIdRules, validateFields, getPaymentInfo)  //Obtener información sobre el pago de una reserva

module.exports = router


