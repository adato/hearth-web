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
				item: '=',
				user: '='
			},
			templateUrl: 'templates/directives/item.html', //must not use name ad.html - adBlocker!
			link: function(scope, element) {
				var timeout = 6000,
					init = function() {
						angular.extend(scope, {
							replyEdit: false,
							message: '',
							agree: true,
							submited: false,
							reported: false
						});
						if (scope.replyForm) {
							scope.replyForm.$setPristine();
						}
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
					scope.mine = scope.item.author._id === scope.user._id;
					if (item.author.locations && item.author.locations[0] && !item.author.locations[0].name) {
						item.author.locations = [];
					}
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
					scope.item.reply_count = scope.item.reply_count + 1;
				};
				scope.cancelEdit = function() {
					init();
				};

				scope.startEditReply = function() {
					scope.replyEdit = true;
				};

				scope.edit = function() {
					scope.$emit('editAd', scope.item._id);
					scope.adEdit = true;
				};

				scope.remove = function() {
					scope.$emit('removeAd', scope.item._id);
					$('#confirm-delete').foundation('reveal', 'close');
				};

				scope.cancel = function() {
					$('#confirm-delete').foundation('reveal', 'close');
				};

				scope.$on('closeEditItem', function() {
					scope.adEdit = false;
				});

				scope.$on('adCreated', function($event, data) {
					scope.adEdit = false;
				});

				init();

				if (scope.item.author && scope.item.author.avatar.normal) {
					element.find('.img').css('background-image', 'url(' + scope.item.author.avatar.normal + ')');
				}
			}

		};
	}
]);