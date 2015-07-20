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
				rating: "="
			},
			templateUrl: 'templates/directives/ratingReply.html',
			link: function(scope, el, attrs) {
				var sendingReply = false;
				scope.showError = false;

				scope.closeReply = function(rating) {
					scope.reply = '';
					scope.rating.formOpened = false;
				};

				scope.sendReply = function(text) {
					scope.showError = false;
					
					if(sendingReply) return;
					sendingReply = true;

					console.log("AAA");
					if(!text) {
						sendingReply = false;
						scope.showError = true;
						return false;
					}
					
					scope.rating.comment = {
					    "created_at": "2014-02-20T13:28:53.756Z",
					    "updated_at": "2014-02-20T13:28:53.756Z",
					    "text": "comment for rating",
					    "user": {} // Author of comment
					};
					scope.closeReply();

					// Ratings.add({comment: text, _id: scope.rating._id}, function(res) {
					// 	scope.rating.comment = text;
					// 	Notify.addSingleTranslate('NOTIFY.RATING_REPLY_SUCCESS', Notify.T_SUCCESS);
					// }, function(err) {
					// 	Notify.addSingleTranslate('NOTIFY.RATING_REPLY_FAILED', Notify.T_ERROR);
					// });
				};

				scope.$watch('rating', function(val) {
					console.log(val);
				});
			}
		};
	}
]);