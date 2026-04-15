const { body } = require('express-validator')
const { validation: validationMessages } = require('../utils/messages')

const loginRules = [
    body('email')
        .trim()  //Elimina espacios, tabulaciones y saltos de línea al incio y al final
        .notEmpty().withMessage(validationMessages.emailRequired)  //No debe estar vacío
        .isEmail().withMessage(validationMessages.emailInvalid),  //Formato válido

    body('password')
        .notEmpty().withMessage(validationMessages.passwordRequired)
]

const registerRules = [
    body('name').trim().isString().notEmpty().withMessage(validationMessages.nameRequired),
    body('lastName').trim().isString().notEmpty().withMessage(validationMessages.lastNameRequired),

    body('email')
        .trim()
        .notEmpty().withMessage(validationMessages.emailRequired)
        .isEmail().withMessage(validationMessages.emailInvalid),

    body('password')
        .notEmpty().withMessage(validationMessages.passwordRequired)
        .isLength({ min: 8 }).withMessage(validationMessages.passwordLength)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/).withMessage(validationMessages.passwordInvalid)
]

const recoverRules = [
    body('email')
        .trim()
        .notEmpty().withMessage(validationMessages.emailRequired)
        .isEmail().withMessage(validationMessages.emailInvalid),
]

const resetRules = [
    body('token').notEmpty().withMessage(validationMessages.tokenRequired),

    body('password')
        .notEmpty().withMessage(validationMessages.passwordRequired)
        .isLength({ min: 8 }).withMessage(validationMessages.passwordLength)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/).withMessage(validationMessages.passwordInvalid),

    body('confirmPassword')
        .notEmpty().withMessage(validationMessages.confirmPasswordRequired)
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(validationMessages.passwordMismatch);
            }
            return true 
        })
]

module.exports = {
    loginRules,
    registerRules,
    recoverRules,
    resetRules
}