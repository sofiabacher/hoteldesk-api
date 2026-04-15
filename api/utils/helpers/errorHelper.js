class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message)
        this.status = statusCode
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}

const createError = (message, statusCode) => new AppError(message, statusCode)

module.exports = { AppError, createError }