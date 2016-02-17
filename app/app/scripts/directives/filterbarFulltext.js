'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbarFulltext
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbarFulltext', [
	'$state', '$anchorScroll', '$location', 'Filter', '$window', '$rootScope', '$timeout', '$analytics', 'User',

	function($state, $anchorScroll, $location, Filter, $window, $rootScope, $timeout, $analytics, User) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: 'templates/directives/filterbarFulltext.html',
			scope: true,
			link: function(scope) {
				scope.filterType = $state.params.type;
				scope.searchParams = '';
				scope.basePath = $$config.basePath;

				scope.cancelFilter = function() {
					Filter.reset();
				};

				scope.toggleFilter = function() {
					scope.filterSelected = !scope.filterSelected;
				};

				scope.testFilterActive = function() {
					var paramString = Filter.getParams();
					scope.filterOn = Object.keys($location.search()).length > 1; // any other attribute except q=search_string ?
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