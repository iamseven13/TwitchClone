const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = new mongoose.Schema({
	followedId: {
		type: Schema.Types.ObjectId,
	},
	authorId: {
		type: Schema.Types.ObjectId,
	},
});

module.exports = FollowSchemaModel = mongoose.model('followers', FollowSchema);
