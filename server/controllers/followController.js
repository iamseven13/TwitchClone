const Follow = require('../models/Follow');
const User = require('../models/User');
const FollowSchema = require('../models/FollowSchema');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.addFollow = function (req, res) {
	let follow = new Follow(req.params.username, req.user.id);
	follow
		.create()
		.then(() => {
			res.json({ success: `Successfully followed ${req.params.username}` });
		})
		.catch((errors) => {
			errors.forEach((error) => {
				res.json({ msg: error });
			});
		});
};

exports.removeFollow = function (req, res) {
	let follow = new Follow(req.params.username, req.user.id);
	follow
		.delete()
		.then(() => {
			res.json({ success: `Successfully unfollowed ${req.params.username}` });
		})
		.catch((errors) => {
			errors.forEach((error) => {
				res.json({ msg: error });
			});
		});
};
