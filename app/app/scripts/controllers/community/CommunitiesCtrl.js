'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityListCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('CommunitiesCtrl', [
	'$scope', '$rootScope', 'CommunityMemberships', 'Community', 'UnauthReload',
	function($scope, $rootScope, CommunityMemberships, Community, UnauthReload) {
		$scope.loaded = false;
		$scope.loadedFirstBatch = false;
		// my communities are loaded already in BaseCtrl for top navigation

		$scope.$on('$stateChangeSuccess', function(ev, route, params) {
			$scope.pageSegment = route.name;
		});

		$scope.toggleForm = function() {
			$(".community-list-add-button").slideToggle();
			$(".community-list-add-form").toggle();
		};


		UnauthReload.check();
	}
]);