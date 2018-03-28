var http = require('http')

exports.index = function(req, res){
	res.header('Cache-Control', 'no-transform');
  res.render('index', {});
};
	
