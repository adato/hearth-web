'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('ItemEdit', [
	'$scope', '$rootScope', 'Auth', 'Errors', '$upload', '$filter', 'LanguageSwitch', 'Post', '$element', '$timeout', 'Notify', '$location', 'KeywordsService',
	function($scope, $rootScope, Auth, Errors, $upload, $filter, LanguageSwitch, Post, $element, $timeout, Notify, $location, KeywordsService) {
		var defaultValidToTime = 30 * 24 * 60 * 60 * 1000; // add 30 days 
		// $scope.dateFormat = $rootScope.DATETIME_FORMATS.mediumDate;
		$scope.dateFormat = modifyDateFormat($rootScope.DATETIME_FORMATS.shortDate);
		$scope.defaultPost = {
			type: false,
			keywords: [],
			valid_until: $filter('date')(new Date().getTime() + defaultValidToTime, $scope.dateFormat),
			locations: [],
			current_community_id: null,
			related_communities: [],
			location_unlimited: false,
			valid_until_unlimited: false,
			attachments_attributes: [],
			state: 'active',
			is_private: false,
		};
		$scope.slide = {
			keywords: false,
			files: false,
			date: false,
			lock: false,
		};
		$scope.newPost = false;
		$scope.showError = {
			title: false,
			text: false,
			locations: false,
			valid_until: false
		};

		$scope.sending = false;
		$scope.pauseSending = false;

		$rootScope.$on('removeAd', function(info, id) {
			if (id == $scope.post._id) {
				$scope.closeThisDialog();
			}
		});

		$scope.queryKeywords = function($query) {
			return KeywordsService.queryKeywords($query);
		};

		$scope.dateUnlimitedToggle = function() {

			$scope.showError.valid_until = false;
			$scope.createAdForm.valid_until.$error.invalid = false;

			// $scope.post.valid_until_unlimited = !$scope.post.valid_until_unlimited;
			if (!$scope.post.valid_until_unlimited) {
				$scope.post.valid_until = '';
			}
		};

		$scope.removeImage = function(index) {
			var files = $scope.post.attachments_attributes;

			if (!files[index]._id) {
				files.splice(index, 1);
			} else {
				files[index].deleted = true;
			}
			// $scope.$apply();
		};

		$scope.cleanNullLocations = function(loc) {
			for (var i = 0; i < loc.length; i++) {
				if (!loc[i].coordinates) {
					loc.splice(i, 1);
					i--;
				}
			}
			return loc;
		};

		$scope.transformDataIn = function(post) {
			if (post) {
				post.dateOrig = post.valid_until;
				post.valid_until = $filter('date')(post.valid_until, $scope.dateFormat);

				if(post.author._type == 'Community')
					post.current_community_id = post.author._id;

				if(post.valid_until_unlimited) {
					post.valid_until = '';
				}

				post.name = $.trim(post.name);

				if (!post.locations || !post.locations.length || post.location_unlimited) {
					post.locations = [];
				}

				post.type = post.type == 'need';
			}
			return post;
		}

		$scope.transformDataOut = function(data) {
			// clear locations from null values
			data.locations = $scope.cleanNullLocations(data.locations);
			// transform keywords 
			data.keywords = data.keywords.map(function(obj) {
				return obj.text;
			});

			if(data.location_unlimited) {
				data.locations = [];
			}

			if(!data.locations.length) {
				data.locations = [];
			}

			if(!data.valid_until_unlimited) {
				data.valid_until_unlimited = false;
			}


			var values = {
				false: 'offer',
				true: 'need'
			};

			data.type = values[data.type];

			return data;
		};

		$scope.testForm = function(post) {
			var res = false;
			
			if($scope.createAdForm.title.$invalid) {
				res = $scope.showError.title = true;
			}

			if($scope.createAdForm.text.$invalid) {
				res = $scope.showError.text = true;
			}

			if(!post.valid_until_unlimited) {

				if(post.valid_until == '') {
					res = $scope.showError.valid_until = true;
				} else if( getDateDiffFromNow(post.valid_until, $scope.dateFormat) < 0) {

					// test for old date in past
					res = $scope.showError.valid_until = true;
					$scope.createAdForm.valid_until.$error.invalid = true;
				}
			}
			
			// locations are not unlimited
			if(! post.location_unlimited ) {

				// and are empty
				if(!post.locations || !post.locations.length) {
					res = $scope.showError.locations = true;
				}
			}

			return ! res;
		};

		function getMomentTimeObject(datetime, format) {

			// make dates format same as moment.js format
			// create moment object from our date and add 1 hour because of timezones and return iso string
			format = format.toUpperCase();
			format = format.replace(/([^Y]|Y)YY(?!Y)/g, '$1YYYY');
			format = format.replace(/([^Y]|^)Y(?!Y)/g, '$1YYYY');
			
			return moment(datetime, format);
		}

		function convertDateToIso(datetime, format) {
			return getMomentTimeObject(datetime, format).format();
		}

		function getDateDiffFromNow(datetime, format) {
			var today = moment(moment().format('DD.MM.YYYY'), 'DD.MM.YYYY');
			return getMomentTimeObject(datetime, format).diff(today, 'minutes');
		}

		$scope.blurDate = function(datetime) {
			$scope.showError.valid_until = true;

			if(datetime != '') {
				
				$timeout(function() {
					if(getDateDiffFromNow($scope.post.valid_until, $scope.dateFormat) < 0) {
						$scope.createAdForm.valid_until.$error.invalid = true;
					}
				});
			}
		};
		
		$scope.focusDate = function(datetime) {

			$scope.createAdForm.valid_until.$error.invalid = false;
			$scope.showError.valid_until = false;
		};

		$scope.processResult = function(data, post) {
			$rootScope.globalLoading = false;
			
			// if($scope.post._id)
			// 	Notify.addSingleTranslate('NOTIFY.POST_UPDATED_SUCCESFULLY', Notify.T_SUCCESS);
			// else
			// 	Notify.addSingleTranslate('NOTIFY.POST_CREATED_SUCCESFULLY', Notify.T_SUCCESS);
			$scope.closeThisDialog();
			
			// emit event into whole app
			$rootScope.$broadcast(post._id ? 'postUpdated' : 'postCreated', data);

			// $(document.body).scrollTop(0);

			if($rootScope.isPostActive(data) && $location.path() != '/') {
				// wait for refresh to 
				var deleteEventListener = $rootScope.$on('postsLoaded', function() {
					deleteEventListener();

					setTimeout(function() {
						$rootScope.blinkPost(data);
					}, 100);
				});

				// if post is visible on marketplace - refresh user there
				$location.path('/');
				$rootScope.insertPostIfMissing(data);
			} else {
				// flash post immediatelly
				setTimeout(function() {
					$rootScope.blinkPost(data);
				}, 200);
			}
		};

		$scope.processErrorResult = function() {
			Notify.addSingleTranslate('NOTIFY.EMAIL_INVITATION_FAILED', Notify.T_ERROR, ".invite-box-notify");
			$scope.sending = false;
			$rootScope.globalLoading = false;
		};

		$scope.publishPost = function(data, post, done) {
			Post.publish({id: post._id}, function() {
				done(data, post);
			}, $scope.processErrorResult);
		};

		$scope.resumePost = function(data, post, done) {
			Post.resume({id: post._id}, function() {
				done(data, post);
			}, $scope.processErrorResult);
		};

		$scope.save = function(post, activate) {
			var postData, postDataCopy;

			// return $rootScope.globalLoading = true;
			// hide top "action failed" message
			$scope.showInvalidPostMessage = false;
			if(! $scope.testForm(post)) {
				$timeout(function() {
					$rootScope.scrollToError('.create-ad .error', '.ngdialog');
					$scope.showInvalidPostMessage = true;
				}, 50);
				return false;
			}

			//we need copy, because we change data and don't want to show these changes to user
			postData = angular.extend(
				angular.copy(post), {
					valid_until: (post.valid_until) ? convertDateToIso(post.valid_until, $scope.dateFormat) : post.valid_until,
					id: $scope.post._id
				}
			);
			
			postData = $scope.transformDataOut(postData);

			// if(post.related_community_ids.length) {
			// 	postData.related_community_ids = [];
			// 	post.related_community_ids.forEach(function(item) {
			// 		postData.related_community_ids.push(item._id);
			// 	});
			// }

			if ($scope.sending) {
				return false;
			}
			$scope.sending = true;
			$rootScope.globalLoading = true;

			Post[post._id ? 'update' : 'add'](postData, function(data) {

				// if it is save&activate button
				// call prolong or resume endpoints first
				switch(activate && post.state) {
				    case 'expired':
						return $scope.publishPost(data, post, $scope.processResult);
				    case 'suspended':
						return $scope.resumePost(data, post, $scope.processResult);
				    default:
						$scope.processResult(data, post);
				}
			}, $scope.processErrorResult);
		};

		// when edited, we should change also original post
		$scope.setPostActiveStateCallback = function(post) {
			$scope.postOrig.state = post.state;
		};

		function modifyDateFormat(dateFormat) {

			dateFormat = dateFormat.replace(/([^y]|y)yy(?!y)/g, '$1y');
			dateFormat = dateFormat.replace(/([^y]|^)yyyy(?!y)/g, '$1y');
			return dateFormat;
		}
		
		$scope.itemDeleted = function($event, item) {
			if($scope.post._id == item._id) $scope.closeEdit();
		};

		$scope.closeEdit = function() {
			// == close all modal windows 
			$scope.closeThisDialog();
		};

		$scope.pauseToggle = function(post) {
			var postCopy = angular.copy(post);

			postCopy.state = (postCopy.state == 'active') ? 'suspended' : 'active';
			$scope.save(postCopy);
		};

		$scope.refreshItemInfo = function($event, item) {
			// if renewed item is this item, refresh him!
			if(item._id === $scope.post._id) {
				$scope.post = $scope.transformDataIn(item);
			}
		};

		$scope.init = function() {
			$scope.newPost = !$scope.post;
			$scope.post = $scope.transformDataIn($scope.post) || $scope.defaultPost;

			// if post is invalid, show message and run validation (it will show errors in invalid fields)
			if($scope.isInvalid) {
				$scope.showInvalidPostMessage = true;
				$timeout(function() {
					$scope.testForm($scope.post);
				}, 1000);
			}
		};

		$scope.init();
		$scope.$watch('post.current_community_id', function(val, old) {
			if(!!val !== !!old) {
				$scope.post.is_private = 0;
				$scope.post.related_communities = [];
			}
		});
		$scope.$on('updatedItem', $scope.refreshItemInfo);
		$scope.$on("itemDeleted", $scope.itemDeleted);
	}
]);