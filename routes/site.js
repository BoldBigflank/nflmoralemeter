
exports.index = function(req, res){
	// List upcoming games
	// Get upcoming games from espn api


	res.render('index', { title: 'Express', games: ["array of games"] })
};

exports.game = function(req, res){
	// Get game info
	var gameId = req.query.gameId;
	var Game = require('../models/game')
	Game.findOneById(gameId, function(err, doc){
		if(err) res.send({error: 'Game not found'}, 400)
		res.render('game', { title: 'Game', game: {'game object':true}  })
	})
	
}