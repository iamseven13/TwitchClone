const User = require('../models/User');
const FollowSchema = require('../models/FollowSchema');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let Follow = function (followedUsername, authorId) {
	console.log(followedUsername);
	console.log(authorId);
	this.followedUsername = followedUsername;
	this.authorId = authorId;
	this.errors = [];
};

Follow.prototype.cleanUp = function () {
	if (typeof this.followedUsername != 'string') {
		this.followedUsername = '';
	}
};

Follow.prototype.validate = async function (action) {
	// followedUsername must exist in database
	let followedAccount = await User.findOne({ username: this.followedUsername });
	if (followedAccount) {
		this.followedUsername = followedAccount._id;
	} else {
		this.errors.push('Username does not exist ');
	}

	let doesFollowAlreadyExist = await FollowSchema.findOne({
		followedId: this.followedUsername,
		authorId: new ObjectId(this.authorId),
	});

	if (action == 'create') {
		if (doesFollowAlreadyExist) {
			this.errors.push('You are already following this user.');
		}
	}

	if (action == 'delete') {
		if (!doesFollowAlreadyExist) {
			this.errors.push(
				'You cannot stop following someone you do not already follow'
			);
		}
	}
};

Follow.prototype.create = async function () {
	return new Promise(async (resolve, reject) => {
		this.cleanUp();
		await this.validate('create');
		if (!this.errors.length) {
			const follow = new FollowSchema({
				followedId: this.followedUsername,
				authorId: new ObjectId(this.authorId),
			});
			follow.save();
			resolve();
		} else {
			reject(this.errors);
		}
	});
};

Follow.isVisitorFollowing = async function (authorId, followedUsername) {
	let followDoc = await FollowSchema.findOne({
		followedId: ObjectId(followedUsername),
		authorId: ObjectId(authorId),
	});

	if (followDoc) {
		return true;
	} else {
		return false;
	}
};

Follow.prototype.delete = async function () {
	return new Promise(async (resolve, reject) => {
		this.cleanUp();
		await this.validate('delete');
		if (!this.errors.length) {
			const follow = await FollowSchema.deleteOne({
				followedId: this.followedUsername,
				authorId: ObjectId(this.authorId),
			});

			resolve();
		} else {
			reject(this.errors);
		}
	});
};

Follow.getFollowersById = async function (id) {
	return new Promise(async (resolve, reject) => {
		try {
			let followers = await FollowSchema.aggregate([
				{
					$match: {
						authorId: ObjectId(id),
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
						isLive: { $arrayElemAt: ['$userDoc.isLive', 0] },
					},
				},
			]);

			followers = followers.map(function (follower) {
				return {
					username: follower.username,
					avatar: follower.avatar,
					isLive: follower.isLive,
				};
			});

			resolve(followers);
		} catch (e) {
			reject();
		}
	});
};

module.exports = Follow;
