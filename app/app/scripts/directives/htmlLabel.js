'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.htmlLabel
 * @description 
 * @restrict A
 */

angular.module('hearth.directives').directive('htmlLabel', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			attrs.$observe('html', function(value) {
				return element.html(value);
			});
			return element.bind('click', function(event) {
				if (event.target.nodeName.toLowerCase() === 'a') {
					event.preventDefault();
					return event.stopPropagation();
				}
			});
		}
	};
});