'use strict';

angular.module('hearth.controllers').controller('CreatePostCtrl', [
	'$scope', 'Geocoder', 'Errors', '$q', 'PostsService', '$analytics', 'ResponseErrors', '$timeout', '$window', '$filter',
	function($scope, Geocoder, Errors, $q, PostsService, $analytics, ResponseErrors, $timeout, $window,  $filter) {
		$scope.defaultPost = {
			type: 'offer',
			keywords: [],
			date: $filter('date')(new Date().getTime() + 30 * 24 * 60 * 60 * 1000, $scope.languageCode.code === 'cs' ? 'dd.MM.yyyy' : 'MM/dd/yyyy')
		};
		$scope.post = $scope.defaultPost;
		$scope.$on('setDefaultPost', function($event, newitem) {
			$scope.post = angular.copy(newitem || $scope.defaultPost);
			if (!$scope.post.locations || $scope.post.locations.length === 0) {
				$scope.post.locations = [{
					name: ''
				}];
			}
			$scope.post.save = function() {
				$scope.post = this;
				return $scope.createAd();
			};
			return $scope.post.save;
		});

		$scope.setDefaultPost = function(item) {
			return $scope.$broadcast('setDefaultPost', item);
		};

		$scope.createAd = function() {
			var query;

			if ($scope.post && $scope.post.name && $scope.post.name.length > 0) {
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
					query = $scope[$scope.post._id ? 'updatePost' : 'createPost']($scope.post);
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

		function dateToTimestamp(dateToFormat) {
			var outDate, dateCs, dateEn, zoneOffset;

			if (dateToFormat) {
				dateCs = dateToFormat.match(/(^\d{2})\.(\d{2})\.(\d{4})$/),
				dateEn = dateToFormat.match(/(^\d{2})\/(\d{2})\/(\d{4})$/),
				zoneOffset = (new Date()).getTimezoneOffset();

				if (dateCs) {
					outDate = new Date(parseInt(dateCs[3], 10), parseInt(dateCs[2], 10) - 1, parseInt(dateCs[1], 10), 0, 0, 0).getTime();
				} else if (dateEn) {
					outDate = new Date(parseInt(dateEn[3], 10), parseInt(dateEn[1], 10) - 1, parseInt(dateEn[2], 10), 0, 0, 0).getTime();
				} else {
					console.error('Unable to parse date ' + dateToFormat);
				}
				outDate = outDate + zoneOffset * 60000; // remove timezone offset
			}
			return outDate;
		}

		$scope.createPost = function(post) {
			var deferred, eventName, postData;

			//we need copy, because we change data and don't want to show these changes to user
			postData = angular.copy(post);
			postData.date = dateToTimestamp(post.date);
			deferred = $q.defer();
			$scope.sent = false;

			PostsService.add(postData).then(function(data) {
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
			eventName = post.type === 'need' ? 'post new wish' : 'post new offer';
			$analytics.eventTrack(eventName, {
				category: 'Posting',
				label: 'NP',
				value: 7
			});
			return deferred.promise;
		};

		return $scope.updatePost = function(post) {
			var deferred, eventName;
			//we need copy, because we change data and don't want to show these changes to user
			post = angular.copy(post);
			post.date = dateToTimestamp(post.date);
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
			eventName = post.type === 'need' ? 'update wish' : 'update offer';
			$analytics.eventTrack(eventName, {
				category: 'Posting',
				label: 'NP',
				value: 7
			});
			return deferred.promise;
		};
	}
]);