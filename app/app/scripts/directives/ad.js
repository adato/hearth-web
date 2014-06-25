'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.ad
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('ad', [
	'$timeout', '$translate',

	function($timeout, $translate) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				item: '='
			},
			templateUrl: 'templates/item.html', //must not use name ad.html - adBlocker!
			link: function(scope) {
				var timeout = 6000,
					init = function() {
						angular.extend(scope, {
							edit: false,
							message: '',
							agree: true,
							submited: false,
							reported: false
						});
						scope.replyForm.$setPristine();
					},
					type = {
						user: {
							need: 'I_WISH',
							offer: 'I_GIVE'
						},
						community: {
							need: 'WE_NEED',
							offer: 'WE_GIVE'
						}
					};

				scope.$watch('item', function(item) {
					var url = window.location.href.replace(window.location.hash, ''),
						typeText = $translate(item.community_id ? type.community[item.type] : type.user[item.type]);

					if (item) {
						url += '%23/ad/' + item._id;
					}

					angular.extend(scope, {
						facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
						gplus: 'https://plus.google.com/share?url=' + url,
						twitter: 'https://twitter.com/share?url=' + url,
						mail: 'mailto:?subject=' + typeText + ': ' + item.title + '&body=' + item.name
					});
				});

				scope.report = function() {
					scope.$emit('report', {
						id: scope.item._id
					});
					scope.reported = true;
					$timeout(function() {
						scope.reported = false;
					}, timeout);
				};

				scope.sendReply = function() {
					scope.$emit('sendReply', {
						id: scope.item._id,
						message: scope.message,
						agreed: scope.agree
					});
					scope.submited = true;
					$timeout(init, timeout);
				};
				scope.cancelEdit = function() {
					init();
				};
				init();
			}

		};
	}
]);