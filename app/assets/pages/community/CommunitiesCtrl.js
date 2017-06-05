'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityListCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunitiesCtrl', [
	'$scope',
	function($scope) {
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
