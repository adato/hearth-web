'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbar
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbar', [
	'$state', '$anchorScroll', '$location', 'Filter', '$window', '$rootScope', '$timeout', '$analytics', 'User', 'ScrollService',

	function($state, $anchorScroll, $location, Filter, $window, $rootScope, $timeout, $analytics, User, ScrollService) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: 'templates/directives/filterbar.html',
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
					var locSearch = $location.search();

					scope.filterOn = anyFiltersSet(locSearch);
					scope.searchParams = (paramString) ? '?' + paramString : '';
				};

				function anyFiltersSet(loc) {
					var l = JSON.parse(JSON.stringify(loc));
					delete l.page;
					delete l.postdetail;
					for (var prop in l) {
						if (l.hasOwnProperty(prop)) return true;
					}
					return false;
				}

				scope.$on('filterClose', function() {
					scope.filterSelected = false;
				});

				scope.$on('filterOpen', scope.toggleFilter);

				scope.$on('showUI', function($event, ui) {
					scope.filterSelected = ui === 'filter';

					if (ui === 'map') {
						scope.mapSelected = true;
						scope.$broadcast(scope.mapSelected ? 'searchMap' : 'searchList');
						scope.$emit(scope.mapSelected ? 'searchMap' : 'searchList');
					}
					$anchorScroll(ui);
				});

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