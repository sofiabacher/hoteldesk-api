const cron = require('node-cron')
const { exec } = require('child_process')
const { Op } = require('sequelize')
const mysqldump = require('mysqldump')

const { cancelUnpaidBookings } = require('./bookingService')

const Integrity = require('../models/Integrity')
const Log = require('../models/Log')
const fs = require('fs')
const path = require('path')


class SchedulerService {
    constructor() {
        this.tasks = new Map()
        this.isRunning = false
    }

    // Iniciar todas las tareas programadas
    start() {
        if (this.isRunning) {
            console.log('[SCHEDULER] El scheduler ya está en ejecución')
            return
        }

        console.log('[SCHEDULER] Iniciando scheduler de tareas automáticas...')
        this.isRunning = true

        this.scheduleInitialCheck()  // Verificación inicial

        // Programar tareas regulares
        this.scheduleHourlyTasks()
        this.scheduleDailyTasks()
        this.scheduleWeeklyTasks()
        this.scheduleMonthlyTasks()

        this.logSchedule()
        console.log('[SCHEDULER] Todas las tareas programadas exitosamente')
    }

    // Detener todas las tareas
    stop() {
        console.log('[SCHEDULER] Deteniendo scheduler...')

        this.tasks.forEach((task, name) => {
            task.stop()
            console.log(`[SCHEDULER] Tarea "${name}" detenida`)
        })

        this.tasks.clear()
        this.isRunning = false
        console.log('[SCHEDULER] Scheduler detenido completamente')
    }

    // 1. Verificación inicial al iniciar
    scheduleInitialCheck() {
        setTimeout(async () => {
            try {
                console.log('[SCHEDULER] [INIT] Verificación inicial de tareas pendientes...')
                await this.runBookingCancellation()
                console.log('[SCHEDULER] [INIT] Verificación inicial completada')

            } catch (error) {
                console.error('[SCHEDULER] [INIT] Error en verificación inicial:', error.message)
            }
        }, 3000)
    }

    // 2. Tareas horarias - Cancelación automática de reservas
    scheduleHourlyTasks() {
        const task = cron.schedule('0 * * * *', async () => {
            try {
                console.log('[SCHEDULER] [HOURLY] Ejecutando cancelación automática de reservas...')
                await this.runBookingCancellation()

            } catch (error) {
                console.error('[SCHEDULER] [HOURLY] Error en cancelación automática:', error.message)
            }
        })

        this.tasks.set('booking-cancellation', task)
    }

    // 3. Tareas diarias - Verificación de integridad
    scheduleDailyTasks() {
        const task = cron.schedule('0 2 * * *', async () => {
            try {
                console.log('[SCHEDULER] [DAILY] Verificando integridad de datos...')
                await this.runIntegrityCheck()

            } catch (error) {
                console.error('[SCHEDULER] [DAILY] Error en verificación de integridad:', error.message)
            }
        })

        this.tasks.set('integrity-check', task)
    }

    // 4. Tareas semanales - Backup de base de datos
    scheduleWeeklyTasks() {
        const task = cron.schedule('0 3 * * 0', async () => {
            try {
                console.log('[SCHEDULER] [WEEKLY] Creando backup automático...')
                await this.runDatabaseBackup()

            } catch (error) {
                console.error('[SCHEDULER] [WEEKLY] Error en backup automático:', error.message)
            }
        })

        this.tasks.set('database-backup', task)
    }

    // 5. Tareas mensuales - Limpieza de logs
    scheduleMonthlyTasks() {
        const task = cron.schedule('0 4 1 * *', async () => {
            try {
                console.log('[SCHEDULER] [MONTHLY] Limpiando logs antiguos...')
                await this.runLogCleanup()

            } catch (error) {
                console.error('[SCHEDULER] [MONTHLY] Error en limpieza de logs:', error.message)
            }
        })

        this.tasks.set('log-cleanup', task)
    }


    // Ejecutar cancelación de reservas
    async runBookingCancellation() {
        const result = await cancelUnpaidBookings()
        if (result.totalCancelled > 0) {
            console.log(`[SCHEDULER] Se cancelaron ${result.totalCancelled} reservas automáticamente`)
        }
        return result
    }

    // Ejecutar verificación de integridad
    async runIntegrityCheck() {
        const integrityResult = await Integrity.verifyAllTables()
        if (integrityResult.errors.length > 0) {
            console.log(`[SCHEDULER] Se encontraron ${integrityResult.errors.length} errores de integridad`)
            // TODO: Enviar email de alerta al administrador

        } else {
            console.log('[SCHEDULER] Verificación de integridad completada sin errores')
        }
        return integrityResult
    }

    // Ejecutar backup de base de datos
    async runDatabaseBackup() {
        try {
            console.log('[SCHEDULER] Iniciando backup de base de datos...')

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
            const backupDir = path.join(__dirname, '..', 'backups')
            const backupFile = path.join(backupDir, `backup_${timestamp}.sql`)

            // Crear directorio de backups si no existe
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true })
                console.log(`[SCHEDULER] Directorio de backups creado: ${backupDir}`)
            }

            // Variables de configuración
            const dbName = process.env.DB_NAME
            const dbUser = process.env.DB_USER
            const dbPass = process.env.DB_PASS
            const dbHost = process.env.DB_HOST || 'localhost'
            const dbPort = process.env.DB_PORT || 3306

            if (!dbName || !dbUser) { throw new Error('Variables de entorno de base de datos no configuradas') }
            console.log(`[SCHEDULER] Configuración BD: ${dbName}@${dbHost}:${dbPort}`)

            // Usar la librería mysqldump con configuración explícita
            console.log('[SCHEDULER] Iniciando mysqldump...')

            const result = await mysqldump({
                connection: {
                    host: dbHost,
                    user: dbUser,
                    password: dbPass,
                    database: dbName,
                    port: dbPort
                },

                dump: {
                    schema: {
                        table: {
                            dropIfExist: false
                        }
                    },

                    data: {
                        maxRowsPerInsertStatement: 100,
                        disableKeys: false
                    },

                    trigger: true
                },

                dumpToFile: backupFile
            })

            console.log('[SCHEDULER] mysqldump completado')

            // Verificar que el archivo se creó y no está vacío
            if (fs.existsSync(backupFile)) {
                const stats = fs.statSync(backupFile)

                if (stats.size === 0) { throw new Error('Archivo de backup creado pero está vacío') }

                console.log(`[SCHEDULER] ✅ Backup exitoso: ${backupFile} (${stats.size} bytes)`)

                await this.cleanupOldBackups(backupDir, 7)   // Limpiar backups antiguos (mantener solo los últimos 7)

                return {
                    success: true,
                    filePath: backupFile,
                    size: stats.size,
                    timestamp: timestamp
                }

            } else {
                throw new Error('No se pudo crear el archivo de backup')
            }

        } catch (error) {
            console.error(`[SCHEDULER] ❌ Error en backup: ${error.message}`)
            throw error
        }
    }

    // Limpiar backups antiguos
    async cleanupOldBackups(backupDir, keepCount) {
        try {
            const files = fs.readdirSync(backupDir)
                .filter(file => file.startsWith('backup_') && file.endsWith('.sql'))
                .map(file => ({
                    name: file,
                    path: path.join(backupDir, file),
                    stats: fs.statSync(path.join(backupDir, file))
                }))
                .sort((a, b) => b.stats.mtime - a.stats.mtime) // Más nuevos primero

            // Eliminar los más antiguos
            const filesToDelete = files.slice(keepCount)

            for (const file of filesToDelete) {
                fs.unlinkSync(file.path)
                console.log(`[SCHEDULER] Backup antiguo eliminado: ${file.name}`)
            }

            if (filesToDelete.length > 0) {
                console.log(`[SCHEDULER] Limpieza de backups: ${filesToDelete.length} archivos eliminados`)
            }
            
        } catch (error) {
            console.warn(`[SCHEDULER] Error limpiando backups antiguos: ${error.message}`)
        }
    }

    // Ejecutar limpieza de logs antiguos
    async runLogCleanup() {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - 90) // Eliminar logs de más de 90 días

        const deletedLogs = await Log.destroy({
            where: {
                createdAt: {
                    [Op.lt]: cutoffDate
                }
            }
        })

        const result = {
            success: true,
            deletedLogs: deletedLogs,
            cutoffDate: cutoffDate
        }

        console.log(`[SCHEDULER] Limpieza completada: ${deletedLogs} logs eliminados`)
        return result
    } 

    // Mostrar estado del scheduler
    logSchedule() {
        console.log('[SCHEDULER] Tareas programadas:')
        console.log('  • [HOURLY] 00:00 - Cancelación automática de reservas')
        console.log('  • [DAILY]  02:00 - Verificación de integridad de datos')
        console.log('  • [WEEKLY] 03:00 DOM - Backup automático de BD')
        console.log('  • [MONTHLY] 04:00 DIA1 - Limpieza de logs antiguos')
    }

    // Obtener estado de las tareas
    getStatus() {
        return { 
            isRunning: this.isRunning,
            activeTasks: Array.from(this.tasks.keys()),
            taskCount: this.tasks.size
        }
    }
}

module.exports = new SchedulerService()