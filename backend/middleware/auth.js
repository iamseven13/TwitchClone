const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
	// Get token from header
	const token = req.header('x-auth-token');

	// Check if no token
	if (!token) {
		return res.json({ msg: 'Not authorized' });
	}

	// verify token

	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		req.user = decoded.user;

		next();
	} catch (e) {
		res.json({ msg: 'Token is not valid' });
	}
};
