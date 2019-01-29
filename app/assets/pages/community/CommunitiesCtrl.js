'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityListCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunitiesCtrl', [
	'$scope', 'Auth', '$rootScope',
	function($scope, Auth, $rootScope) {

		$scope.$on('$stateChangeSuccess', function(ev, route, params) {
			$scope.pageSegment = route.name;
		})


	}
])