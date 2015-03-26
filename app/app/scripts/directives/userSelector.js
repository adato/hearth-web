'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.userSelector
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('userSelector', [
	'$rootScope', '$q', 'Fulltext', '$timeout',
	function($rootScope, $q, Fulltext, $timeout) {
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
				$scope.userList = [];
				$scope.list = {
					users: $scope.users
				};
				$scope.$watch("users", function(val) {
					$scope.list.users = val;
				});
				$scope.$watch("list.users", function(val) {
					$scope.users = val;
				});

				$scope.search = function(s) {
				  	// var deferred = $q.defer();
					var params = {
						limit: 10,
						query: s,
						q: s,
						type: 'user'
					};

					if(!s || s.length < 2)
						return;

					Fulltext.query(params, function(res) {
						$scope.userList = res.data;
					});
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