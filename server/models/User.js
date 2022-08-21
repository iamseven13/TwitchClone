const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	streamKey: {
		type: String,
	},
	isVerified: {
		type: Boolean,
	},
	isLive: {
		type: Boolean,
	},
	subscribers: [],
	streamGame: {
		type: String,
	},
	streamTitle: {
		type: String,
	},
	followers: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users',
			},
			username: {
				type: String,
				required: true,
			},
			avatar: {
				type: String,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
	following: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users',
			},
			username: {
				type: String,
				required: true,
			},
			avatar: {
				type: String,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

module.exports = User = mongoose.model('user', UserSchema);
