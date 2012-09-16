var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	
var TweetSchema = new Schema({
	screen_name : {type: String, default: null},
	id : {type: String, default: null},
	name : { type: String, default: null },
	text: { type: String, default: null },
	created_at: { type: String, default: null },
	polarity: {type: Number, default: null}
});

module.exports = mongoose.model('Tweet', TweetSchema);