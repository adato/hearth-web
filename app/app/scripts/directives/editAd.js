'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.editAd
 * @description M
 * @restrict E
 */
angular.module('hearth.directives').directive('editad', [
	'$filter', 'LanguageSwitch', 'PostsService', '$analytics', 'Auth',

	function($filter, LanguageSwitch, PostsService, $analytics, Auth) {
		return {
			replace: true,
			restrict: 'E',
			scope: {},
			templateUrl: 'templates/editItem.html', //must not use name ad.html - adBlocker!
			link: function(scope) {
				scope.post = {
					type: 'offer',
					isPrivate: false,
					date: $filter('date')(new Date().getTime() + 30 * 24 * 60 * 60 * 1000, LanguageSwitch.uses() === 'cs' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'),
					sharing_allowed: true,
					locations: [{
						name: ''
					}]
				};

				scope.close = function() {
					scope.$emit('closeNewItem');
				};

				scope.send = function() {
					var eventName, postData, postDataCopy;

					//we need copy, because we change data and don't want to show these changes to user
					postData = angular.extend(
						angular.copy(scope.post), {
							date: dateToTimestamp(scope.post.date)
						}
					);

					postDataCopy = angular.extend(
						angular.copy(postData), {
							author: Auth.getCredentials(),
							updated_at: new Date().toISOString(),
							isPhantom: true
						}
					);

					scope.$emit('adCreated', postDataCopy);

					PostsService.add(postData).then(function(data) {
						scope.$emit('adSaved', data);
					}, function(err) {});

					/*$analytics.eventTrack(eventName, {
						category: 'Posting',
						label: 'NP',
						value: 7
					});*/
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