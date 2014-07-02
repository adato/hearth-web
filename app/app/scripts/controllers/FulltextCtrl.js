'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('FulltextCtrl', [
	'$scope', 'PostsService', '$routeParams',

	function($scope, PostsService, $routeParams) {
		var searchParams = {
			limit: $scope.limit,
			offset: $scope.offset,
			q: $routeParams.q
		};

		PostsService.query(searchParams).then(function(data) {
			$scope.items = data;
		});
	}
]);