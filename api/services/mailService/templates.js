const signature = require("../../utils/helpers/mail")


function buildActivationEmail({ name, activationToken }) {  //Activación de cuenta (CU002)
    const body = `
        <p>Hola ${name},</p>
        <p>Gracias por registrarte en <strong>HotelDesk</strong>. Para activar tu cuenta, hacé clic en el siguiente enlace:</p>
        <p><a href="${activationToken}">Activar cuenta</a></p>
        <p>Este enlace expirará en 1 hora. Si no lo solicitaste, podés ignorar este mensaje.</p>
        <p>¡Esperamos verte pronto!</p>
    `
    return { subject: 'Activá tu cuenta en HotelDesk', html: signature(body) }
}

function buildRecoveryEmail({ name, recoveryToken }) {   //Recuperación de contraseña (CU003)
    const body = `
        <p>Hola ${name},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña en <strong>HotelDesk</strong>. Si fuiste vos, hacé clic en el siguiente enlace:</p>
        <p><a href="${recoveryToken}">Restablecer contraseña</a></p>
        <p>Este enlace expirará en 1 hora. Si no solicitaste este cambio, podés ignorar este mensaje.</p>
        <p>¡Gracias por confiar en nosotros!</p>
    `
    return { subject: 'Restablecé tu contraseña en HotelDesk', html: signature(body) }
}

function buildPasswordUpdateNotice({ name }) {   //Aviso de cambio de contraseña (CU004)
    const body = `
        <p>Hola ${name},</p>
        <p>Te informamos que tu contraseña fue modificada recientemente en <strong>HotelDesk</strong>.</p>
        <p>Si realizaste este cambio, no es necesario que hagas nada más.</p>
        <p>Si <strong>no fuiste vos</strong>, te recomendamos restablecer tu contraseña de inmediato y contactar con el soporte técnico.</p>
        <p>¡Gracias por confiar en nosotros!</p>
    `
    return { subject: 'Aviso: cambio de contraseña en HotelDesk', html: signature(body) }
}

function buildPaymentConfirmationEmail({ userName, confirmationCode, roomName, checkInDate, checkOutDate, guests, totalPrice }) {   //Confirmación de pago (CU014)
    const formattedCheckIn = new Date(checkInDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    const formattedCheckOut = new Date(checkOutDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

    const body = `
        <p>¡Hola ${userName}!</p>
        <p>¡Excelente noticia! Tu pago ha sido procesado exitosamente en <strong>HotelDesk</strong>.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #147550; margin-bottom: 15px;">🎉 Detalles de tu Reserva Confirmada</h3>
            <p><strong>Código de Confirmación:</strong> ${confirmationCode}</p>
            <p><strong>Habitación:</strong> ${roomName}</p>
            <p><strong>Check-in:</strong> ${formattedCheckIn}</p>
            <p><strong>Check-out:</strong> ${formattedCheckOut}</p>
            <p><strong>Huéspedes:</strong> ${guests}</p>
            <p><strong>Total Pagado:</strong> <span style="color: #28a745; font-weight: bold;">$${totalPrice}</span></p>
        </div>

        <p><strong>Estado:</strong> <span style="color: #28a745; font-weight: bold;">✅ Confirmada y Pagada</span></p>

        <p>Te recomendamos llegar al hotel el día del check-in a partir de las 15:00 hs. Si necesitas modificar tu reserva o tienes alguna pregunta, no dudes en contactarnos.</p>

        <p>¡Gracias por elegir HotelDesk! Esperamos que disfrutes tu estadía.</p>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <strong>HotelDesk</strong><br>
            Tu comfort es nuestra prioridad
        </p>
    `
    return { subject: '¡Pago Confirmado! - Detalles de tu Reserva en HotelDesk', html: signature(body) }
}

function buildCancellationEmail({ userName, confirmationCode, roomName, checkInDate, checkOutDate, guests, totalPrice }) {   //Cancelación de reserva (CU012)
    const formattedCheckIn = new Date(checkInDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    const formattedCheckOut = new Date(checkOutDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

    const body = `
        <p>¡Hola ${userName}!</p>
        <p>Te confirmamos que tu reserva en <strong>HotelDesk</strong> ha sido cancelada exitosamente.</p>

        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
            <h3 style="color: #856404; margin-bottom: 15px;">📋 Detalles de la Reserva Cancelada</h3>
            <p><strong>Código de Reserva:</strong> ${confirmationCode}</p>
            <p><strong>Habitación:</strong> ${roomName}</p>
            <p><strong>Check-in:</strong> ${formattedCheckIn}</p>
            <p><strong>Check-out:</strong> ${formattedCheckOut}</p>
            <p><strong>Huéspedes:</strong> ${guests}</p>
            <p><strong>Total de la reserva:</strong> <span style="color: #dc3545; font-weight: bold;">$${totalPrice}</span></p>
        </div>

        <p><strong>Estado:</strong> <span style="color: #dc3545; font-weight: bold;">❌ Cancelada</span></p>

        <p>La habitación ha sido liberada y está nuevamente disponible para otras reservas.</p>

        <p>Te esperamos nuevamente en HotelDesk para tu próxima estadía.</p>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <strong>HotelDesk</strong><br>
            Tu comfort es nuestra prioridad
        </p>
    `
    return { subject: 'Reserva Cancelada - HotelDesk', html: signature(body) }
}

module.exports = {
    buildActivationEmail,
    buildRecoveryEmail,
    buildPasswordUpdateNotice,
    buildPaymentConfirmationEmail,
    buildCancellationEmail
}