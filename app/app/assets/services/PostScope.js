'use strict';

/**
 * @ngdoc service 
 * @name hearth.services.PostScope
 * @description new post scope can be created using this service
 */

angular.module('hearth.services').service('PostScope', [
	'$rootScope', 'ItemServices', '$filter', 'Filter', '$locale', '$analytics',
	function($rootScope, ItemServices, $filter, Filter, $locale, $analytics) {

		function getPostScope(post, $scope) {
			var author = post;
			if (post._type == 'Post') author = post.author;

			// creates new isolated scope 
			var scope = $scope.$new(true);

			scope.keywords = $scope.keywordsActive;
			scope.item = post;
			scope.toggleTag = Filter.toggleTag;
			scope.foundationColumnsClass = 'large-10';
			scope.showSharing = false;
			scope.delayedView = true;
			scope.language = $rootScope.language;
			angular.extend(scope, ItemServices);

			scope.item.updated_at_date = $filter('date')(scope.item.updated_at, $locale.DATETIME_FORMATS.medium);
			scope.item.text_parsed = $filter('nl2br')($filter('linky')(scope.item.text));
			scope.item.text_short = $filter('ellipsis')(scope.item.text, 270, true);
			scope.item.text_short_parsed = $filter('linky')(scope.item.text_short);

			var timeout = null;
			var updateTimeAgo = function() {
				scope.item.updated_at_timeago = $filter('ago')(scope.item.updated_at);
				timeout = setTimeout(updateTimeAgo, 30000); // every few seconds refresh timeago dates
			}
			setTimeout(updateTimeAgo, 1000); // run it later

			var updateRepliedBy = function() {
				scope.item.replied_by_string = $filter('translate')(scope.replyCountTexts[scope.item.type] + '.' + scope.pluralCat(scope.item.reply_count), {
					value: scope.item.reply_count
				});
			}
			updateRepliedBy();
			scope.$on('postUpdateRepliedBy', updateRepliedBy);

			scope.$on('$destroy', function() {
				clearTimeout(timeout);
			});

			// post address for social links
			scope.postAddress = $rootScope.appUrl + 'post/' + post._id;
			scope.isActive = $rootScope.isPostActive(post);

			// is this my post? if so, show controll buttons and etc
			scope.mine = scope.item.owner_id === (($rootScope.user) ? $rootScope.user._id : null);

			scope.isExpiringSoon = !scope.item.valid_until_unlimited && moment(scope.item.valid_until, moment.ISO_8601).subtract(7, 'days').isBefore(new Date()) && moment(scope.item.valid_until).isAfter(new Date());


			scope.analytics = function(event) {
				$analytics.eventTrack(event + ' (Post)', {
					'is_mine': scope.mine,
					'type': scope.item.type,
					'exact_type': scope.item.exact_type,
				});
			}

			return scope;
		}

		return {
			'getPostScope': getPostScope
		};
	}
]);