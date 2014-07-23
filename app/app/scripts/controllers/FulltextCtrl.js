'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('FulltextCtrl', [
	'$scope', '$routeParams', 'Fulltext', '$location', 'LanguageSwitch',

	function($scope, $routeParams, Fulltext, $location, LanguageSwitch) {
		$scope.languageCode = LanguageSwitch.uses().code;

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

		$scope.setFilter = function(filter) {
			var params = {
				q: $routeParams.q,
				type: filter
			};

			if (params.type === 'all') {
				delete params.type;
			}
			$location.search(params);
		};

		$scope.$on('$routeUpdate', function() {
			$scope.items = [];
			$scope.load();
		});

		$scope.load = function() {
			var params = {
				offset: $scope.items.length,
				query: $routeParams.q
			};

			$scope.queryText = $routeParams.q;
			$scope.loaded = false;

			if ($location.search().type) {
				params = $.extend(params, $location.search() || {});
			}
			$scope.selectedFilter = $location.search().type || 'all';

			Fulltext.query(params, function(response) {
				var i, item, data = response.data;

				for (i = 0; i < data.length; i++) {
					item = data[i];
					if (item.author && item.author.avatar.normal) {
						data[i].avatarStyle = {
							'background-image': 'url(' + item.author.avatar.normal + ')'
						};
					}
					if (item.avatar && item.avatar.normal) {
						data[i].avatarStyle = {
							'background-image': 'url(' + item.avatar.normal + ')'
						};
					}
				}

				$scope.items = params.offset > 0 ? $scope.items.concat(data) : data;
				$scope.loaded = true;
			});

			Fulltext.stats({
				query: $routeParams.q
			}, function(response) {
				$scope.counters = $.extend({
					post: 0,
					community: 0,
					user: 0
				}, response.counters);
			});

		};

		$scope.load();
	}
]);