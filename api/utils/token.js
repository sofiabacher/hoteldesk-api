const jwt = require('jsonwebtoken')
const { jwt: jwtConfig } = require('../config')
const { getPrimaryRole } = require('./helpers/roles')

function generateLoginToken(user) {
    const roles = user.Roles || []
    const roleNames = roles.map(r => r.name)    //Extraer los nombres del rol
    const primaryRole = user.primaryRole || getPrimaryRole(roles)

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: roleNames,
            primaryRole
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    )
}

function verifySessionToken(token) {
    try {
        const decoded = jwt.verify(token, jwtConfig.secret)
        return { valid: true, payload: decoded }
        
    } catch (error) {
        return { valid: false, error: error.message }
    }
}

function generateToken(userId) {
    return jwt.sign(
        { userId },
        jwtConfig.tokenSecret,
        { expiresIn: jwtConfig.emailExpiresIn }
    )
} 

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, jwtConfig.tokenSecret)
        return { valid: true, payload: decoded }

    } catch (error) {
        return { valid: false, error: error.message }
    }
}

module.exports = {
    generateLoginToken,
    verifySessionToken,
    generateToken,
    verifyToken
}