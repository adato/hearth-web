'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.conversationAdd
 * @description
 * @restrict A
 */
angular.module('hearth.directives').directive('navigation', [
	'$rootScope', 'Auth', '$state', '$location', '$analytics',
	function($rootScope, Auth, $state, $location, $analytics) {
		return {
			restrict: 'E',
			scope: true,
			replace: true,
			templateUrl: 'templates/directives/navigation.html',
			link: function($scope, element) {
				$scope.searchHidden = !$location.search().q;
				$scope.searchFilterDisplayed = false;
				$scope.searchQuery = {
					query: $location.search().query
				};

				$scope.mixpanelTrack = function(item) {
					$analytics.eventTrack('Community clicked', {
						Id: item._id,
						name: item.name,
						context: $state.current.name
					});
				};

				$scope.closeFilter = function() {
					$(document).off("click", $scope.closeFilter);
					$(document).unbind("keyup", $scope.watchFilterKey);
					$scope.$apply(function() {
						$scope.searchFilterDisplayed = false;
					});
				};

				$scope.watchFilterKey = function(e) {
					if (e.keyCode == 13 || e.keyCode == 27) {
						$scope.closeFilter();
					}
				};

				$scope.toggleSearchFilter = function() {

					$scope.searchFilterDisplayed = !$scope.searchFilterDisplayed;

					if ($scope.searchFilterDisplayed) {
						setTimeout(function() {
							$(document).on('click', $scope.closeFilter);
							$(document).keyup($scope.watchFilterKey);

						});
					}
				};

				$scope.selectSearchFilter = function(filter) {
					$scope.searchFilterDisplayed = false;
					$scope.searchQuery.type = filter;

					if ($scope.searchQuery.query)
						$scope.search($scope.searchQuery);
				};

				$scope.isFilterActive = function(filter) {
					return $scope.searchQuery.type == filter;
				};
			}

		};
	}
]);