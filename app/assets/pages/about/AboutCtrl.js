'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.StaticPageCtrl
 * @description
 */

angular.module('hearth.controllers').controller('AboutCtrl', [
	'$state', '$scope', 'AmbassadorsListService', 
	function($state, $scope, AmbassadorsListService) {

		$scope.activeTab = null;

		// obtains actual route values from ui-router via $state.current
		var getActiveTabFromState = function () {
			let defaultTab = 'ambassadors'; // default tab to select when no params given
			if (!$state || !$state.current || !$state.current.selectedTab) return defaultTab;
			return $state.current.selectedTab;
		}

		// fetches list of ambassadors (from service, or external resource)
		// requires AmbassadorsListService
		// returns array of objects
		var fetchAmbassadorsList = function () {
			return AmbassadorsListService.getList(function(getList) {
				$scope.ambassadorsList = getList;
			});
		}

		$scope.init = function() {
			$scope.activeTab = getActiveTabFromState();

			if ($scope.activeTab == 'ambassadors' || $scope.activeTab == 'ambassadorsList') {
				fetchAmbassadorsList();
			}
		};

		$scope.init();

	}
]);