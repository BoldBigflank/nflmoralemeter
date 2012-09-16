var key = "ch4qn8m6ufggcmp58wwjyavd";
var sharedSecret = "7dBCpV7J3n8W8s5cnP62UnBq";

var jsdom = require('jsdom')
, request = require('request')
, async = require('async')
, _ = require('underscore')

var Player = require('./models/player')
var Tweet = require('./models/tweet')

exports.updateDatabase = function(cb){
	// http://api.espn.com/:version/:resource/:method?apikey=:yourkey
	var uri = "http://www.tweeting-athletes.com/index.cfm?CatID=2&People=1"
	request(uri, function(error, response, body){
		jsdom.env(response.body, [
                'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'
            ],
            function(errors, win){
            	var team = "default"
            	var $ = win.$
            	var everydiv = $(".center .size14, .center .person-box")
        		$.each(everydiv, function(div){
        			if($(this).attr('class') == 'size14'){ // new team
        				team = $(this).text().trim()
        			}
        			else if ($(this).attr('class') == 'person-box' ){
        				var name = $(this).find( ".name").text().trim()
        				var link = $(this).find( ".name > a").attr('href')
        				var position = $(this).find( ".group").text().trim()
        				var newPlayer = new Player({
        					name: name
        					, team: team
        					, link: link
        					, position: position
        				});
        				newPlayer.save();
        			}
        		})
        	
            	cb("returned")
            })
	})
}

exports.updateTwitter = function(cb){
	Player.find( { 'twitter': null }).exec( function(err, doc){
		if(err) console.log(err)
		var players = doc
		if(players.length > 0){
			async.forEachLimit(players, 10, function(player, callback){
				var url = "http://www.tweeting-athletes.com/" + player.link
				request(url, function(error, response, body){
					jsdom.env(response.body, [
			                'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'
			            ],
			            function(errors, win){
			            	var $ = win.$
			            	if(errors) console.log("Error", errors)
			            	console.log(player.name, $("a.twitter-follow-button").attr('href'))
			            	player.twitter = $("a.twitter-follow-button").attr('href')
			            	player.save()
			            	callback(null)
			            })
				})
			}, function(err){console.log("Done")})
		}
		
		cb("Set in motion")
	} )

}

exports.updateTweets = function (cb){
	var util = require('util'),
	    twitter = require('twitter');
	// Placemat
	// var twit = new twitter({
	//     consumer_key: 'uA06yZhNfwHv7ntaK9YAg',
	//     consumer_secret: 'rKezWLcbf1ysQ889phi12xCNft9yOmjKOVM8o4Xi24',
	//     access_token_key: '74100146-ZQOJaYeuublgGw1VtpyeSKCoJzJmpRnJivLCk4RI',
	//     access_token_secret: '9tzkMkj2PJpP9u5KDHo517TG9MpDEPajYkp5fVqDg8'
	// });
	// i.TV
	var twit = new twitter({
	    consumer_key: 'jCr6ZwTxs5UsvjB4EVktxQ',
	    consumer_secret: 'UgP49KU06PKka4Zhv3hf8uwMV1O5zvWD2Z4NVBGm4',
	    access_token_key: '22101689-2rnZu6xhEa4DeW1rww3ajB7OiHFyMoQXQR3Y7ZvA7',
	    access_token_secret: 'M0WQhGyVVIagzP8kktm7hSpGWYRZpBQUSLA4U2TAg'
	});


	// only one call per 24 seconds to keep from hitting the limit.
	// Get 150 people not updated
	Player.find({ last_updated:null }).exec(function(err, doc){
		if(err) return cb(err)
		var players = doc
		console.log(players.length, "people to update")
		if(players.length > 0){
			async.forEachLimit(players, 3, function(player, callback){
				// Get the twitter feed for that person
				var username = player.twitter.replace("https://twitter.com/", "")
				console.log(username)
				twit.get('/statuses/user_timeline.json', {screen_name: username, count:200 }, function(error, data) {
					if(error){
						console.log(util.inspect(error))
						callback(null)
					} else if (data.length > 0) {
						for (x in data){
							if(data[x] && data[x].user){
								var tweet = new Tweet( data[x] )
								tweet.screen_name = data[x].user.screen_name
								tweet.name = player.name
								tweet.save()
							}
						}
						player.last_updated = Date.now()
						player.save()
						callback(null)
					}
					else {
						console.log("No tweets", data)
						callback(null)
					}
				});
			}, function(err){console.log("done")})
		}
	})
	cb("As you wish")
}


exports.setPolarity = function(cb){
	var uri = "http://www.sentiment140.com/api/bulkClassifyJson"
	Tweet.find({polarity: null}).limit(1000).select('text').exec(function(err, tweets){
		var body = {data: tweets}
		//console.log(body)
		uri = "http://www.sentiment140.com/api/bulkClassifyJson"
		request.post({
			uri: uri,
			method: "POST",
			body: body,
			json: true

		}, function(error, response, body){
			var i = 0;
			_.each(tweets, function(tweet){
				var updatedTweet = _.find(response.body.data, function(tweetResponse){
					return tweet._id == tweetResponse._id
				})
				tweet.polarity = updatedTweet.polarity
				tweet.save()
				i++
				if(i%100 == 0) console.log(i)

			})
		})
		cb(null)
	})
}
