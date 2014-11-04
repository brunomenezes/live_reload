var request = require('request');
var Q = require('q');
var config = require('../conf/properties');
var ElasticsearchSettings = require('../conf/ElasticsearchSettings');
var request = require('request');
var S = require('string');
var _ = require('lodash');
var es= require('elasticsearch');
var client = new es.Client();
var QueryObj = require('../objects/QueryObj');

module.exports = new function(){
	var request_config = {
		url:config.data_url,
		headers:{'User-Agent':'request'}	
	}
	var that = this, _json;	
	var deferred = Q.defer();


	this.createIndex = function(){
		client.indices.exists({index:'conteudo'}, function(err,res,statusCode){			
			if(res){				
			}else {
				client.indices.create({index:'conteudo', body:ElasticsearchSettings});
			}
		});		
		return that;
	}

	this.loadData = function(){		
		request(request_config ,function(error,res,body){
			if(error){ 
				deferred.reject(error); 
			}
			//para fim desse exemplo caso o github esteja com algum problema irei carregar o mock.
			var result = res.statusCode!=200 ? _decode(JSON.stringify(require(__dirname+'/DataMock'))) : _decode(body);			
			deferred.resolve(JSON.parse(result));
		});
		that._promise = deferred.promise;
		return that;
	};

	this.feedElasticsearch = function(){		
		that._promise.then(function(json){
			var body = [];
			var hightlights = json.hightlights;
			var suggestions = json.suggestions;
			_.each(hightlights, function(obj, index){			
				body.push({index:{_type:'hightlights', _index:'conteudo', _id:'HIGHT-'+index}});
				body.push(obj);
			});

			_.each(suggestions, function(phrase, index){
				body.push({index:{_index:'conteudo', _type:'suggestions', _id:'SUGG-'+index}});
				body.push({'suggestion':phrase});
			});
			//executa inserção em lote no elasticsearch.
			client.bulk({body:body});			
		}, function(err){
			console.error(err.message);	
		}).done();
	}

	this.searchBy = function(word){
		var defer = Q.defer();
		var multiMatchQuery = new QueryObj(word,'phrase_prefix').multi_match();
		client.search({
			index:'conteudo',
			body:multiMatchQuery			
		}, function(e,r){
			if(e)
				defer.reject(e.message);			
			else
				defer.resolve(_.map(r.hits.hits , function(obj){ return {type:obj._type, source:obj._source};}));
		});
		return defer.promise;
	}

	var _decode = function(string){
		return S(string).decodeHTMLEntities().s;
	}
}