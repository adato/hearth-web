'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.itemEdit
 * @description M
 * @restrict E
 */
angular.module('hearth.directives').directive('itemEdit', [
	'$filter', 'LanguageSwitch', 'PostsService', '$analytics', 'Auth', 'Post', 'KeywordsService',

	function($filter, LanguageSwitch, PostsService, $analytics, Auth, Post, KeywordsService) {
		return {
			replace: true,
			restrict: 'E',
			scope: {
				data: '='
			},
			templateUrl: 'templates/directives/itemEdit.html', //must not use name ad.html - adBlocker!
			link: function(scope) {
				scope.languageCode = LanguageSwitch.uses().code;

				var defaultPost = {
					type: 'offer',
					isPrivate: false,
					date: $filter('date')(new Date().getTime() + 30 * 24 * 60 * 60 * 1000, scope.languageCode === 'cs' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'),
					sharing_allowed: true,
					locations: [{
						name: ''
					}],
					attachments_attributes: [],
					name: '',
					title: '',
					keywords: [],
					edit: false
				};

				scope.limits = {
					title: 100
				};

				if (scope.data && scope.data.date) {
					scope.data.date = $filter('date')(scope.data.date, LanguageSwitch.uses() === 'cs' ? 'dd.MM.yyyy' : 'MM/dd/yyyy');
				}

				scope.post = $.extend(angular.copy(defaultPost), scope.data);

				scope.close = function() {
					scope.editForm.$setPristine();
					if (!scope.data) {
						scope.post = angular.copy(defaultPost);
					}

					scope.$emit('closeEditItem');
				};

				scope.transformImagesStructure = function(postDataCopy) {
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

				scope.send = function() {
					var postData, postDataCopy;

					//we need copy, because we change data and don't want to show these changes to user
					postData = angular.extend(
						angular.copy(scope.post), {
							date: dateToTimestamp(scope.post.date),
							id: scope.post._id
						}
					);

					postDataCopy = angular.extend(
						angular.copy(postData), {
							author: Auth.getCredentials(),
							updated_at: new Date().toISOString(),
							reply_count: 0,
							isPhantom: true,
						}
					);

					scope.$emit(scope.data ? 'adUpdated' : 'adCreated', postDataCopy);
					Post[scope.data ? 'update' : 'add'](postData, function(data) {
						scope.$emit('adSaved', data);
					});

					postDataCopy = scope.transformImagesStructure(postDataCopy);
					console.log(postDataCopy.attachments);
					scope.$emit('adCreated', postDataCopy);
					scope.close();

					/*$analytics.eventTrack(eventName, {
						category: 'Posting',
						label: 'NP',
						value: 7
					});*/
				};

				scope.photoUploadSuccessful = function($event) {
					if ($event.target.status === 200) {
						scope.post.attachments_attributes.push(JSON.parse($event.target.response));
					}
				};

				scope.queryKeywords = function($query) {
					return KeywordsService.queryKeywords($query);
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
			}
		};
	}
]);