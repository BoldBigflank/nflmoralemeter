var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Player = require('./player')


var TeamSchema = new Schema({
	name : { type: String, default: null },
	acronym : { type: String, default: null },
	color1 : { type: String, required: false, index : { unique: true } },
	color2 : { type: String, required: false, in_session: false },
	players : [{ type: Schema.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Team', TeamSchema);