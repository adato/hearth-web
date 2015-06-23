'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbar
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbar', [
	'$anchorScroll', '$location', 'Filter', '$window',

	function($anchorScroll, $location, Filter, $window) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: 'templates/directives/filterbar.html',
			scope: true,
			link: function(scope) {
				scope.searchParams = '';

				angular.extend(scope, {
					filterSelected: false,
					newItemSelected: false
				});

				scope.cancelFilter = function() {
					Filter.reset();
				};
				
				scope.toggleNewItem = function() {
					if (!scope.filterSelected) {
						scope.newItemSelected = !scope.newItemSelected;
					}
				};

				scope.toggleFilter = function() {
					if (!scope.newItemSelected) {
						scope.filterSelected = !scope.filterSelected;
					}
				};

				scope.testFilterActive = function() {
					var paramString = $.param($location.search());
					scope.filterOn = !$.isEmptyObject($location.search());

					scope.searchParams = (paramString) ? '?'+paramString : '';
				};

				scope.$on('filterClose', function() {
					scope.filterSelected = false;
				});

				scope.$on('filterOpen', scope.toggleFilter);

				scope.$on('showUI', function($event, ui) {
					scope.filterSelected = ui === 'filter';
					scope.newItemSelected = ui === 'newAd';

					if (ui === 'map') {
						scope.mapSelected = true;
						scope.$broadcast(scope.mapSelected ? 'searchMap' : 'searchList');
						scope.$emit(scope.mapSelected ? 'searchMap' : 'searchList');
					}
					$anchorScroll(ui);
				});

				scope.$on('filterReseted', scope.testFilterActive);
				scope.$on('filterApplied', scope.testFilterActive);

				scope.$on('$stateChangeSuccess', function(ev, route, params) {
				});
				
				scope.testFilterActive();
			}
		};
	}
]);