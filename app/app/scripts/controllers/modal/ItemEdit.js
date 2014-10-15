'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('ItemEdit', [
	'$scope', '$rootScope', 'Auth', 'Errors', '$filter', 'LanguageSwitch', 'Post', '$element', '$timeout',
	function($scope, $rootScope, Auth, Errors, $filter, LanguageSwitch, Post, $element, $timeout) {
		$scope.defaultPost = {
			type: 'offer',
			keywords: [],
			date: $filter('date')(new Date().getTime() + 30 * 24 * 60 * 60 * 1000, LanguageSwitch.uses().code === 'cs' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'),
			locations: [{
				name: ''
			}],
			location_unlimited: false,
			valid_until_unlimited: false,
			attachments_attributes: [],
			// is_active: false
		};
		$scope.showFiles = false;
		$scope.showError = {
			title: false,
			text: false,
			locations: false,
			date: false
		};

		$scope.sending = false;
		$scope.pauseSending = false;

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

			$scope.showError.date = false;

			// $scope.post.valid_until_unlimited = !$scope.post.valid_until_unlimited;
			if (!$scope.post.valid_until_unlimited) {

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
			$scope.$apply();
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

			return data;
		};

		$scope.testForm = function(post) {
			var res = true;
			
			if($scope.createAdForm.title.$invalid) {
				res = false;
				$scope.showError.title = true;
			}

			if($scope.createAdForm.text.$invalid) {
				res = false;
				$scope.showError.text = true;
			}

			if(post.date == '' && !post.valid_until_unlimited) {
				res = false;
				$scope.showError.date = true;
			}
			
			if(post.locations && ! post.location_unlimited) {

				post.locations.forEach(function(item) {

					if(item.name == '') {
						res = false;
						$scope.showError.locations = true;
					}
				});
			}

			return res;
		};

		$scope.save = function() {
			var postData, postDataCopy;

			if(! $scope.testForm($scope.post)) {
				return false;
			}

			//we need copy, because we change data and don't want to show these changes to user
			postData = angular.extend(
				angular.copy($scope.post), {
					date: dateToTimestamp($scope.post.date, true),
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

			Post[$scope.post._id ? 'update' : 'add'](postData, function(data) {
				$scope.sending = false;

				postDataCopy = $scope.transformImagesStructure(postDataCopy);
				// $rootScope.$broadcast($scope.post._id ? 'adUpdated' : 'adCreated', postDataCopy);

				// $scope.$emit('adSaved', data);
				
				$rootScope.$broadcast('postCreated');
				$(document.body).scrollTop(0);
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

        // when edited, we should change also original post
        $scope.setPostActiveStateCallback = function(post) {

        	$scope.postOrig.is_active = post.is_active;
        	$scope.postOrig.is_expired = post.is_expired;
        };

		function transformDataIn(post) {
			if (post) {
				post.dateOrig = post.date;
				post.date = $filter('date')(post.date, LanguageSwitch.uses().code === 'cs' ? 'dd.MM.yyyy' : 'MM/dd/yyyy');
				if(post.valid_until_unlimited) {
					post.date = '';
				}

				post.name = $.trim(post.name);

				if (!post.locations || !post.locations.length || post.location_unlimited) {
					post.locations = [{
						name: ''
					}];
				}
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