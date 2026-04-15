const nodeMalier = require('nodemailer')
const { email } = require('.')

const transporter = nodeMalier.createTransport({
    host: email.host,
    port: email.port,
    secure: false,
    auth: {
        user: email.user,
        pass: email.password
    }
})

module.exports = transporter