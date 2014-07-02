'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.ngEnter
 * @description
 * @restrict A
 */

angular.module('hearth.directives').directive('ngEnter', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind('keydown keypress', function(event) {
				if (event.which === 13) {
					scope.$apply(function() {
						scope.$eval(attrs.ngEnter, event);
					});
					event.preventDefault();
				}
			});
		}
	};
});