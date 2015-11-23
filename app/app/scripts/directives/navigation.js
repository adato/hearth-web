'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.conversationAdd
 * @description
 * @restrict A
 */
angular.module('hearth.directives').directive('navigation', [
	'$rootScope', 'Auth', '$state', '$location',
	function($rootScope, Auth, $state, $location) {
		return {
			restrict: 'E',
			scope: true,
			replace: true,
			templateUrl: 'templates/directives/navigation.html',
			link: function($scope, element) {
				$scope.searchHidden = !$location.search().query;
				$scope.searchFilterDisplayed = false;

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
						console.log('WATCH');
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
