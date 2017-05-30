'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityListCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunitiesCtrl', [
	'$scope', '$rootScope', '$state',
	function($scope, $rootScope, $state) {
    // $rootScope.myCommunities is not set yet. How to resolve it?
    // var state = $rootScope.myCommunities.length ? 'communities.my': 'communities.suggested';
    // $state.go(state);

		$scope.loaded = false;
		$scope.loadedFirstBatch = false;

		$scope.$on('$stateChangeSuccess', function(ev, route, params) {
			$scope.pageSegment = route.name;
		});

		$scope.toggleForm = function(event) {
			$('[community-form-toggler]').slideToggle();
			$('[community-list-add-focusser]').toggle();
			$('[community-list-add-focusser]').removeClass('hide');
		};

	}
]);
