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
	res.send(JSON.stringify(req.body, null, '\t') + '\n');
});

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Live Search app at http://%s:%s',host, port);
});


// curl -XGET 'http://localhost:9200/conteudo/_search?pretty' -d '{"query": {"bool": {"should": [{ "match": { "queries": {"query" : "pol", "type":"phrase_prefix", "max_expansions":5}} },{ "match": { "suggestion": {"query":"pol", "type":"phrase_prefix", "max_expansions":5}}}]}}}'

// curl -XGET 'http://localhost:9200/conteudo/_search?pretty' -d '{"query":{"match_phrase_prefix":{"suggestion":{"query":"pol","max_expansions":5},"queries":{"query":"pol","max_expansions":5}}}}'

// '{"query":{"more_like_this" : {"fields" : ["queries", "suggestion"],"like_text" : "musica","min_term_freq" : 1,"max_query_terms" : 12}}}'

// '{"query":{"multi_match" : {"query":"a?ecio", "fields": [ "queries", "suggestion"]}}}'


//curl -XGET 'http://localhost:9200/conteudo/_search?pretty' -d '{"query": {"filtered": {"filter": {"bool": {"should": [{"query":{"match_phrase_prefix":{"suggestion":{ "query":"pol","max_expansions":5}}}},{"query":{"match_phrase_prefix":{"queries":{ "query":"pol","max_expansions":5}}}}]}}}}}'

// curl -XGET 'http://localhost:9200/conteudo/_search?pretty' -d '{"query":{"multi_match":{"type": "phrase_prefix","query":"polí","fields": ["queries", "queries.folded", "suggestion", "suggestion.folded"]}}}'
