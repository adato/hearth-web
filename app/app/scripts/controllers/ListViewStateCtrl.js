'use strict';


angular.module('hearth.controllers').controller('ListViewStateCtrl', [
	'$scope', '$timeout', '$window', '$location',
	function($scope, $timeout, $window, $location) {
		$scope.isAdBeingCreated = false;
		$scope.isAdBeingEdited = false;
		$scope.editId = null;
		$scope.isCreatingAd = function() {
			return $scope.isAdBeingCreated;
		};
		$scope.isReplyingAd = function() {
			return $scope.isAdBeingReplied;
		};
		$scope.startCreatingAd = function() {
			if ($scope.createAdForm != null) {
				$scope.createAdForm.$setPristine();
				delete $scope.errors;
			}
			if ($scope.isCreatingAd() || $scope.isEditingAd()) {
				return;
			}
			$scope.$broadcast('setDefaultPost');
			$scope.$broadcast('startCreatingAd');
			$scope.$broadcast('cancelReplyingAd');
			return $scope.$broadcast('cancelEditingAd');
		};
		$scope.$on('cancelCreatingAd', function() {
			return $scope.isAdBeingCreated = false;
		});
		$scope.$on('startCreatingAd', function() {
			$scope.isAdBeingCreated = true;
			$scope.$broadcast('setDefaultPost');
			if ($scope.isReplyingAd()) {
				return $scope.$broadcast('cancelReplyingAd');
			}
		});
		$scope.$on('cancelReplyingAd', function() {
			delete $location.search().id;
			return $scope.isAdBeingReplied = false;
		});
		$scope.$on('startReplyingAd', function() {
			$scope.isAdBeingReplied = true;
			if ($scope.isCreatingAd()) {
				$scope.$broadcast('cancelCreatingAd');
			}
			if ($scope.isEditingAd()) {
				$scope.$broadcast('cancelEditingAd');
			}
			return $timeout(function() {
				if ($window.innerWidth < $scope.breakpointForSmall) {
					return window.scroll(0, 0);
				}
			});
		});
		$scope.startEditingAd = function($event, post) {
			$scope.editId = post._id;
			$scope.$broadcast('startEditingAd');
			$scope.$broadcast('cancelCreatingAd');
			$scope.$broadcast('cancelReplyingAd');
			$event.stopPropagation();
			return $event.preventDefault();
		};
		$scope.$on('startEditingAd', function() {
			return $scope.isAdBeingEdited = true;
		});
		$scope.$on('cancelEditingAd', function() {
			$scope.$broadcast('setDefaultPost');
			$scope.editId = null;
			return $scope.isAdBeingEdited = false;
		});
		$scope.isEditingAd = function(id) {
			if (id == null) {
				return $scope.isAdBeingEdited;
			}
			return $scope.isAdBeingEdited && $scope.editId === id;
		};
		return $scope.$on('scrollIntoView', function() {
			return $timeout(function() {
				if ($window.innerWidth < $scope.breakpointForSmall) {
					return window.scroll(0, $scope.scrollTop);
				}
			});
		});
	}
]);