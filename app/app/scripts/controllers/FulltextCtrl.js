'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('FulltextCtrl', [
	'$scope', '$routeParams', 'Fulltext',

	function($scope, $routeParams, Fulltext) {
		$scope.query = $routeParams.q;
		var params = {
			limit: 15,
			offset: $scope.offset,
			query: $routeParams.q
		};

		Fulltext.query(params, function(data) {
			$scope.items = data;
		});

	}
]);