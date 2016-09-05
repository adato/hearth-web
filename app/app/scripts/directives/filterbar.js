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

					// Assuming that everything in $location.search is a filter is wrong
					// but we will do so nevertheless with the exception of removing known
					// filter unrelated params from there.
					var locSearch = $location.search();
					delete locSearch.page;
					delete locSearch[ScrollService.MARKETPLACE_SCROLL_TO_PARAM];

					scope.filterOn = !$.isEmptyObject(locSearch);
					scope.searchParams = (paramString) ? '?' + paramString : '';
				};

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