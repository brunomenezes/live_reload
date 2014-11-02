module.exports = function (word,type,fields){
	var _word = word;
	var _type = type;
	var _fields = fields ? fields : ['queries', 'queries.foldes', 'suggestion', 'suggestion.folded'];
	this.query = {};
	var that = this;
	this.multi_match = function(){
		that.query.multi_match = {type:_type, query:_word, fields:_fields};
		return {query:that.query};
	}
}