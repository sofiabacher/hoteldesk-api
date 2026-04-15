const router = require('express').Router()

const { getTodayCheckInsController, getTodayCheckOutsController, processCheckInController, processCheckOutController, getDashboardStatsController, getReceptionistSummaryController } = require('../controller/receptionistController');
const { bookingIdRules, checkoutRules, searchRules } = require('../validators/receptionistValidator')

const validateFields = require('../middlewares/validateFields')
const isAuth = require('../middlewares/isAuth')
const checkPermission = require('../middlewares/checkPermission')

// Dashboard endpoints
router.get('/dashboard/stats', isAuth, checkPermission('receptionist.dashboard.view'), getDashboardStatsController)
router.get('/summary', isAuth, checkPermission('receptionist.summary.view'), getReceptionistSummaryController)

// Check-in endpoints
router.get('/checkins', isAuth, checkPermission('receptionist.checkin.view'), getTodayCheckInsController)
router.post('/checkin/:bookingId', isAuth, checkPermission('receptionist.checkin.process'), bookingIdRules, validateFields, processCheckInController)

// Check-out endpoints
router.get('/checkouts', isAuth, checkPermission('receptionist.checkout.view'), getTodayCheckOutsController)
router.post('/checkout/:bookingId', isAuth, checkPermission('receptionist.checkout.process'), checkoutRules, validateFields, processCheckOutController)

module.exports = router