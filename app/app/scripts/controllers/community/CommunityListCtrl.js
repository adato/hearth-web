'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityListCtrl
 * @description 
 */
 
angular.module('hearth.controllers').controller('CommunityListCtrl', [
	'$scope', 'Community', 'UnauthReload', '$state',
	function($scope, Community, UnauthReload, $state) {
		$scope.list = [];
		$scope.loading = false;
		$scope.loadingFinished = false;

		$scope.load = function() {
			if($scope.loadingFinished) return false;

			var conf = {
				limit: 20,
				offset: $scope.list.length
			};

			$scope.loading = true;

			var service = ($state.current.name == 'communities.suggested') ? Community.suggested : Community.query;
			service(conf, function(res) {
				$scope.list = $scope.list.concat(res);
				$scope.loading = false;
				$scope.$parent.loadedFirstBatch = true;

				if(!res.length || $state.current.name == 'communities.suggested') {
					return $scope.loadingFinished = true;
				}
			});
		};

		UnauthReload.check();
		$scope.load();
	}
]);