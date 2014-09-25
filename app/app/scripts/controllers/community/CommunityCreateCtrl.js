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
			locations: [{name:''}],
			description: '',
			terms: '',
		};
		$scope.showError = {
			location: false,
			name: false,
			description: false,
			terms: false,
			locations: false,
		};
		$scope.community = {};

		$scope.fillDefaultCommunity = function() {
			
			$scope.community = angular.copy($scope.defaultCommunity);
			$scope.loaded = true;
		};

		$scope.loadCommunity = function(id) {

			Community.get({communityId: id}, function(res) {
				$scope.community = res;
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

			if(data.locations) {
				data.locations.forEach(function(item) {
					if(item.name == '') {
						$scope.showError.locations = err = true;
					}
				});
			}

			return ! err; // return true if valid
		}

		$scope.save = function() {
			// if we have community ID - then edit
			var service = ($scope.community._id) ? Community.edit : Community.add;

			// validate data
			if(!$scope.validate($scope.community)) return false;

			// lock
			if($scope.sending) return false;
			$scope.sending = true;

			service($scope.community, function(res) {
	            $location.path('/community/'+res._id);
			}, function(res) {
				alert("Operace se nezdařila :-(");
				$scope.sending = false;;
			});
		};

		$scope.delete = function() {

			if($scope.sendingDelete) return false;
			$scope.sendingDelete = true;
			Community.remove({communityId: $scope.community._id}, function(res) {

				$scope.sendingDelete = false;
				alert("KOMUNITA BYLA SMAZANA");
				window.location.reload("#!/communities");
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