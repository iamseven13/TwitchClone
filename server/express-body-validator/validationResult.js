const { validationResult } = require('express-validator');
const { NextFunction, Request, Response } = require('express');

const validateRequest = (Request, Response, NextFunction) => {
	const errors = validationResult(Request);

	if (!errors.isEmpty()) {
		return Response.json({ errors: errors.array() });
	}
	NextFunction();
};

module.exports = validateRequest;
