'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.filterStatus
 * @description Displays filter status in bar
 * @restrict E
 */
angular.module('hearth.directives').directive('filterStatus', [
	'$location',
	function($location) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'templates/directives/filterStatus.html',
			link: function(scope) {
				scope.$on('$routeUpdate', function() {
					var searchParams = $location.search();
					scope.filterData = !$.isEmptyObject(searchParams) ? searchParams : undefined;
				});

			}

		};
	}
]);