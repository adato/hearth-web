'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.userSelector
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('userSelector', [
	'$rootScope', '$q', 'Fulltext',
	function($rootScope, $q, Fulltext) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				users: '=',
				ngDisabled: '=',
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
						// deferred.resolve(res.data);
					});
					// return deferred.promise;
				};
			}
		};
	}
]);