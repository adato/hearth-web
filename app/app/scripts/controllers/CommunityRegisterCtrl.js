'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityRegisterCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('CommunityRegisterCtrl', [
	'$scope', '$window', 'CommunityService', 'ResponseErrors', '$location', '$timeout', 'ipCookie',
	function($scope, $window, CommunityService, ResponseErrors, $location, $timeout, ipCookie) {
		$scope.community = {};
		$scope.createCommunity = function() {
			if (!$scope.createCommunityForm.$invalid) {
				return CommunityService.add($scope.community).then(function() {
					ipCookie('newCommunityCreated', true);
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