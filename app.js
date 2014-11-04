var express = require('express');
var app = express();
var parser_json = require('body-parser').json();
var infraService = require(__dirname+'/app/service/ESInfraHandler');

app.set('views', 'app/views');
app.set('view engine', 'jade');
app.use(express.static('app/public'));
infraService.createIndex().loadData().feedElasticsearch();

app.route('/').get(function(req, res){	
	res.render('index');
});

app.post('/api/search', parser_json ,function(req,res){	
	if(!req.is('json')) return res.sendStatus(400);
	var jsonData = req.body;	
	infraService.searchBy(jsonData.word)
	.then(function(searchResult){		
		res.json(searchResult);
	}, function(reason){
		console.error(reason);
	}).done();	
});

module.exports = app;