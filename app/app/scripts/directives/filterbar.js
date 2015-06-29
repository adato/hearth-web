'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbar
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbar', [
	'$anchorScroll', '$location', 'Filter', '$window', '$rootScope',

	function($anchorScroll, $location, Filter, $window, $rootScope) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: 'templates/directives/filterbar.html',
			scope: true,
			link: function(scope) {
				scope.searchParams = '';
				scope.basePath = $$config.basePath;

				angular.extend(scope, {
					filterSelected: false,
				});

				scope.cancelFilter = function() {
					Filter.reset();
				};
				
				scope.toggleFilter = function() {
					scope.filterSelected = !scope.filterSelected;
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

					if (ui === 'map') {
						scope.mapSelected = true;
						scope.$broadcast(scope.mapSelected ? 'searchMap' : 'searchList');
						scope.$emit(scope.mapSelected ? 'searchMap' : 'searchList');
					}
					$anchorScroll(ui);
				});

				scope.$on('filterReseted', scope.testFilterActive);
				scope.$on('filterApplied', scope.testFilterActive);

				scope.testFilterActive();
			}
		};
	}
]);