'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityCreateCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('CommunityCreateCtrl', [
	'$scope', '$location', '$routeParams', 'Community', 'CommunityMembers',
	function($scope, $location, $routeParams, Community, CommunityMembers) {
		$scope.communityMembers = [];
		$scope.adminChangeId = null;
		$scope.sendingDelete = false;
		$scope.defaultCommunity = {
			name: '',
			location: {name:''},
			description: '',
			terms: '',
		};
		$scope.showError = {
			location: false,
			name: false,
			description: false,
			terms: false,
		};
		$scope.community = {};

		$scope.fillDefaultCommunity = function() {
			
			$scope.community = angular.copy($scope.defaultCommunity);
			$scope.loaded = true;
		};

		$scope.transformDataOut = function(data) {

			data.location = data.location[0];
			return data;
		};

		$scope.transformDataIn = function(data) {

			if(data.location === null) {
				data.location = [{name:''}];
			} else {
				data.location = [data.location];
			}
			return data;
		};

		$scope.loadCommunity = function(id) {

			Community.get({communityId: id}, function(res) {
				$scope.community = $scope.transformDataIn(res);
				$scope.loaded = true;
			});

			CommunityMembers.query({communityId: id}, function(res) {
				$scope.communityMembers = res;
			});
		};

		$scope.getCommunityId = function() {
			return $routeParams.id;
		};

		$scope.validate = function(data) {
			var err = false;

			if($scope.communityForm.name.$invalid) {
				$scope.showError.name = err = true;
			}
			
			if($scope.communityForm.terms.$invalid) {
				$scope.showError.terms = err = true;
			}

			if($scope.communityForm.description.$invalid) {
				$scope.showError.description = err = true;
			}

			if(data.location[0].name == '') {
				$scope.showError.location = err = true;
			}

			return ! err; // return true if valid
		}

		$scope.save = function() {
			// if we have community ID - then edit
			var service = ($scope.community._id) ? Community.edit : Community.add;
			var transformedData;
			// validate data
			if(!$scope.validate($scope.community)) return false;

			// lock
			if($scope.sending) return false;
			$scope.sending = true;

			transformedData = $scope.transformDataOut(angular.copy($scope.community));
			service(transformedData, function(res) {
	            $rootScope.$broadcast("newCommunity");
	            $location.path('/community/'+res._id);
			}, function(res) {
				alert("Operace se nezdařila :-(");
				$scope.sending = false;;
			});
		};
		
		$scope.change = function(id) {

				
		}

		$scope.delete = function() {

			if($scope.sendingDelete) return false;
			$scope.sendingDelete = true;
			Community.remove({communityId: $scope.community._id}, function(res) {

				$scope.sendingDelete = false;
				alert("KOMUNITA BYLA SMAZANA");
				$location.path("/communities");
			}, function(res) {

				alert("Při mazání komunity došlo k chybě.");
				$scope.sendingDelete = false;
			});
		};

		$scope.init = function() {

			if($scope.getCommunityId()) {
				$scope.loadCommunity($scope.getCommunityId());
			} else {
				$scope.fillDefaultCommunity();
			}
		};

		$scope.init();
	}
]);