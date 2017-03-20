'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbar
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbar', [
	'$state', '$location', 'Filter',

	function($state, $location, Filter) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: 'assets/components/filterbar/filterbar.html',
			scope: true,
			link: function(scope) {
				scope.filterType = $state.params.type;
				scope.searchParams = '';

				scope.cancelFilter = function() {
					Filter.reset();
				};

				scope.toggleFilter = function() {
					scope.filterSelected = !scope.filterSelected;
				};

				scope.testFilterActive = function() {
					var paramString = Filter.getParams();

					scope.filterOn = Filter.isSet();
					scope.searchParams = (paramString) ? '?' + paramString : '';
				};

				scope.$on('filterClose', function() {
					scope.filterSelected = false;
				});

				scope.$on('filterOpen', scope.toggleFilter);

				scope.$on('filterReset', scope.cancelFilter);
				scope.$on('filterReseted', scope.testFilterActive);
				scope.$on('filterApplied', scope.testFilterActive);

				angular.extend(scope, {
					filterSelected: false
				});

				scope.testFilterActive();
			}
		};
	}
]);
