
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

var http = require('http');
var path = require('path');
var inspect = require('util').inspect;

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// Handle 404
app.use(function(req, res) {
	
	res.send('404: Sorry! This page does not exist', 404);
});
  
// Handle 500
app.use(function(error, req, res, next) {
	console.error(error.stack);
	res.send('500: Internal Server Error', 500);
});


// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
