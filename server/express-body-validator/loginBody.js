const { body } = require('express-validator');

const loginValidator = [
	body('username')
		.isLength({ min: 3 })
		.withMessage('Username should be longer than 2 characters.'),
	body('password').exists().withMessage('Password is required.'),
];

module.exports = loginValidator;
