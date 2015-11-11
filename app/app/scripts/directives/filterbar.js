'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbar
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbar', [
	'$state', '$anchorScroll', '$location', 'Filter', '$window', '$rootScope', '$timeout', '$analytics', 'User',

	function($state, $anchorScroll, $location, Filter, $window, $rootScope, $timeout, $analytics, User) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: 'templates/directives/filterbar.html',
			scope: true,
			link: function(scope) {
				scope.filterType = $state.params.type;
				scope.searchParams = '';
				scope.basePath = $$config.basePath;

				/**
				 * Set cookie info that we have closed filter
				 * so we will not open him next time
				 */
				scope.setCookieFiltered = function() {
					if (scope.isCookieFiltered())
						return;

					$analytics.eventTrack('filter closed', {
						category: 'filter',
						label: 'filter was closed for the first time'
					});
				};

				scope.setUserFilterCookie = function() {
					if (!scope.isCookieFiltered() && $rootScope.user && $rootScope.user.closed_filter)
						$.cookie('closedFilter', +moment($rootScope.user.closed_filter), {
							expires: 30 * 12 * 20,
							path: '/'
						});

					scope.sendFilterClosedInfo();
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
					var paramString = Filter.getParams();
					scope.filterOn = !$.isEmptyObject($location.search());
					scope.searchParams = (paramString) ? '?' + paramString : '';
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

				scope.$on('filterReset', scope.cancelFilter);
				scope.$on('filterReseted', scope.testFilterActive);
				scope.$on('filterApplied', scope.testFilterActive);

				angular.extend(scope, {
					filterSelected: false
				});

				$timeout(function() {
					scope.setUserFilterCookie();
					if (!scope.isCookieFiltered())
						scope.filterSelected = true;
				});
				scope.testFilterActive();
			}
		};
	}
]);