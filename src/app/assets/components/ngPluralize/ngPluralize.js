'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.ngPluralize
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('ngPluralize', function() {
	return {
		restrict: 'EA',
		priority: 1,
		transclude: 'element',
		link: function(scope, element, attrs, ctrl, transclude) {
			scope.$watch(attrs.when, function(when) {
				if (when) {
					transclude(function(clone) {
						element.replaceWith(clone);
						element = clone;
					});
				}
			});
		}
	};
});