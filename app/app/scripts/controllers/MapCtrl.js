'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MapCtrl
 * @description
 */

angular.module('hearth.controllers').controller('MapCtrl', [
	'$scope', 'Post', '$location',

	function($scope, Post, $location) {

		$scope.$on('searchList', function() {
			$location.path('/');
		});
	}
]);