'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('FulltextCtrl', [
	'$scope', '$routeParams', 'Fulltext',

	function($scope, $routeParams, Fulltext) {
		var params = {
			limit: 15,
			offset: 0,
			query: $routeParams.q,
		};

		angular.extend($scope, {
			queryText: $routeParams.q,
			items: [],
			counters: {
				post: 0,
				community: 0,
				user: 0
			},
			filterProperty: 'all'
		});

		$scope.setFilter = function(property) {
			$scope.filterProperty = property;
			$scope.search(params);
		};
		$scope.search = function(params, addItems) {
			var result = Fulltext.query(params, function(response) {
				$scope.items = addItems ? $scope.items.concat(response.data) : response.data;
				$scope.counters = $.extend({
					post: 0,
					community: 0,
					user: 0
				}, response.meta.counters);
				$scope.loaded = true;
			});
		};

		$scope.loadMore = function() {
			params.offset = $scope.items.length;
			$scope.search(params, true);
		};
		$scope.search(params);
	}
]);