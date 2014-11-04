'use strict';
angular.module('liveSearchApp', ['pascalprecht.translate'])
.controller('searchController',['$scope', '$http', 'config', '$timeout', function($scope, $http, config, $timeout){	
	$scope.search = {value:undefined};
	$scope.$watch('search.value', function(newVal){
		$timeout.cancel($scope.promise);
		$scope.sanitized = encodeURIComponent((newVal ? newVal : ''));
		if(newVal){
			$scope.promise = $timeout(function(){
				var word = newVal;
				$http.post(config.urlAPI.url,{word:word})
				.then(function(res){
					$scope.feedLists(res.data);
				});
			},900);	
		}else {
			$scope.resetLists();
		}	
	});

	$scope.feedLists = function(data){
		$scope.suggestions = _.pluck(_.where(data, {type:'suggestions'}), 'source');
		$scope.highlights = _.pluck(_.where(data, {type:'hightlights'}), 'source');		
	};

	$scope.resetLists = function(){
		$scope.suggestions = [];
		$scope.highlights = [];
	};
}]);