
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

exports.update = function(req, res){
	var scrape = require('../espn.js')
	scrape.updateDatabase(function(cb){
		res.send(cb, 200);
	});
	// Use espn to get teams, update db
	// Each team, Use espn to get active players, update
	// From db: get every player without twitter; foreach tweeting-athletes, update everyone on the db list
		// Pull player page, get twitter name, update Player db entry
	// Use twitter to populate each tweet

}