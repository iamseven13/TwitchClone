const express = require('express');
const router = express.Router();

const registerValidator = require('./express-body-validator/registerBody');
const loginValidator = require('./express-body-validator/loginBody');
const validateRequest = require('./express-body-validator/validationResult');

const userController = require('./controllers/userController');
const followController = require('./controllers/followController');
const auth = require('./middleware/auth');
const payments = require('./payments/payments');

const User = require('./models/User');

// @route POST api/register
// @desc  Register user
// @route Public
router.post(
	'/api/register',
	registerValidator,
	validateRequest,
	userController.registerUser
);

// @route POST api/login
// @desc  Login user & get token
// @route Public
router.post(
	'/api/login',
	loginValidator,
	validateRequest,
	userController.loginUser
);

// @route GET api/auth
// @desc  Send token, get user data
// @route Private
router.get('/api/auth', auth, userController.getDataFromToken);

// @route GET api/:username
// @desc  Get data based on url(param)
// @route Public
router.get('/api/:username', userController.getUsernameData);

// @route GET api/:username/isFollowing
// @desc  See if the profile user is following the logged in user (user in the header)
// @route Public
router.get(
	'/api/:username/isFollowing',
	userController.getUsernameDataForFollowing,
	auth,
	userController.sharedProfileData
);

// @route POST api/payment
// @desc  Pay for the subscription through stripe
// @route Private / only loggedIn users
router.post('/api/payment', auth, payments.stripePayment);

// @route POST api/create-key
// @desc  Update the key field on the db
// @route Private
router.post('/api/create-key', auth, userController.storeKey);

// @route GET api/users/getAll
// @desc  Get all users except the logged in one
// @route Private -> token
router.get('/api/users/getAll', userController.findAllUsers);

// @route GET api/users/recommendedUsers
// @desc  Get all users
// @route Public
router.get(
	'/api/users/recommendedUsers',
	auth,
	userController.recommendedUsers
);

// @route GET api/userGoesLive
// @desc  User goes live, update in DB.
// @route Private
router.put('/api/userGoesLive', auth, userController.userGoesLive);

// @route GET api/userStopLive
// @desc  User stop live, update in DB.
// @route Private
router.put('/api/userStopLive', auth, userController.userStopLive);

//Follow related routes

// @route GET api/addFollow/:username
// @desc  Follow a user
// @route Private
router.post('/api/addFollow/:username', auth, followController.addFollow);

// @route GET api/removeFollow/:username
// @desc  Unfollow a user
// @route Private
router.post('/api/removeFollow/:username', auth, followController.removeFollow);

// @route GET api/user:/Followers
// @desc  Get all user followers
// @route Private
router.get('/api/:username/following', auth, userController.userFollowing);

// Updating user password

// @route Put api/username:/updatePassword
// @desc  Update user password on db
// @route Private
router.put(
	'/api/:username/updatePassword',
	auth,
	userController.updatePassword
);

// Payment Related

// @route Put api/username:/subscribe
// @desc  Update subscription on db
// @route Private
router.post(
	'/api/:username/subscribe',
	auth,
	userController.subscribeToStreamer
);

// @route Put api/username:/Unsubscribe
// @desc   UnSubscription on db
// @route Private
router.post(
	'/api/:username/Unsubscribe',
	auth,
	userController.unSubscribeToStreamer
);

module.exports = router;
