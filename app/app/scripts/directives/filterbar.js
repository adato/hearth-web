'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbar
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbar', [
	'$anchorScroll', '$location', 'Filter', '$window', '$rootScope', '$timeout', '$analytics', 'User',

	function($anchorScroll, $location, Filter, $window, $rootScope, $timeout, $analytics, User) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: 'templates/directives/filterbar.html',
			scope: true,
			link: function(scope) {
				scope.searchParams = '';
				scope.basePath = $$config.basePath;

				scope.sendFilterStatusOnApi = function() {
					if($.cookie('closedFilterSent') || !$rootScope.loggedUser._id)
						return false; // filter close date was already sent or user is not logged in
					
					User.setClosedFilter({time: moment(parseInt($.cookie('closedFilter'))).format()}, angular.noop, angular.noop);
					$.cookie('closedFilterSent', Date.now(), {expires: 30 * 12 * 20, path: '/' });
				};

				/**
				 * Set cookie info that we have closed filter
				 * so we will not open him next time
				 */
				scope.sendFilterClosedInfo = function() {
					if(scope.wasClosedFilterSent())
						return;

					$.cookie('closedFilterSent', Date.now(), { expires: 30 * 12 * 20, path: '/' });
				};

				scope.wasClosedFilterSent = function() {
					return !!$.cookie('closedFilterSent');
				};

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
					scope.sendFilterStatusOnApi();
				};

				scope.setUserFilterCookie = function() {
					if(!scope.isCookieFiltered() && $rootScope.user && $rootScope.user.closed_filter)
						$.cookie('closedFilter', +moment($rootScope.user.closed_filter), { expires: 30 * 12 * 20, path: '/' });

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
					scope.setUserFilterCookie();
					if(!scope.isCookieFiltered())
						scope.filterSelected = true;
				});
				scope.testFilterActive();
				scope.sendFilterStatusOnApi();
			}
		};
	}
]);