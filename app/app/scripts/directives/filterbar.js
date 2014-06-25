'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbar
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbar', [

	function() {
		return {
			restrict: 'E',

			templateUrl: 'templates/filterbar.html',
			link: function(scope) {
				angular.extend(scope, {
					mapSelected: false,
					filterSelected: false
				});

				scope.toggleFilter = function() {
					scope.filterSelected = !scope.filterSelected;
					scope.$broadcast('toogleFilters');
				};

				scope.toggleMap = function() {
					scope.mapSelected = !scope.mapSelected;
					scope.$emit(scope.mapSelected ? 'searchMap' : 'searchList');
				};
			}
		};
	}
]);