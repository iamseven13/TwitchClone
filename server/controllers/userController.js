const User = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Follow = require('../models/Follow');
const ObjectId = mongoose.Types.ObjectId;
const FollowSchema = require('../models/FollowSchema');

exports.registerUser = async function (req, res) {
	const { username, email, password } = req.body;

	try {
		// See if user exists
		let user = await User.findOne({
			$or: [{ username: username }, { email: email }],
		});

		if (user) {
			return res.json({ msg: 'User already exists' });
		} else {
			// Get users gravatar
			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			});

			// Create an user instance
			user = new User({
				username,
				email,
				avatar,
				password,
				streamKey: '',
				isVerified: false,
				isLive: false,
			});

			// Encrypt the password using bcrypt
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();

			// Return jsonwebtoken
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: '60555s',
				},
				(err, token) => {
					if (err) throw err;
					res.json({
						token,
						username: user.username,
						email: user.email,
						avatar: user.avatar,
						date: user.date,
						id: user._id,
					});
				}
			);
		}
	} catch (e) {
		console.log(e.message);
		res.status(500).send('Server error');
	}
};

exports.loginUser = async function (req, res) {
	const { username, password } = req.body;

	try {
		// See if user exists
		let user = await User.findOne({
			username,
		});

		if (!user) {
			return res.json({ msg: 'Invalid user/password' });
		} else {
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.json({ msg: 'Invalid user/password' });
			}

			// Return jsonwebtoken
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: '60555s',
				},
				(err, token) => {
					if (err) throw err;
					res.json({
						token,
						username: user.username,
						email: user.email,
						avatar: user.avatar,
						date: user.date,
						id: user._id,
						streamKey: user.streamKey,
					});
				}
			);
		}
	} catch (e) {
		console.log(e.message);
		res.send('Server error');
	}
};

exports.getDataFromToken = async function (req, res) {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json({ user });
	} catch (e) {
		res.send('server error');
	}
};

exports.storeKey = async function (req, res) {
	const { loggedInUser, randomId } = req.body;
	try {
		const user = await User.updateOne(
			{ username: loggedInUser },
			{
				streamKey: randomId,
			}
		);

		if (user) {
			return res.json(
				'Succesfully created a stream key. Do not share with anyone else!'
			);
		} else {
			return res.json('there was an error. please try again later');
		}
	} catch (e) {
		return res.json('server error');
	}
};

exports.findAllUsers = async function (req, res) {
	try {
		User.find({}, function (err, users) {
			let userMap = {};

			users.forEach(function (user) {
				userMap[user._id] = user;
			});

			const arrayData = Object.values(userMap);

			return res.json(arrayData);
		}).select('-password -streamKey');
	} catch (e) {
		console.log(e.message);
	}
};
exports.userFollowing = async function (req, res) {
	try {
		let followers = await Follow.getFollowersById(req.user.id);

		return res.json(followers);
	} catch (error) {
		console.log('there was an error');
	}
};

exports.recommendedUsers = async function (req, res) {
	// all following users in an array
	const { followingUsers } = req.body;

	try {
		let followers = await FollowSchema.aggregate([
			{
				$match: {
					authorId: ObjectId(req.user.id),
				},
			},

			{
				$lookup: {
					from: 'users',
					localField: 'followedId',
					foreignField: '_id',
					as: 'userDoc',
				},
			},
			{
				$project: {
					username: { $arrayElemAt: ['$userDoc.username', 0] },
					avatar: { $arrayElemAt: ['$userDoc.avatar', 0] },
				},
			},
		]);

		followers = followers.map(function (follower) {
			return { username: follower.username, avatar: follower.avatar };
		});

		if (followers) {
			let allFollowing = [];
			let following = followers.forEach((follow) =>
				allFollowing.push(follow.username)
			);
			console.log(allFollowing);

			try {
				const user = User.find(
					{
						_id: { $ne: req.user.id },

						username: {
							$nin: allFollowing,
						},
					},
					function (err, users) {
						let userMap = {};
						users.forEach(function (user) {
							userMap[user._id] = user;
						});

						const arrayData = Object.values(userMap);

						return res.json(userMap);
					}
				).select('-password -streamKey');
			} catch (e) {
				console.log(e.message);
			}
		}
	} catch (e) {
		console.log(e.message);
	}
};

exports.userGoesLive = function (req, res) {
	console.log(req.body);
	const id = req.user.id;

	User.findByIdAndUpdate(
		id,
		{
			new: true,
		},
		function (err, user) {
			if (!err) {
				user.isLive = true;
				user.streamGame = req.body.streamGame;
				user.streamTitle = req.body.streamTitle;
				user.save(function (err) {
					if (err) throw err;
					return res.json(user);
				});
			}
		}
	);
};

exports.userStopLive = function (req, res) {
	console.log(req.user);
	const id = req.user.id;

	User.findByIdAndUpdate(
		id,
		{
			new: true,
		},
		function (err, user) {
			if (!err) {
				user.isLive = false;
				user.save(function (err) {
					if (err) throw err;
					return res.json(user);
				});
			}
		}
	);
};

exports.ifUserExists = function (req, res, next) {
	next();
};

exports.getUsernameData = async function (req, res, next) {
	try {
		const user = await User.findOne({ username: req.params.username }).select(
			'-password'
		);

		if (user == null) {
			return res.json({ msg: 'User does not exist' });
		} else {
			//
			req.profileData = user._id;

			res.json({ user });
		}
		next();
	} catch (e) {
		return res.json('server error');
	}
};

exports.getUsernameDataForFollowing = async function (req, res, next) {
	try {
		const user = await User.findOne({ username: req.params.username }).select(
			'-password -streamKey'
		);

		if (user == null) {
			return res.json({ msg: 'User does not exist' });
		} else {
			//
			req.profileData = user._id;
		}
		next();
	} catch (e) {
		return res.json('server error');
	}
};

exports.sharedProfileData = async function (req, res, next) {
	let isFollowing = false;

	if (req.user) {
		isFollowing = await Follow.isVisitorFollowing(req.user, req.profileData);
	}
	req.isFollowing = isFollowing;
	res.json(req.isFollowing);
};

exports.updatePassword = async function (req, res) {
	// cleanUp data before looking up in the User model
	console.log(req.user);

	const { oldPassword, newPassword, confirmNewPassword } = req.body;
	if (newPassword === confirmNewPassword) {
		finalNewPassword = newPassword;
	} else {
		console.log('Both new passwords must be the same!');
	}
	// return res.json(finalNewPassword);

	// Check if the user exists in the db by using the token id

	const user = await User.findOne({ _id: req.user.id });
	console.log(user);
	if (!user) {
		return res.json({ msg: 'There was a problem. Please try later.' });
	} else {
		const isMatch = await bcrypt.compare(oldPassword, user.password);

		if (!isMatch) {
			return res.json({ msg: 'Unauthorized Access' });
		} else {
			const salt = await bcrypt.genSalt(10);
			finalHashedPassword = await bcrypt.hash(finalNewPassword, salt);
			user.password = finalHashedPassword;
			user.save();
			return res.json({ msg: 'Password is successfully updated.' });
		}
	}
};

exports.subscribeToStreamer = async function (req, res) {
	console.log(req.user);
	const { streamer } = req.body;
	console.log(streamer);

	const loggedInUser = await User.findById({
		_id: ObjectId(req.user.id),
	}).select('-password');

	const user = await User.findOne({ username: streamer }).select('-password');
	if (!user) {
		return res.json({ msg: 'There was a problem. Please try again later.' });
	} else {
		// user.subscribers.unshift({ user: req.user.id });

		if (!user.subscribers.includes(loggedInUser.username)) {
			user.subscribers.push(loggedInUser.username);

			user.save();
			return res.json({ msg: `Successfully subscribed to ${streamer}` });
		} else {
			return res.json({ msg: 'There was a problem. Please try again later.' });
		}
	}
};

exports.unSubscribeToStreamer = async function (req, res) {
	const { streamer } = req.body;
	console.log(streamer);

	Array.prototype.removeByValue = function (value) {
		for (let i = 0; i < this.length; i++) {
			if (this[i] === value) {
				this.splice(i, 1);
				i--;
			}
		}
		return this;
	};

	const loggedInUser = await User.findById({
		_id: ObjectId(req.user.id),
	}).select('-password');

	const user = await User.findOne({ username: streamer }).select('-password');
	if (!user) {
		return res.json({ msg: 'There was a problem. Please try again later.' });
	} else {
		// user.subscribers.unshift({ user: req.user.id });

		if (user.subscribers.includes(loggedInUser.username)) {
			user.subscribers.removeByValue(loggedInUser.username);

			user.save();
			return res.json({ msg: `Successfully Unsubscribed to ${streamer}` });
		} else {
			return res.json({ msg: 'There was a problem. Please try again later.' });
		}
	}
};
