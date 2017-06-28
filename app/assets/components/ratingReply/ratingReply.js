'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.ratingReply
 * @description
 * @restrict A
 */

angular.module('hearth.directives').directive('ratingReply', [
	'$rootScope', 'Ratings', 'Notify',
	function($rootScope, Ratings, Notify) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				ratingItem: "="
			},
			templateUrl: 'assets/components/ratingReply/ratingReply.html',
			link: function(scope, el, attrs) {
				var sendingReply = false;
				scope.showError = false;
				scope.getProfileLink = $rootScope.getProfileLink;

				scope.closeReply = function() {
					scope.reply = '';
					scope.ratingItem.formOpened = false;
				};

				scope.sendReply = function(text) {
					scope.showError = false;

					if (sendingReply) return;
					sendingReply = true;

					if (!text) {
						sendingReply = false;
						scope.showError = true;
						return false;
					}

					Ratings.add({
						comment: {
							text: text
						},
						_id: scope.rating._id
					}, function(res) {
						scope.rating.comment = res;
						scope.closeReply();
						Notify.addSingleTranslate('PROFILE.RATING.NOTIFY.SUCCESS_RATING_REPLY', Notify.T_SUCCESS);
					});
				};
			}
		};
	}
]);
