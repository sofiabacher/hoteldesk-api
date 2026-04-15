const { body, param } = require('express-validator')
const { validation: validationMessages } = require('../utils/messages')

const adminUserRules = [
    body('userStateId')
        .optional()
        .isInt({ min: 1, max: 4 })
        .withMessage(validationMessages.userStateInvalid),

    body('action')
        .optional()
        .isIn(['block', 'unblock', 'delete'])
        .withMessage(validationMessages.actionInvalid)
]
  
const userIdRules = [
    param('userId')
        .isInt({ min: 1 })
        .withMessage(validationMessages.userIdInvalid)
]

const searchUsersRules = [
    body('searchTerm')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage(validationMessages.searchTermInvalid),

    body('searchType')
        .optional()
        .isIn(['name', 'email', 'all'])
        .withMessage(validationMessages.searchTypeInvalid)
]

module.exports = {
    adminUserRules,
    userIdRules,
    searchUsersRules
}