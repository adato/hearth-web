'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.paginationMarker
 * @description element that marks infinite-scroll 'page' once it appears on screen
 * @restrict A
 */

angular.module('hearth.directives').directive('paginationMarker', ['$window', 'InfiniteScrollPagination', '$timeout',
	function($window, InfiniteScrollPagination, $timeout) {
		return {
			restrict: 'A',
			scope: {},
			link: function(scope, element, attrs) {
				// give it some time to draw itself so that
				// its top position is calculated correctly
				$timeout(function() {
					InfiniteScrollPagination.subscribe(element[0], attrs.paginationMarker);
				}, 50);
			}
		};
	}
]);