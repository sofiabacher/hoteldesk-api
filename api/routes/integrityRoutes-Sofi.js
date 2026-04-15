const router = require('express').Router()

const { getIntegrityReport, getIntegrityStatus, repairTableIntegrity, verifyRecordIntegrity, recalculateAllDVV } = require('../controller/integrityController')

const isAuth = require('../middlewares/isAuth')
const checkPermission = require('../middlewares/checkPermission')

//Endpoints para obtener reportes de integridad
router.get('/report', isAuth, checkPermission('admin.reports.view'), getIntegrityReport)  //Obtener reporte completo
router.get('/status', getIntegrityStatus)  //Comprobar estado de integridad rápido

//Endpoints calcular y verificar DVH
router.post('/repair/:tableName', isAuth, checkPermission('admin.reports.view'), repairTableIntegrity)   //Reparar DVH de tabla específica
router.get('/verify/:tableName/:id', verifyRecordIntegrity)  //Verificar el DVH de un registro específico

//Endpoints calcular DVV
router.post('/recalculate-all', isAuth, checkPermission('admin.reports.view'), recalculateAllDVV)  //Recalcular todos los DVV

module.exports = router