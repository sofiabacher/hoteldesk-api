const transporter = require('../../config/mail.js')
const logger = require('../../utils/logger.js')

const { cors, email } = require('../../config/index.js')
const { buildActivationEmail, buildRecoveryEmail, buildPasswordUpdateNotice, buildPaymentConfirmationEmail, buildCancellationEmail } = require('./templates.js')

const { LOG_ACTIONS } = require('../../utils/constants.js')
const { register, recovery, update, payment, booking: bookingMessages } = require('../../utils/messages.js')


async function sendActivationEmail(user, token) {  //Mail de activación de cuenta (CU002)
    const activationToken = `${cors.origin}/activate?token=${token}`
    const { subject, html } = buildActivationEmail({ name: user.name, activationToken })

    try {
        await transporter.sendMail({ from: email.from, to: user.email, subject, html })
        
        await logger(
            user.id,
            LOG_ACTIONS.ACCOUNT_ACTIVATION.message,
            `${register.activationEmailSent} a ${user.email}`,
            LOG_ACTIONS.ACCOUNT_ACTIVATION.criticity
        )

    } catch (error) {
        await logger(
            user.id, 
            LOG_ACTIONS.MAIL_ERROR.message, 
            `${register.errors.activationMailFailed} a ${user.email}: ${error.message}`, 
            LOG_ACTIONS.MAIL_ERROR.criticity 
        )
    }
}

async function sendRecoveryEmail(user, token) {  //Mail recuperación de contraseña (CU003)
    const recoveryToken = `${cors.origin}/reset-password?token=${token}`
    const { subject, html } = buildRecoveryEmail({ name: user.name, recoveryToken })

    try {
        await transporter.sendMail({  from: email.from, to: user.email, subject,  html })
        
        await logger(
            user.id,
            LOG_ACTIONS.PASSWORD_RECOVERY.message,
            `${recovery.recoveryEmailSent} a ${user.email}`,
            LOG_ACTIONS.PASSWORD_RECOVERY.criticity
        )

    } catch (error) {
        await logger(
            user.id, 
            LOG_ACTIONS.MAIL_ERROR.message, 
            `${recovery.errors.recoveryMailFailed} a ${user.email}: ${error.message}`, 
            LOG_ACTIONS.MAIL_ERROR.criticity 
        )
    }
}

async function sendPasswordUpdateNotice(user) {  //Mail de aviso de modificación de contraseña (CU004)
    const { subject, html } = buildPasswordUpdateNotice({ name: user.name })

    try {
        await transporter.sendMail({ from: email.from, to: user.email, subject, html })
        
        await logger(
            user.id,
            LOG_ACTIONS.PASSWORD_CHANGE.message,
            `${update.updateEmailSent} a ${user.email}`,
            LOG_ACTIONS.PASSWORD_CHANGE.criticity
        )

    } catch (error) {
        await logger(
            user.id, 
            LOG_ACTIONS.MAIL_ERROR.message, 
            `${update.errors.updatePasswordMailFailed} a ${user.email}: ${error.message}`, 
            LOG_ACTIONS.MAIL_ERROR.criticity 
        )
    }
}

async function sendPaymentConfirmationEmail(userEmail, bookingDetails) {  //Mail de confirmación de pago (CU0014)
    const { subject, html } = buildPaymentConfirmationEmail(bookingDetails)

    try {
        await transporter.sendMail({ from: email.from, to: userEmail, subject, html })

        await logger(
            bookingDetails.userId || null,
            LOG_ACTIONS.PAYMENT_EMAIL_SENT.message,
            `${payment.paymentConfirmationEmailSent} a ${userEmail} - Reserva: ${bookingDetails.confirmationCode}`,
            LOG_ACTIONS.PAYMENT_EMAIL_SENT.criticity
        )

    } catch (error) {
        await logger(
            bookingDetails.userId || null,
            LOG_ACTIONS.MAIL_ERROR.message,
            `${payment.errors.paymentConfirmationEmailFailed} a ${userEmail} - Reserva: ${bookingDetails.confirmationCode}: ${error.message}`,
            LOG_ACTIONS.MAIL_ERROR.criticity
        )
    }
}

async function sendCancellationEmail(userEmail, bookingDetails) {   //Mail de cancelación de reserva (cu012)
    const { subject, html } = buildCancellationEmail(bookingDetails)

    try {
        await transporter.sendMail({ from: email.from, to: userEmail, subject, html })

        await logger(
            bookingDetails.userId || null,
            LOG_ACTIONS.BOOKING_CANCELLED.message,
            `${bookingMessages.emailCancelledSent} a ${userEmail} - Reserva: ${bookingDetails.confirmationCode}`,
            LOG_ACTIONS.BOOKING_CANCELLED.criticity
        )

    } catch (error) {
        await logger(
            bookingDetails.userId || null,
            LOG_ACTIONS.MAIL_ERROR.message,
            `${bookingMessages.errors.emailCancelled} a ${userEmail} - Reserva: ${bookingDetails.confirmationCode}: ${error.message}`,
            LOG_ACTIONS.MAIL_ERROR.criticity
        )
    }
}

module.exports = {
    sendActivationEmail,
    sendRecoveryEmail,
    sendPasswordUpdateNotice,
    sendPaymentConfirmationEmail,
    sendCancellationEmail
}
