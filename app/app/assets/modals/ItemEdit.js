'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('ItemEdit', [
	'$scope', '$rootScope', 'Auth', 'Errors', '$filter', 'LanguageSwitch', 'Post', '$element', '$timeout', 'Notify', '$location', 'KeywordsService', 'ProfileUtils', 'LanguageList', '$http',
	function($scope, $rootScope, Auth, Errors, $filter, LanguageSwitch, Post, $element, $timeout, Notify, $location, KeywordsService, ProfileUtils, LanguageList, $http) {
		var POST_LANGUAGE = 'postLanguage';
		var defaultValidToTime = 30 * 24 * 60 * 60 * 1000; // add 30 days
		// $scope.dateFormat = $rootScope.DATETIME_FORMATS.mediumDate;
		$scope.dateFormat = modifyDateFormat($rootScope.DATETIME_FORMATS.shortDate);
		$scope.limitPixelSize = 200; // Pixels
		$scope.maxImageSizeLimit = 5; // MB
		// $scope.uploadResource = $$config.apiPath + '/posts/' + $scope.post._id + '/attachments';
		$scope.uploadResource = function(file) {
			return Post.announceAttachment({
				// config object for path
				postId: $scope.post._id,
			}, {
				// object for payload
				filename: file.name
			}, function(data) {
				// callback from $resource
				// function for upload to s3
				// and append info to scope items
				var pathPrefix = (data.url + '/' + data.key).replace("${filename}", file.name);

				/*	this should append all file data as multipart --- it works, but all multipart data get into the file and it is unreadable

					var fd = new FormData();
					fd.append('file', file);
		
					for (var i in data) {
						var key = i;
						var item = data[key];
						if (typeof item !== 'function') fd.append(key, item);
					};

// this is another way to create FormData -- haven`t tried yet, may work better
//				var fd = new FormData();
//				fd.append('key', key);
//				fd.append('Content-Type', file.type);
//				fd.append('AWSAccessKeyId', data.key);
//				fd.append('policy', data.policy);
//				fd.append('signature', data['x-amz-signature']);
//				fd.append("file", file);
//				fd.append('acl', data.acl);

				*/

				// id does the request to S3, put data there
				// if FormData is used, fd goes instead of file
				return $http.put(pathPrefix, file, {
					withCredentials: false,
					headers: {
						'Content-Type': file.type
					}
				});

			});
		};
		$scope.imagesCount = 0;
		$scope.authorList;
		$scope.imageSizesSum = 0;
		$scope.imageUploading = false;
		$scope.imageSizes = [];
		$scope.character = $$config.postCharacter;
		$scope.languageList = LanguageList.localizedList;


		var OFFER = 'offer';
		var LEND = 'lend';
		var BORROW = 'borrow';
		var NEED = 'need';

		var GIFT = 'gift';
		var LOAN = 'loan';
		var ANY = 'any';

		// put into two groups so that it is easier to responsively display as required
		$scope.itemTypeOptions = [
			[OFFER, LEND],
			[BORROW, NEED]
		];
		$scope.postTypes = $$config.postTypes;

		/**
		 *	Function that takes care of correct behaviour of the `type` and `exact_type` picker
		 *
		 *	- {String} itemType [offer, lend, borrow, need] [required]
		 *	- {Object} post [required] the post on which the `type` is being set
		 */
		$scope.setItemTypeActive = function(paramObject) {
			paramObject = paramObject || {};
			if (!(paramObject.itemType && paramObject.post)) throw new TypeError('itemType and post are both required for setting item type and exact_type.');
			var post = paramObject.post;
			if (paramObject.itemType === OFFER) {
				if (post.type === OFFER) {
					if (post.exact_type === GIFT) return;
					else if (post.exact_type === ANY) return post.exact_type = LOAN;
					else if (post.exact_type === LOAN) post.exact_type = ANY;
				} else {
					post.exact_type = GIFT;
				}
				post.type = OFFER;
			} else if (paramObject.itemType === LEND) {
				if (post.exact_type === ANY && post.type === OFFER) {
					post.exact_type = GIFT;
				} else {
					post.exact_type = post.exact_type === GIFT ? (post.type === OFFER ? ANY : LOAN) : LOAN;
				}
				post.type = OFFER;
			} else if (paramObject.itemType === NEED) {
				if (post.type === NEED) {
					if (post.exact_type === GIFT) return;
					if (post.exact_type === ANY) return post.exact_type = LOAN;
					if (post.exact_type === LOAN) post.exact_type = ANY;
				} else {
					post.exact_type = GIFT;
				}
				post.type = NEED;
			} else if (paramObject.itemType === BORROW) {
				if (post.exact_type === ANY && post.type === NEED) {
					post.exact_type = GIFT;
				} else {
					post.exact_type = post.exact_type === GIFT ? (post.type === NEED ? ANY : LOAN) : LOAN;
				}
				post.type = NEED;
			}
		};

		$scope.slide = {
			files: false,
			date: false,
			lock: false,
			communities: false,
		};
		$scope.newPost = false;
		$scope.showError = {
			files: {},
			title: false,
			text: false,
			character: false,
			locations: false,
			valid_until: false
		};

		$scope.sending = false;
		$scope.pauseSending = false;
		$scope.twoStepForm = {
			step2: false
		}

		$rootScope.$on('removeAd', function(info, id) {
			if (id == $scope.post._id) {
				$scope.closeThisDialog();
			}
		});

		$scope.getImageSizes = function() {
			return $scope.imageSizesSum;
		};

		$scope.togglePostType = function() {
			if (!$scope.post.reply_count) $scope.post.type = $scope.post.type === OFFER ? NEED : OFFER;
		};

		$scope.queryKeywords = function($query) {
			return KeywordsService.queryKeywords($query);
		};

		$scope.dateUnlimitedToggle = function() {

			$scope.showError.valid_until = false;

			// $scope.post.valid_until_unlimited = !$scope.post.valid_until_unlimited;
			if (!$scope.post.valid_until_unlimited) {
				$scope.post.valid_until = '';
			}
		};

		// this will recount all images which are not market to be deleted
		$scope.recountImages = function() {
			$scope.imagesCount = 0;
			$scope.imageSizesSum = 0;

			$scope.post.attachments_attributes.forEach(function(item, index) {
				if (!item.deleted) {
					$scope.imageSizesSum += $scope.imageSizes[index];
					$scope.imagesCount++;
				}
			});
		};

		$scope.updateImages = function() {
			$scope.recountImages();
			$scope.showError.files = {};
		};

		// remove image from attachments array
		// if image is already uploaded - mark him to be deleted
		// else remove from array
		$scope.removeImage = function(index) {
			var files = $scope.post.attachments_attributes;

			if (!files[index]._id) {
				files.splice(index, 1);
				$scope.imageSizes.splice(index, 1);
			} else {
				files[index].deleted = true;
			}

			$scope.recountImages();
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

		$scope.checkCharacter = function() {
			var character = $scope.post.character || [];
			var count = character.length;

			if (!count) {
				$scope.createAdForm.character.$invalid = true;
				$scope.createAdForm.character.$setValidity('required', false);
				$scope.createAdForm.character.$setValidity('max', true);
			} else if (count > 2) {
				$scope.createAdForm.character.$invalid = true;
				$scope.createAdForm.character.$setValidity('required', true);
				$scope.createAdForm.character.$setValidity('max', false);
			} else {
				$scope.createAdForm.character.$invalid = false;
				$scope.createAdForm.character.$setValidity('required', true);
				$scope.createAdForm.character.$setValidity('max', true);
			}

			return $scope.createAdForm.character.$invalid;
		};

		/**
		 * Transform - deserialize post to object which can be used in application
		 */
		$scope.transformDataIn = function(post) {
			if (post) {
				post.text = $.trim(post.text);
				post.dateOrig = post.valid_until;
				post.valid_until_unlimited = (post.valid_until == 'unlimited');

				if (post.author._type == 'Community')
					post.current_community_id = post.author._id;

				if (!post.valid_until_unlimited) {
					post.valid_until = $filter('date')(post.valid_until, $scope.dateFormat);
				} else {
					post.valid_until = '';
				}

				if (!post.locations || !post.locations.length || post.location_unlimited) {
					post.locations = [];
				}

				var postLanguage = $.cookie(POST_LANGUAGE);
				if (!post.language) post.language = (postLanguage ? postLanguage : $.cookie('language'));

				$scope.slide.files = !!post.attachments_attributes.length;
				$scope.slide.keywords = !!post.keywords.length;
				$scope.slide.communities = !!post.related_communities.length;
			}
			return post;
		}

		$scope.transformDataOut = function(data) {
			// clear locations from null values
			//data.locations = $scope.cleanNullLocations(data.locations);
			// transform keywords
			data.keywords = data.keywords.map(function(obj) {
				return obj.text;
			});

			if (data.valid_until_unlimited) {
				data.valid_until = 'unlimited';
			}

			delete data.valid_until_unlimited;
			return data;
		};

		/**
		 * Validate form before submit to API
		 */
		$scope.testForm = function(post) {
			var res = false;
			$scope.createAdForm.$setDirty();

			if ($scope.createAdForm.title.$invalid) {
				res = $scope.showError.title = true;
			}

			if ($scope.createAdForm.text.$invalid) {
				res = $scope.showError.text = true;
			}

			$scope.checkCharacter();

			if ($scope.createAdForm.character.$invalid) {
				res = $scope.showError.character = true;
			}

			if (!post.valid_until_unlimited) {
				if (post.valid_until == '') {
					res = $scope.slide.date = true;
					$timeout(function() {
						$scope.showError.valid_until = true;
					});
				} else if (getDateDiffFromNow(post.valid_until, $scope.dateFormat) < 0) {
					res = $scope.slide.date = true;
					// test for old date in past
					$timeout(function() {
						$scope.showError.valid_until = true;
					});
				} else {
					$scope.showError.valid_until = false;
				}
			}

			// locations are not unlimited
			if (!post.location_unlimited) {
				// and are empty
				if (!post.locations || !post.locations.length) {
					res = $scope.showError.locations = true;
				}
			}

			return !res;
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
			if (datetime != '') {
				$timeout(function() {
					if (getDateDiffFromNow($scope.post.valid_until, $scope.dateFormat) < 0) {
						$scope.showError.valid_until = true;
					}
				});
			}
		};

		$scope.focusDate = function(datetime) {
			$scope.showError.valid_until = false;
		};

		$scope.processResult = function(data, post) {
			$rootScope.globalLoading = false;

			// if($scope.post._id)
			// 	Notify.addSingleTranslate('NOTIFY.POST_UPDATED_SUCCESFULLY', Notify.T_SUCCESS);
			// else
			// 	Notify.addSingleTranslate('NOTIFY.POST_CREATED_SUCCESFULLY', Notify.T_SUCCESS);
			$timeout(function() {
				$scope.closeThisDialog();
			});

			// emit event into whole app
			$rootScope.$broadcast($scope.isDraft ? 'postCreated' : 'postUpdated', data);

			// $(document.body).scrollTop(0);
			if ($rootScope.isPostActive(data) && $location.path() != '/') {
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
			$scope.sending = false;
			$rootScope.globalLoading = false;
		};

		$scope.publishPost = function(data, post, done) {
			Post.publish({
				id: post._id
			}, function(data) {
				done(data, post);
			}, $scope.processErrorResult);
		};

		$scope.resumePost = function(data, post, done) {
			Post.resume({
				id: post._id
			}, function(data) {
				done(data, post);
			}, $scope.processErrorResult);
		};

		$scope.uploadingNotifierFunc = function(val) {
			$scope.imageUploading = val;
		};

		$scope.save = function(post, activate) {
			var postData;

			if ($scope.imageUploading) return false;

			// hide top "action failed" message
			$scope.showInvalidPostMessage = false;

			if (!$scope.testForm(post)) {
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
					id: $scope.post._id,
					// type: post.type ? 'offer' : 'need'
				}
			);

			postData = $scope.transformDataOut(postData);

			if ($scope.sending) return false;
			$scope.sending = true;
			$rootScope.globalLoading = true;
			$.cookie(POST_LANGUAGE, post.language);

			Post[$scope.isDraft ? 'add' : 'update'](postData, function(data) {
				// if it is save&activate button
				// call prolong or resume endpoints first
				switch (activate && post.state) {
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
			dateFormat = dateFormat.replace(/yyyy/g, 'y');
			dateFormat = dateFormat.replace(/([^y]|y)yy(?!y)/g, '$1y');
			return dateFormat;
		}

		$scope.itemDeleted = function($event, item) {
			if ($scope.post._id == item._id) $scope.closeEdit();
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

		/*		$scope.refreshItemInfo = function($event, item) {
					// if renewed item is this item, refresh him!
					if (item._id === $scope.post._id) {
						$scope.post = $scope.transformDataIn(item);
						$scope.post.type = item.type ? 'offer' : 'need';
					}
				};*/

		var SPACE = 32;
		$scope.toggleCharacterCheckbox = function(event, character) {
			var key = event.keyCode || event.charCode;
			if (key === SPACE) {
				var index = $scope.post.character.indexOf(character.name);
				if (index > -1) {
					$scope.post.character.splice(index, 1);
				} else {
					$scope.post.character.push(character.name);
				}
			}
		};

		$scope.init = function() {
			$scope.newPost = !$scope.post;
			$scope.post = $scope.transformDataIn($scope.post);
			$scope.recountImages();

			if ($scope.preset)
				$scope.post = angular.extend($scope.post, $scope.preset);

			// if post is invalid, show message and run validation (it will show errors in invalid fields)
			if ($scope.isInvalid) {
				$scope.showInvalidPostMessage = true;
				$timeout(function() {
					$scope.testForm($scope.post);
				}, 1000);
			}
		};

		$scope.toggleLockField = function() {
			$scope.enableLockField = $scope.post.current_community_id ||
				$scope.post.related_communities.length ||
				$rootScope.loggedUser.friends_count ||
				$scope.post.is_private;
		};

		$scope.init();

		$scope.$watch('post.related_communities', function(val, old) {
			if (val.length !== old.length && !$scope.post.related_communities.length)
				$scope.post.is_private = false;

			$scope.toggleLockField();
		});

		$scope.$watch('post.current_community_id', function(val, old) {
			if (!!val !== !!old) {
				$scope.post.related_communities = [];
				$scope.post.is_private = false;
				$scope.slide.communities = false;
			}
			$scope.toggleLockField();
		});

		$scope.$watch('post.attachments_attributes', $scope.updateImages, true);
		//$scope.$on('postUpdated', $scope.refreshItemInfo); -- do not update post on save, it is handles automatically (by Ploski, 30.5.2016)
		$scope.$on("itemDeleted", $scope.itemDeleted);
	}
]);