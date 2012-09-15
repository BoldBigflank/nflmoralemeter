var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Tweet = require('./tweet')

var PlayerSchema = new Schema({
	name : { type: String, default: null, unique: true },
	team : { type: String, default: null },
	position: { type: String, default: null },
	link: { type: String, default: null },
	twitter: { type: String, default: null },
	tweets : [{ type: Schema.ObjectId, ref: 'Tweet' }]
});

module.exports = mongoose.model('Player', PlayerSchema);