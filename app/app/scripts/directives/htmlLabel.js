'use strict';

angular.module('hearth.directives').directive('htmlLabel', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			attrs.$observe('html', function(value) {
				return element.html(value);
			});
			return element.bind('click', function(event) {
				if (event.target.nodeName.toLowerCase() === 'a') {
					$('#terms').foundation('reveal', 'open');
					event.preventDefault();
					return event.stopPropagation();
				}
			});
		}
	};
});