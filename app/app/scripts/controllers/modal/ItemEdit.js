'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('ItemEdit', [
	'$scope', '$rootScope', 'Auth', 'Errors', '$filter', 'LanguageSwitch', 'Post', '$element',
	function($scope, $rootScope, Auth, Errors, $filter, LanguageSwitch, Post, $element) {
		$scope.defaultPost = {
			type: 'offer',
			keywords: [],
			date: $filter('date')(new Date().getTime() + 30 * 24 * 60 * 60 * 1000, LanguageSwitch.uses().code === 'cs' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'),
			locations: [{
				name: ''
			}],
			location_unlimited: false,
			date_unlimited: false,
			attachments_attributes: [],
			// is_active: false
		};
		$scope.showFiles = false;

		// hotfix for now
		$scope.loggedCommunity = false;
		$scope.sending = false;

		$('.create-ad-textarea', $element).on('focus', function() {
			$(this).autosize();
		});
		$rootScope.$on('removeAd', function(info, id) {
			if (id == $scope.post._id) {
				$scope.closeThisDialog();
			}
		});

		// setTimeout($scope.showError, 3000);

		$scope.$watch('languageCode', function() {
			var timestamp = dateToTimestamp($scope.post.date, true);
			$scope.post.date = $filter('date')(timestamp, LanguageSwitch.uses().code === 'cs' ? 'dd.MM.yyyy' : 'MM/dd/yyyy');
		});

		$scope.showError = function(err, isError) {
			var modalWindow = $(".ngdialog-content"),
				messageBox = $(".headMessage", $element);

			messageBox.hide();
			messageBox.html("Hello Dolly");

			modalWindow.removeClass("errorBox");
			modalWindow.removeClass("msgBox");

			// if(isError)
			modalWindow.addClass("errorBox");

			messageBox.toggle(
				"slide", {
					direction: 'up',
					duration: 'slow',
					easing: 'easeOutQuart'
				}
			);
		};


		$scope.setDefaultPost = function() {
			$scope.post = angular.copy($scope.defaultPost);
		};

		function dateToTimestamp(dateToFormat, withOffset) {
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
				if (!withOffset) {
					outDate = outDate + zoneOffset * 60000; // remove timezone offset
				}
			}
			return outDate;
		}

		$scope.dateUnlimitedToggle = function() {
			
			$scope.post.date_unlimited = !$scope.post.date_unlimited;
			if ($scope.post.date_unlimited) {

				$scope.post.date = "";
			}
		}

		$scope.removeImage = function(index) {
			var files = $scope.post.attachments_attributes;

			if (!files[index]._id) {

				files.splice(index, 1);
			} else {
				files[index].deleted = true;
			}
		}

		function recountImages() {
			var files = $scope.post.attachments_attributes;
			var res = false;

			if (files) {
				for (var i = 0; i < files.length; i++) {
					if (!files[i]._id || !files[i].deleted) {
						res = true;
					}
				}
			}
			$scope.showFiles = res;
		}
		$scope.$watch('post', recountImages, true);

		$scope.transformImagesStructure = function(postDataCopy) {
			postDataCopy.attachments = [];
			postDataCopy.attachments_attributes.forEach(function(el) {
				postDataCopy.attachments.push({
					normal: el.file,
					origin: el.file
				});
			});

			delete postDataCopy.attachments_attributes;
			return postDataCopy;
		};

		$scope.cleanNullLocations = function(loc) {

			for (var i = 0; i < loc.length; i++) {

				if (!loc[i].coordinates) {
					loc.splice(i, 1);
					i--;
				}
			}
			return loc;
		}

		$scope.save = function() {
			var postData, postDataCopy;

			//we need copy, because we change data and don't want to show these changes to user
			postData = angular.extend(
				angular.copy($scope.post), {
					date: dateToTimestamp($scope.post.date, true),
					id: $scope.post._id
				}
			);

			// clear locations from null values
			postData.locations = $scope.cleanNullLocations(postData.locations);

			postDataCopy = angular.extend(
				angular.copy(postData), {
					author: Auth.getCredentials(),
					updated_at: new Date().toISOString(),
					reply_count: 0,
					isPhantom: true,
				}
			);
			if ($scope.sending) {
				return false;
			}
			$scope.sending = true;

			Post[$scope.post._id ? 'update' : 'add'](postData, function(data) {
				$scope.sending = false;

				postDataCopy = $scope.transformImagesStructure(postDataCopy);
				$rootScope.$broadcast($scope.post._id ? 'adUpdated' : 'adCreated', postDataCopy);

				$scope.$emit('adSaved', data);
				$scope.closeThisDialog();
			}, function() {

				alert("There was an error while saving this post");
				$scope.sending = false;
			});

			/*$analytics.eventTrack(eventName, {
				category: 'Posting',
				label: 'NP',
				value: 7
			});*/

		};

		$scope.delete = function() {

			// $rootScope.$broadcast('removeAd', $scope.post._id);
			// $rootScope.$emit('removeAd', $scope.post._id);
			// $('#confirm-delete').foundation('reveal', 'close');
		}


		// var query;

		// if ($scope.post && $scope.post.title && $scope.post.title.length > 0) {
		// 	if ($scope.post.title.length < 3) {
		// 		$scope.errors = new ResponseErrors({
		// 			status: 400,
		// 			data: {
		// 				name: 'ValidationError',
		// 				errors: {
		// 					name: {
		// 						name: 'ValidatorError',
		// 						type: 'ERR_AD_NAME_MIN_LEN'
		// 					}
		// 				}
		// 			}
		// 		});
		// 		return $scope.errors;
		// 	} else {
		// 		$scope.sending = true;
		// 		query = $scope[$scope.post._id ? 'updatePost' : 'createPost']($scope.post);
		// 		return query.then(function() {
		// 			$scope.$emit('cancelCreatingAd');
		// 			$scope.$emit('cancelEditingAd');
		// 			$window.location.reload();
		// 			$scope.sending = false;
		// 			if ($scope.createAdForm != null) {
		// 				$scope.createAdForm.$setPristine();
		// 			}
		// 			return delete $scope.errors;
		// 		}, function(err) {
		// 			$scope.errors = new ResponseErrors(err);
		// 			return $scope.errors;
		// 		});
		// 	}
		// }


		// $scope.createPost = function(post) {
		// 	var deferred, eventName, postData;

		// 	//we need copy, because we change data and don't want to show these changes to user
		// 	postData = angular.copy(post);
		// 	postData.date = dateToTimestamp(post.date);
		// 	deferred = $q.defer();
		// 	$scope.sent = false;

		// 	PostsService.add(postData).then(function(data) {
		// 		if (data) {
		// 			$scope.sent = true;
		// 		}
		// 		$scope.error = null;
		// 		$scope.sending = false;
		// 		return deferred.resolve(data);
		// 	}, function(err) {
		// 		$scope.sending = false;
		// 		return deferred.reject(err);
		// 	});
		// 	eventName = post.type === 'need' ? 'post new wish' : 'post new offer';
		// 	$analytics.eventTrack(eventName, {
		// 		category: 'Posting',
		// 		label: 'NP',
		// 		value: 7
		// 	});
		// 	return deferred.promise;
		// };

		// return $scope.updatePost = function(post) {
		// 	var deferred, eventName;
		// 	//we need copy, because we change data and don't want to show these changes to user
		// 	post = angular.copy(post);
		// 	post.date = post.date ? dateToTimestamp(post.date) : -1;
		// 	deferred = $q.defer();
		// 	$scope.sent = false;
		// 	PostsService.update(post).then(function(data) {
		// 		if (data) {
		// 			$scope.sent = true;
		// 		}
		// 		$scope.error = null;
		// 		return deferred.resolve(data);
		// 	}, function(err) {
		// 		$scope.sending = false;
		// 		return deferred.reject(err);
		// 	});
		// 	eventName = post.type === 'need' ? 'update wish' : 'update offer';
		// 	$analytics.eventTrack(eventName, {
		// 		category: 'Posting',
		// 		label: 'NP',
		// 		value: 7
		// 	});
		// 	return deferred.promise;
		// };

		function transformExistingPost(post) {
			if (post) {

				post.date = $filter('date')(post.date + 30 * 24 * 60 * 60 * 1000, LanguageSwitch.uses().code === 'cs' ? 'dd.MM.yyyy' : 'MM/dd/yyyy');
				if (!post.locations.length) {
					post.locations = [{
						name: ''
					}];
				}
			}

			return post;
		}

		$scope.init = function() {
			$scope.post = transformExistingPost($scope.post) || $scope.defaultPost;
		}

		$scope.init();

	}
]);