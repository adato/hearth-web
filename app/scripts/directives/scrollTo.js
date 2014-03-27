'use strict';

angular.module('hearth.directives').directive('scrollTo', [
	'$location', '$anchorScroll',
	function($location, $anchorScroll) {
		return function(scope, element, attrs) {
			return element.bind('click', function(event) {
				var location;
				event.stopPropagation();
				location = attrs.scrollTo;
				$location.hash(location);
				return $anchorScroll();
			});
		};
	}
]);