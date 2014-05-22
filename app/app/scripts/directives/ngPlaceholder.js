'use strict';
/**
 * @ngdoc directive
 * @name ngPlaceholder
 * @description solves IE placeholder issue - it is set placeholder in IE it removes all other data from form model
 * @restrict A
 */
angular.module('hearth.directives').directive('ngPlaceholder', [
	'$translate',
	function($translate) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				if (!navigator.userAgent.match(/Trident/)) {
						//you don't deserve this beautiful feature, ugly IE
						element.attr('placeholder', $translate(attrs.ngPlaceholder));
					}
				}
			}
		};
	}
]);