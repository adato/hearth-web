'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemDetailOld
 * @description Old path /ad/ will be redirected to /post/
 */

angular.module('hearth.controllers').controller('ItemDetailOld', [
	'$scope', '$stateParams', '$location',

	function($scope, $stateParams, $location) {
		$location.path("post/" + $stateParams.id);
	}
]);
