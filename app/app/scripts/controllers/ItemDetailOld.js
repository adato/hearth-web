'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemDetailOld
 * @description Old path /ad/ will be redirected to /post/
 */

angular.module('hearth.controllers').controller('ItemDetailOld', [
	'$scope', '$routeParams', '$location',

	function($scope, $routeParams, $location) {
		$location.path("post/"+$routeParams.id);
	}
]);
