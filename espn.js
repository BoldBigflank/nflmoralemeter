var key = "ch4qn8m6ufggcmp58wwjyavd";
var sharedSecret = "7dBCpV7J3n8W8s5cnP62UnBq";

var jsdom = require('jsdom')
, request = require('request')
, async = require('async')

var Player = require('./models/player')

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
        				console.log(team, "->", name);
        				var newPlayer = new Player({
        					name: name
        					, team: team
        					, link: link
        					, position: position
        				});
        				newPlayer.save(function(err){
        					if(err) console.log(err);
        				});
        			}
        		})
        	
            	cb("returned")
            })
	})
}

exports.updateTwitter = function(){
	Player.find( { 'twitter': null }).exec( function(err, doc){
		if(err) console.log(err)
		var players = doc
		async.forEach(players, function(player){
			var url = "http://http://www.tweeting-athletes.com/" + player.link
			request(url, function(error, request, body){

		})
		
		})
	} )

}