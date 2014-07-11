'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('FulltextCtrl', [
	'$scope', '$routeParams', 'Fulltext', '$location',

	function($scope, $routeParams, Fulltext, $location) {

		var filterParams = {
			all: {},
			people: {
				related: 'user'
			},
			community: {
				related: 'community'
			},
			market: {

			}
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
			$location.search({
				q: $routeParams.q,
				filter: property
			});
		};

		$scope.$on('$routeUpdate', function() {
			$scope.items = [];
			$scope.load();
		});

		$scope.load = function() {
			var defaultParams = {
					limit: 15,
					offset: $scope.items.length,
					query: $routeParams.q
				},
				params = angular.copy(defaultParams);

			if ($location.search().filter) {
				$scope.filterProperty = $location.search().filter;
				params = $.extend(params, filterParams[$scope.filterProperty] || {});
			}

			Fulltext.query(params, function(response) {
				$scope.items = params.offset > 0 ? $scope.items.concat(response.data) : response.data;
				$scope.counters = $.extend({
					post: 0,
					community: 0,
					user: 0
				}, response.meta.counters);
				$scope.loaded = true;
			});
		};

		$scope.load();
	}
]);