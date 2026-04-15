const { body } = require('express-validator')
const { validation: validationMessages } = require('../utils/messages')

const updateRules = [
    body('name').optional().trim().isString().notEmpty().withMessage(validationMessages.nameRequired),
    body('lastName').optional().trim().isString().notEmpty().withMessage(validationMessages.lastNameRequired),

    body('phone').optional().isString().isLength( { min: 6 }).withMessage(validationMessages.phoneLength),
    
    body('birthDate').optional().isISO8601().withMessage(validationMessages.dateFormatInvalid),

    body('dni').optional().isNumeric().isLength({ min: 7, max: 10 }).withMessage(validationMessages.dniLength),

    body('photo').optional().isString().withMessage(validationMessages.photoInvalid),
]

const changePasswordRules = [
    body('newPassword')
        .exists({ checkFalsy: true }).withMessage(validationMessages.passwordRequired)
        .isLength({ min: 8 }).withMessage(validationMessages.passwordLength)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/).withMessage(validationMessages.passwordInvalid),
    ,

    body('confirmPassword').custom((value, { req }) => {
        if (!value) throw new Error(validationMessages.confirmPasswordRequired)
        if (value !== req.body.newPassword)
            throw new Error(validationMessages.passwordMismatch) 
        return true
    })
]

const switchRoleRules = [
  body('roleId')
    .notEmpty().withMessage(validationMessages.roleRequired)
    .isNumeric().withMessage(validationMessages.roleInvalid)
    .toInt()
]


module.exports = {
    updateRules,
    changePasswordRules,
    switchRoleRules
}