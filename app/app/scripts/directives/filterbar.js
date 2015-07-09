'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbar
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbar', [
	'$anchorScroll', '$location', 'Filter', '$window', '$rootScope', '$timeout', '$analytics',

	function($anchorScroll, $location, Filter, $window, $rootScope, $timeout, $analytics) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: 'templates/directives/filterbar.html',
			scope: true,
			link: function(scope) {
				scope.searchParams = '';
				scope.basePath = $$config.basePath;

				/**
				 * Set cookie info that we have closed filter
				 * so we will not open him next time
				 */
				scope.setCookieFiltered = function() {
					if(scope.isCookieFiltered())
						return;

					$analytics.eventTrack('filter closed', {
						category: 'filter',
						label: 'filter was closed for the first time'
					});

					$.cookie('closedFilter', Date.now(), { expires: 30 * 12 * 20, path: '/' });
				};

				scope.isCookieFiltered = function() {
					return !!$.cookie('closedFilter');
				};

				scope.cancelFilter = function() {
					Filter.reset();
				};
				
				scope.toggleFilter = function() {
					scope.setCookieFiltered();
					scope.filterSelected = !scope.filterSelected;
				};

				scope.testFilterActive = function() {
					var paramString = $.param($location.search());
					scope.filterOn = !$.isEmptyObject($location.search());

					scope.searchParams = (paramString) ? '?'+paramString : '';
				};

				scope.$on('filterClose', function() {
					scope.setCookieFiltered();
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

				angular.extend(scope, {
					filterSelected: false
				});

				$timeout(function() {
					if(!scope.isCookieFiltered())
						scope.filterSelected = true;
				});
				scope.testFilterActive();
			}
		};
	}
]);