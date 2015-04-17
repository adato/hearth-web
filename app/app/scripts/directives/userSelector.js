'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.userSelector
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('userSelector', [
	'$rootScope', '$q', 'User', '$timeout',
	function($rootScope, $q, User, $timeout) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				users: '=',
				ngDisabled: '=',
				ngBlur: '&',
				ngFocus: '&'
			},
			templateUrl: 'templates/directives/userSelector.html',
			link: function($scope, baseElement) {
				var timer = null;
				$scope.userList = [];
				$scope.list = {
					users: $scope.users
				};
				$scope.$watch("users", function(val) {
					$scope.list.users = val;
				});
				$scope.$watch("list.users", function(val) {
					$scope.users = val;
					$scope.userList = [];
					baseElement.find(".select2-drop").addClass("select2-display-none");
				});

				$scope.search = function(s) {
					var params = {
						limit: 10,
						query: s,
						q: s,
						type: 'user'
					};

					if(!s || s.length < 2)
						return;

					if(timer)
						$timeout.cancel(timer);

					// Search after while when user stops typing
					timer = $timeout(function() {
						User.getConnections(params, function(res) {
							$scope.userList = res.data;
						});
					}, 200);
				};

				$timeout(function() {
					var input = baseElement.find('input');

					input.bind('blur', function() {
					 	$scope.ngBlur && $scope.ngBlur();
					});
					input.bind('focus', function() {
				 		$scope.ngFocus && $scope.ngFocus();
					});
				});
			}
		};
	}
]);