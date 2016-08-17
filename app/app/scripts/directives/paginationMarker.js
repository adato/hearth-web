'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.paginationMarker
 * @description element that changes the infinite-scroll 'page' once it appears on screen
 * @restrict A
 */

angular.module('hearth.directives').directive('paginationMarker', [
	function() {
		return {
			restrict: 'A',
			scope: {},
			link: function(scope, element, attrs) {
				console.log('PAGE', attrs);
			}
		};
	}
]);