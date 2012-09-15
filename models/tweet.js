var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	
var TweetSchema = new Schema({
	name : { type: String, default: null },
	text: { type: String, default: null },
	created: { type: String, default: null }
});

module.exports = mongoose.model('Tweet', TweetSchema);