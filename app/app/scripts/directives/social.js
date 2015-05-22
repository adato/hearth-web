'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.social
 * @description Displays social networks links
 * @restrict E
 */
angular.module('hearth.directives').directive('social', [

	function() {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				item: '=',
				title: '=name',
				summary: '=',
				facebookInvite: '@'
			},
			templateUrl: 'templates/directives/social.html',
			link: function($scope) {
				$scope.url = "";

				$scope.$watch('item', function(value) {
					var title = encodeURIComponent(scope.title);
					var summary = encodeURIComponent(scope.summary);

				 	$scope.url = window.location.host+ $scope.config.baseUrl;
					alert("AA" + $scope.url);

					if (value) {
						$scope.url += '/post/' + value;
					}
					$scope.endpoints = $$config.sharingEndpoints;
				});
			}
		};
	}
]);