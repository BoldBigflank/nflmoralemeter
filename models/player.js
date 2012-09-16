var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Tweet = require('./tweet')

var PlayerSchema = new Schema({
	name : { type: String, default: null },
	team : { type: String, default: null },
	position: { type: String, default: null },
	link: { type: String, default: null, unique: true },
	twitter: { type: String, default: null },
	last_updated: {type: Date, default: null}
});

module.exports = mongoose.model('Player', PlayerSchema);