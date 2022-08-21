const { body } = require('express-validator');

const registerValidator = [
	body('username')
		.isLength({ min: 3 })
		.withMessage('Username should be longer than 2 characters.'),
	body('password')
		.isLength({ min: 3 })
		.withMessage('Password is required to be longer than 3 characters.'),
	body('email').isEmail().withMessage('Please add a valid email address.'),
];

module.exports = registerValidator;
