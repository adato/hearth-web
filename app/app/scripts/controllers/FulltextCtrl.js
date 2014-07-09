'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('FulltextCtrl', [
	'$scope', '$routeParams', 'Fulltext', '$location',

	function($scope, $routeParams, Fulltext, $location) {
		var params = {
			limit: 15,
			offset: 0,
			query: $routeParams.q
		};

		angular.extend($scope, {
			queryText: $routeParams.q,
			items: [],
			filterProperty: 'all'
		});

		$scope.setFilter = function(property) {
			$scope.filterProperty = property;
			$scope.search(params);
		};
		$scope.search = function(params, addItems) {
			Fulltext.query(params, function(data) {
				$scope.items = addItems ? $scope.items.concat(data) : data;
			});
		};

		$scope.loadMore = function() {
			params.offset = $scope.items.length;
			$scope.search(params, true);
		};
		$scope.search(params);
	}
]);