'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('FulltextCtrl', [
	'$scope', '$timeout', '$stateParams', 'Fulltext', '$location', 'LanguageSwitch', '$translate', '$rootScope',

	function($scope, $timeout, $stateParams, Fulltext, $location, LanguageSwitch, $translate, $rootScope) {
		var deleteOffset = false;
		$scope.readedAllData = false;

		$scope.$on('$destroy', function() {
			$scope.topArrowText.top = '';
			$scope.topArrowText.bottom = '';
		});

		angular.extend($scope, {
			queryText: $stateParams.query || '',
			items: [],
			filterProperty: 'all'
		});

		$scope.processData = function(params) {
			return function(response) {
				var i, item, data = response.data;
				$scope.totalCounter = response.total;

				// if there is no more results (no items or smaller items then limit), stop lazy loading for next events
				if (data.length < params.limit)
					$scope.readedAllData = true;

				$("#fulltextSearchResults").removeClass("searchInProgress");

				data.forEach(function(item, i) {
					data[i].item_type = item._type;

					if (item._type == 'Post') {
						data[i].avatar = item.author.avatar;
						data[i].item_type = item.author._type;
					};
				});

				$scope.items = params.offset > 0 ? $scope.items.concat(data) : data;

				$scope.topArrowText.bottom = $translate.instant('TOTAL_COUNT', {
					value: response.total
				});
				$scope.topArrowText.top = $translate.instant('ads-has-been-read', {
					value: $scope.items.length
				});

				$timeout(function() {
					$scope.loaded = true;
				});
			}
		};

		$scope.load = function(addOffset) {
			var params = $.extend({
				limit: 15,
				offset: (addOffset) ? $scope.items.length : 0
			}, $location.search() || {});

			if (!params.query || params.query === '') {
				// dont search empty query and redirect to marketplace
				$location.path('/');
			}

			$rootScope.setFulltextSearch($stateParams.query);

			// if there is no more result data, dont load
			if ($scope.readedAllData) {
				return false;
			}

			if (deleteOffset) {

				delete params.offset;
				deleteOffset = false;
			}

			$scope.loaded = false;
			$scope.queryText = params.query;
			$scope.selectedFilter = $location.search().type || 'all';

			$("#fulltextSearchResults").addClass("searchInProgress");
			Fulltext.query(params, $scope.processData(params));
		};

		$scope.reload = function(text) {
			$scope.readedAllData = false;
			$scope.offset = 0;
			$scope.load();
		};

		$scope.init = function() {
			$scope.languageCode = $rootScope.language;
			$scope.load();

			$scope.$on('filterReseted', $scope.reload);
			$scope.$on('filterApplied', $scope.reload);
		}

		$scope.$on("$destroy", function() {
			$rootScope.setFulltextSearch('');
		});

		$scope.init();
	}
]);