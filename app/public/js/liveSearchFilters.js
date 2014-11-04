angular.module('liveSearchApp')
.filter('limitedTo', function(){
	return function(input, limitedTo){
		limitedTo = limitedTo || 6;			
		result = input ? S(input).truncate(limitedTo).s : '';
		return {text:result};
	};
})
.filter('match', ['$timeout', function($timeout){	
	function Match(suggestion, searchTerm, shouldMatch) {		
		searchTerm = searchTerm || '';
		var startIndex = suggestion.indexOf(searchTerm);
		if(startIndex < 0)return '';	
		var endIndex = startIndex + searchTerm.length;		
		var result = shouldMatch ? suggestion.slice(startIndex, endIndex) : suggestion.slice(endIndex);
		return result;
	};
	return Match;
}])
.filter('matchList', function(){
	function CleanupListByTerm(list, searchTerm){
		return _.filter(list, function(obj){
			return (obj.suggestion.indexOf(searchTerm) != -1);
		});
	};
	return CleanupListByTerm;
});