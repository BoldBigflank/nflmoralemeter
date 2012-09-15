var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Team = require('./team')


var GameSchema = new Schema({
	name : { type: String, default: null },
	date : { type: Date },
	acronym : { type: String, default: null },
	_teams : [{ type: Schema.ObjectId, ref: 'Team' }],
});

module.exports = mongoose.model('Game', Game);