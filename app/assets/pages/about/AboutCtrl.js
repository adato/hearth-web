'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.StaticPageCtrl
 * @description
 */
 
angular.module('hearth.controllers').controller('AboutCtrl', [
	'$state', '$scope', 'AmbassadorsListService', 'Community', 'SimilarProjectsService', 'ngDialog', 'OpenGraph', '$translate', 'PageTitle',
	function($state, $scope, AmbassadorsListService, Community, SimilarProjectsService, ngDialog, OpenGraph, $translate, PageTitle) {

		$scope.activeTab = null;
		$scope.ambassadorsList = [];
		$scope.ambassadorsListLoaded = false;

		// these are the communities which should be listed on custodians page
		$scope.communities = { 
			custodians: {
				_id: '56b8b77fb433b4000700007a',
				data: null,
			},
			admins: {
				_id: '52cd60cd37b1210200000099',
				data: null,
			}
		};


		// obtains actual route values from ui-router via $state.current
		var getActiveTabFromState = function () {
			let defaultTab = 'ambassadors'; // default tab to select when no params given
			if (!$state || !$state.current || !$state.current.selectedTab) return defaultTab;
			return $state.current.selectedTab;
		}

		// fetches list of ambassadors (from service, or external resource)
		// requires AmbassadorsListService
		$scope.fetchAmbassadorsList = function () {
			$scope.ambassadorsListLoaded = false;
			return AmbassadorsListService.getList(function(getList) {
				$scope.ambassadorsList = getList;
				$scope.ambassadorsListLoaded = true;
			});
		}

		// fetches localities of ambassadors for map display
		$scope.fetchAmbassadorsLocalities = function () {
			$scope.ambassadorsLocalitiesLoaded = false;
			AmbassadorsListService.getLocalities(function(localities) {
				$scope.ambassadorsLocalities = localities;
				$scope.ambassadorsLocalitiesLoaded = true;
			});
		}

		// fetches information about two predefined communities (mainly for avatars) 
		// does not cache data
		$scope.scopeFetchCommunityInfo = function () {
			Community.get($scope.communities['custodians']).$promise.then(function (data) {
				$scope.communities.custodians.data = data;
				return Community.get($scope.communities['admins']).$promise;
			}).then(function (data) {
				$scope.communities.admins.data = data;
			});
		}

		// fetches similar projects list from particular country
		$scope.fetchSimilar = function (country) {
			return SimilarProjectsService.fetch(country);
		}

		// opens modal
		$scope.openModal = function(templateId, controller) {
			var ngDialogOptions = {
				template: templateId,
				scope: $scope,
				closeByEscape: true,
				showClose: false
			};
			if (typeof controller !== 'undefined') {
				ngDialogOptions.controller = controller;
			}

			ngDialog.open(ngDialogOptions);
		};


		$scope.init = function() {
			$scope.activeTab = getActiveTabFromState();

			if ($scope.activeTab == 'ambassadors' || $scope.activeTab == 'ambassadorsList') {
				$scope.fetchAmbassadorsList();
				$scope.fetchAmbassadorsLocalities();
			}

			if ($scope.activeTab == 'custodians') {
				$scope.scopeFetchCommunityInfo();
			}

			if ($scope.activeTab == 'principles') {
				var title = $translate.instant('HEARTH.PRINCIPLES.NAVIGATION_ITEM');
				var description = $translate.instant('HEARTH.PRINCIPLES.DESCRIPTION');
				PageTitle.set(title);
				OpenGraph.set(title, description);
			}
		};

		$scope.init();


	}
]);