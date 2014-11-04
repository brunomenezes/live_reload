angular.module('liveSearchApp')
.directive('imageSourceSet', function(){
	function link(scope, elem, args){		
		elem.attr('src', args.src);
	};
	return {link : link};
});