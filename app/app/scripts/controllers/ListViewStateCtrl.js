// ======================= DEPRECATED ===================
// 'use strict';

// /**
//  * @ngdoc controller
//  * @name hearth.controllers.ListViewStateCtrl
//  * @description 
//  * @deprecated
//  */

// angular.module('hearth.controllers').controller('ListViewStateCtrl', [
// 	'$scope', '$timeout', '$window', '$location', 'KeywordsService', 'UTCdateFilter', 'dateFilter',
// 	function($scope, $timeout, $window, $location, KeywordsService, UTCdateFilter, dateFilter) {
// 		$scope.isAdBeingCreated = false;
// 		$scope.isAdBeingEdited = false;
// 		$scope.editId = null;
// 		$scope.isCreatingAd = function() {
// 			return $scope.isAdBeingCreated;
// 		};
// 		$scope.isReplyingAd = function() {
// 			return $scope.isAdBeingReplied;
// 		};
// 		$scope.startCreatingAd = function() {
// 			if ($scope.createAdForm != null) {
// 				$scope.createAdForm.$setPristine();
// 				delete $scope.errors;
// 			}
// 			if ($scope.isCreatingAd() || $scope.isEditingAd()) {
// 				return;
// 			}
// 			$scope.$broadcast('setDefaultPost');
// 			$scope.$broadcast('startCreatingAd');
// 			$scope.$broadcast('cancelReplyingAd');
// 			return $scope.$broadcast('cancelEditingAd');
// 		};
// 		$scope.$on('cancelCreatingAd', function() {
// 			$scope.isAdBeingCreated = false;
// 			return $scope.isAdBeingCreated;
// 		});
// 		$scope.$on('startCreatingAd', function() {
// 			$scope.isAdBeingCreated = true;
// 			$scope.$broadcast('setDefaultPost');
// 			if ($scope.isReplyingAd()) {
// 				return $scope.$broadcast('cancelReplyingAd');
// 			}
// 		});
// 		$scope.$on('cancelReplyingAd', function() {
// 			delete $location.search().id;
// 			$scope.isAdBeingReplied = false;
// 			return $scope.isAdBeingReplied;
// 		});
// 		$scope.$on('startReplyingAd', function() {
// 			$scope.isAdBeingReplied = true;
// 			if ($scope.isCreatingAd()) {
// 				$scope.$broadcast('cancelCreatingAd');
// 			}
// 			if ($scope.isEditingAd()) {
// 				$scope.$broadcast('cancelEditingAd');
// 			}
// 			return $timeout(function() {
// 				if ($window.innerWidth < $scope.breakpointForSmall) {
// 					return window.scroll(0, 0);
// 				}
// 			});
// 		});
// 		$scope.startEditingAd = function($event, post) {
// 			$scope.editId = post._id;
// 			$scope.$broadcast('startEditingAd');
// 			$scope.$broadcast('cancelCreatingAd');
// 			$scope.$broadcast('cancelReplyingAd');
// 			$event.stopPropagation();
// 			post.date = post.date && post.date > -1 ? dateFilter(UTCdateFilter(post.date), 'dd.MM.yyyy') : undefined;
// 			return $event.preventDefault();
// 		};
// 		$scope.$on('startEditingAd', function() {
// 			$scope.isAdBeingEdited = true;
// 			return $scope.isAdBeingEdited;
// 		});
// 		$scope.$on('cancelEditingAd', function() {
// 			$scope.$broadcast('setDefaultPost');
// 			$scope.editId = null;
// 			$scope.isAdBeingEdited = false;
// 			return $scope.isAdBeingEdited;
// 		});
// 		$scope.isEditingAd = function(id) {
// 			if (id == null) {
// 				return $scope.isAdBeingEdited;
// 			}
// 			return $scope.isAdBeingEdited && $scope.editId === id;
// 		};
// 		$scope.$on('scrollIntoView', function() {
// 			return $timeout(function() {
// 				if ($window.innerWidth < $scope.breakpointForSmall) {
// 					return window.scroll(0, $scope.scrollTop);
// 				}
// 			}, 0);
// 		});
// 		return $scope.queryKeywords = function($query) {
// 			return KeywordsService.queryKeywords($query);
// 		};
// 	}
// ]);