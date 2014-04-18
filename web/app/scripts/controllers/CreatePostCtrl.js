'use strict';

angular.module('hearth.controllers').controller('CreatePostCtrl', [
	'$scope', 'Geocoder', 'Errors', '$q', 'PostsService', '$analytics', 'ResponseErrors', '$timeout', '$window',
	function($scope, Geocoder, Errors, $q, PostsService, $analytics, ResponseErrors, $timeout, $window) {
		$scope.defaultPost = {
			type: 'offer',
			keywords: []
		};
		$scope.post = $scope.defaultPost;
		$scope.$on('setDefaultPost', function($event, newitem) {
			var save;
			$scope.post = angular.copy(newitem || $scope.defaultPost);
			save = function() {
				$scope.post = this;
				return $scope.createAd();
			};
			return $scope.post.save = save;
		});
		$scope.setDefaultPost = function(item) {
			return $scope.$broadcast('setDefaultPost', item);
		};
		$scope.createAd = function() {
			var query;
			if (($scope.post != null) && ($scope.post.name != null) && ($scope.post.name.length != null)) {
				if ($scope.post.name.length < 3) {
					return $scope.errors = new ResponseErrors({
						status: 400,
						data: {
							name: 'ValidationError',
							errors: {
								name: {
									name: 'ValidatorError',
									type: 'ERR_AD_NAME_MIN_LEN'
								}
							}
						}
					});
				} else {
					$scope.sending = true;
					if ($scope.post._id) {
						query = $scope.updatePost($scope.post);
					} else {
						query = $scope.createPost($scope.post);
					}
					return query.then(function(createdItem) {
						$scope.$emit('cancelCreatingAd');
						$scope.$emit('cancelEditingAd');
						$window.location.reload();
						$scope.sending = false;
						if ($scope.createAdForm != null) {
							$scope.createAdForm.$setPristine();
						}
						return delete $scope.errors;
					}, function(err) {
						return $scope.errors = new ResponseErrors(err);
					});
				}
			}
		};
		$scope.autodetectPosition = function() {
			return Geocoder.findMeAndGeocode().then(function(geocodedLocation) {
				return $scope.post.location = Geocoder.latLonToGeoJson(geocodedLocation);
			});
		};
		$scope.photoUploadSuccessful = function($event) {
			var _ref, _ref1;
			if ((((_ref = $event.target) != null ? _ref.response : void 0) != null) && ((_ref1 = $event.target.status) !== 404 && _ref1 !== 403 && _ref1 !== 500)) {
				return $scope.post.attachments = [JSON.parse($event.target.response)];
			}
		};
		$scope.createPost = function(post) {
			var deferred, event;
			deferred = $q.defer();
			$scope.sent = false;
			PostsService.add(post).then(function(data) {
				if (data) {
					$scope.sent = true;
				}
				$scope.setLastAddedId(data._id);
				$scope.error = null;
				$scope.sending = false;
				return deferred.resolve(data);
			}, function(err) {
				$scope.sending = false;
				return deferred.reject(err);
			});
			event = post.type === 'need' ? 'post new wish' : 'post new offer';
			$analytics.eventTrack(event, {
				category: 'Posting',
				label: 'NP',
				value: 7
			});
			return deferred.promise;
		};
		return $scope.updatePost = function(post) {
			var deferred, event;
			deferred = $q.defer();
			$scope.sent = false;
			PostsService.update(post).then(function(data) {
				if (data) {
					$scope.sent = true;
				}
				$scope.error = null;
				return deferred.resolve(data);
			}, function(err) {
				$scope.sending = false;
				return deferred.reject(err);
			});
			event = post.type === 'need' ? 'update wish' : 'update offer';
			$analytics.eventTrack(event, {
				category: 'Posting',
				label: 'NP',
				value: 7
			});
			return deferred.promise;
		};
	}
]);