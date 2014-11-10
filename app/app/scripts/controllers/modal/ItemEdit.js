'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('ItemEdit', [
	'$scope', '$rootScope', 'Auth', 'Errors', '$filter', 'LanguageSwitch', 'Post', '$element', '$timeout', 'Notify', '$location',
	function($scope, $rootScope, Auth, Errors, $filter, LanguageSwitch, Post, $element, $timeout, Notify, $location) {
		var defaultValidToTime = 30 * 24 * 60 * 60 * 1000; // add 30 days 
		// $scope.dateFormat = $rootScope.DATETIME_FORMATS.mediumDate;
		$scope.dateFormat = modifyDateFormat($rootScope.DATETIME_FORMATS.shortDate);
		$scope.defaultPost = {
			type: false,
			keywords: [],
			valid_until: $filter('date')(new Date().getTime() + defaultValidToTime, $scope.dateFormat),
			locations: [{
				name: ''
			}],
			location_unlimited: false,
			valid_until_unlimited: false,
			attachments_attributes: [],
			is_active: true
		};

		$scope.showFiles = false;
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

		// $scope.$watch('languageCode', function() {
		// 	var timestamp = dateToTimestamp($scope.post.date, true);
		// 	$scope.post.date = $filter('date')(timestamp, $scope.dateFormat);
		// });
	
		// var dateToConvert = new Date();
		// alert(dateToConvert.toISOString());

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
			$scope.$apply();
		};

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
		};

		$scope.$watch('post', recountImages, true);

		$scope.transformImagesStructure = function(postDataCopy) {
			postDataCopy.attachments = [];
			postDataCopy.attachments_attributes.forEach(function(el) {
				postDataCopy.attachments.push({
					normal: el.file,
					origin: el.file,
					large: el.file
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
		};

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
				data.locations = false;
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
			
			if(post.locations && ! post.location_unlimited) {

				post.locations.forEach(function(item) {
					if(item.name == '' || !item.coordinates) {
						res = $scope.showError.locations = true;
					}
				});
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

			// console.log(getMomentTimeObject(datetime, format).format() + " <=> "+ today.format() + " : " + diff );
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

		$scope.save = function(post) {
			var postData, postDataCopy;

			// hide top "action failed" message
			$scope.showInvalidPostMessage = false;

			if(! $scope.testForm(post)) {
				$timeout(function() {
					$rootScope.scrollToError('.create-ad .error', '.ngdialog');
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
			$rootScope.globalLoading = true;

			Post[post._id ? 'update' : 'add'](postData, function(data) {
				$rootScope.globalLoading = false;
				postDataCopy = $scope.transformImagesStructure(postDataCopy);
				
				// if($scope.post._id)
				// 	Notify.addSingleTranslate('NOTIFY.POST_UPDATED_SUCCESFULLY', Notify.T_SUCCESS);
				// else
				// 	Notify.addSingleTranslate('NOTIFY.POST_CREATED_SUCCESFULLY', Notify.T_SUCCESS);
				$scope.closeThisDialog();

				// emit event into whole app
				$rootScope.$broadcast( post._id ? 'postUpdated' : 'postCreated', data);

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
				} else {
					// flash post immediatelly
					setTimeout(function() {
						$rootScope.blinkPost(data);
					}, 200);
				}


				// $scope.closeThisDialog();
			}, function() {

                Notify.addSingleTranslate('NOTIFY.EMAIL_INVITATION_FAILED', Notify.T_ERROR, ".invite-box-notify");
				$scope.sending = false;
				$rootScope.globalLoading = false;
			});

			/*$analytics.eventTrack(eventName, {
				category: 'Posting',
				label: 'NP',
				value: 7
			});*/

		};

		// when edited, we should change also original post
		$scope.setPostActiveStateCallback = function(post) {

			$scope.postOrig.is_active = post.is_active;
			$scope.postOrig.is_expired = post.is_expired;
		};

		function modifyDateFormat(dateFormat) {

			dateFormat = dateFormat.replace(/([^y]|y)yy(?!y)/g, '$1y');
			dateFormat = dateFormat.replace(/([^y]|^)yyyy(?!y)/g, '$1y');
			return dateFormat;
		}
		
		function transformDataIn(post) {
			if (post) {
				post.dateOrig = post.valid_until;
				post.valid_until = $filter('date')(post.valid_until, $scope.dateFormat);

				if(post.valid_until_unlimited) {
					post.valid_until = '';
				}

				post.name = $.trim(post.name);

				if (!post.locations || !post.locations.length || post.location_unlimited) {
					post.locations = [{
						name: ''
					}];
				}

				post.type = post.type == 'need';
			}
			return post;
		}

		$scope.itemDeleted = function($event, item) {

			if($scope.post._id == item._id) $scope.closeEdit();
		};

		$scope.closeEdit = function() {
			// == close all modal windows 
			if($scope.post._id) {
				$('#confirm-delete-'+$scope.post._id).foundation('reveal', 'close');
				$('#confirm-pause-'+$scope.post._id).foundation('reveal', 'close');
			}
			
			$scope.closeThisDialog();
		};

		$scope.init = function() {
			$scope.post = transformDataIn($scope.post) || $scope.defaultPost;

			// if post is invalid, show message and run validation (it will show errors in invalid fields)
			if($scope.isInvalid) {
				$scope.showInvalidPostMessage = true;
				$timeout(function() {
					$scope.testForm($scope.post);
				}, 1000);
			}
		};

		$scope.pauseToggle = function(post) {
			var postCopy = angular.copy(post);

			// prolong
			if(postCopy.is_expired) {

				postCopy.is_active = true;
				postCopy.is_expired = false;
			} else {
				// pause / play
				postCopy.is_active = !postCopy.is_active;
			}

			$scope.save(postCopy);
		};

		$scope.refreshItemInfo = function($event, item) {
			// if renewed item is this item, refresh him!
			if(item._id === $scope.post._id) {
				$scope.post = transformDataIn(item);
			}
		};
		$scope.init();
		$rootScope.$on('updatedItem', $scope.refreshItemInfo);
		$rootScope.$on("itemDeleted", $scope.itemDeleted);
	}
]);