'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.conversationAdd
 * @description
 * @restrict A
 */
angular.module('hearth.directives').directive('navigation', [
	'$rootScope', 'Auth', '$state', '$location', '$analytics', 'ConversationAux',
	function($rootScope, Auth, $state, $location, $analytics, ConversationAux) {
		return {
			restrict: 'E',
			scope: true,
			replace: true,
			templateUrl: 'assets/components/navigation/navigation.html',
			link: function($scope, element) {
				$scope.searchHidden = !$location.search().query;
				// $scope.searchFilterDisplayed = false;
				$scope.getFirstConversationId = ConversationAux.getFirstConversationIdIfAny;
				$scope.searchQuery = {
					query: $location.search().query || ''
				};
				$scope.basePath = $$config.basePath;

				$scope.closeFilter = function() {
					$(document).off("click", $scope.closeFilter);
				};
				
				$scope.isFilterActive = function(filter) {
					return $scope.searchQuery.type == filter;
				};
			}

		};
	}
]);