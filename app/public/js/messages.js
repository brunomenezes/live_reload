angular.module('liveSearchApp')
.constant('messages', {
	search :{
		suggestions : 'Sugestões de busca'
	}, 
	find : {
		globo : 'buscar \'{{text}}\' na Globo.com &rsaquo;',
		web :'buscar \'{{text}}\' na Web &rsaquo;'
	}
})