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

				/**
				 * This will return list of already added user IDs
				 * @return {[type]} [description]
				 */
				$scope.getIdList = function() {
					var list = {};
					for (var i in $scope.users)
						list[$scope.users[i]._id] = true;
					return list;
				};

				/**
				 * This will remove duplicit users
				 */
				$scope.filterUnique = function(users) {
					var list = $scope.getIdList();
					for (var i = 0; i < users.length; i++)
						list[users[i]._id] && users.splice(i--, 1);
					return users;
				};

				/**
				 * Search users for autocomplete
				 */
				$scope.search = function(s) {
					var params = {
						limit: 10,
						query: '*' + s + '*',
						type: 'user'
					};

					if (!s || !s.length)
						return;

					timer && $timeout.cancel(timer);

					// Search after while when user stops typing
					timer = $timeout(function() {
						User.getConnections(params, function(res) {
							$scope.userList = $scope.filterUnique(res.data);
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