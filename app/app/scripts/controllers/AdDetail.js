'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.AdDetail
 * @description
 */

angular.module('hearth.controllers').controller('AdDetail', [
	'$scope', 'AdDetailResource', '$routeParams',

	function($scope, AdDetailResource, $routeParams) {
		$scope.item = {};

		AdDetailResource.get({
			id: $routeParams.id
		}, function(data) {
			$scope.item = data;
			$scope.profile = data.author;
		});
	}
]);