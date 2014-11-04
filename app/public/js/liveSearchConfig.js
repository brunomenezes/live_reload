'use strict';
angular.module('liveSearchApp')
.value('config',{
	urlAPI:{
		url:'/api/search'
	}
})
.config(['$translateProvider','messages', function($translateProvider, messages){
	$translateProvider.translations('pt_BR',messages);	
	$translateProvider.preferredLanguage('pt_BR');
}]);