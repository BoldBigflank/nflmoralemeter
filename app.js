
/**
 * Module dependencies.
 */

var express = require('express')
, mongoose = require('mongoose');

//mongoose.connect("mongo://localhost/hashtackle"); // Old and busted
mongoose.connect("mongodb://nodeuser:n0Tebowing@alex.mongohq.com:10099/hashtackle"); // New hotness


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "gotta want it more" }));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
var site = require('./routes/site');

app.get('/', site.index)

app.get('/game', site.game)

app.get('/update', site.update)
app.get('/updateTweets', site.updateTweets)
app.get('/setPolarity', site.setPolarity)
app.get('/matchup', site.matchup)


var port = process.env.PORT || 3000

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
