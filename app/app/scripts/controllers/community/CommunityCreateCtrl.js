'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityCreateCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('CommunityCreateCtrl', [
	'$scope', '$window', 'CommunityService', 'ResponseErrors', '$location', '$timeout', 'ipCookie',
	function($scope, $window, CommunityService, ResponseErrors, $location, $timeout, ipCookie) {
		$scope.community = {};
		$scope.createCommunity = function() {
			if (!$scope.createCommunityForm.$invalid) {
				return CommunityService.add($scope.community).then(function() {
					return $timeout(function() {
						return $window.location.reload();
					});
				}, function(err) {
					$scope.errors = new ResponseErrors(err);
					return $scope.errors;
				});
			}
		};
		return $scope.createCommunity;
	}
]);