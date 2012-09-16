
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
		scrape.updateTwitter(function(cb){
			res.send(cb, 200);
		})
	});
	// Use espn to get teams, update db
	// Each team, Use espn to get active players, update
	// From db: get every player without twitter; foreach tweeting-athletes, update everyone on the db list
		// Pull player page, get twitter name, update Player db entry
	// Use twitter to populate each tweet

}

exports.updateTweets = function(req, res){
	var scrape = require("../espn.js")
	scrape.updateTweets(function(cb){
		res.send(cb, 200)
	})
}
exports.setPolarity = function(req, res){
	var scrape = require("../espn.js")
	scrape.setPolarity(function(cb){
		res.send(cb, 200)
	})
}

exports.matchup = function(req, res){
	var team1 = req.query.team1
	var team2 = req.query.team2
	var Player = require('../models/player')
	Player.collection.distinct('team', function(err, teams){
		for (x in teams){
			console.log(teams[x])
			analyzeTeam(teams[x], function(teamAnalysis){

			})
		}
	})
	res.send("done", 200)

	// analyzeTeam(team1, function(team1Analysis){
	// 	analyzeTeam(team2, function(team2Analysis){
	// 		// Render a template to display the data
	// 		//res.render
	// 		res.send("It is doen", 200)
	// 	})
	// })

}

function analyzeTeam(teamName, cb){
	var teamAnalysis = {
		numTweets: 0,
		numPeople: 0,
	}
	var totalSentiment = 0;

	teamAnalysis.name = teamName
	var Player = require('../models/player')
	var Tweet = require('../models/tweet')
	var _ = require('underscore')

	var now = new Date().getTime()
	var oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000)
	var twoWeeksAgo = now - 2 * (7 * 24 * 60 * 60 * 1000)
	

	// Get the players for a team
	console.log("team", teamName)
	var patt = new RegExp('^' + teamName + '.*', 'i')
	Player.find({team: { $regex : patt }}).exec(function(err, players){
		if(err) console.log(err)
		console.log("found", players.length, "players")
		teamAnalysis.numPeople = players.length
		var screenNames = _.map(players, function(player){ return player.twitter.replace("https://twitter.com/", "")})
		// Get the tweets for each player
		Tweet.find({screen_name: { $in : screenNames } }).exec(function(err, tweets){
			if(err) console.log(err)
			console.log("found", tweets.length, "tweets")
			tweets = _.filter(tweets, function(tweet){
				var d = new Date(tweet.created_at).getTime()
				return (d < now && d > oneWeekAgo)
			})
			teamAnalysis.numTweets = tweets.length
			_.each(tweets, function(tweet){
				totalSentiment += tweet.polarity
			})
			teamAnalysis.polarity = totalSentiment / teamAnalysis.numTweets
			console.log(teamAnalysis)
			cb(teamAnalysis)
		})
	})
}
