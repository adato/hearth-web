'use strict';

/**
 * @ngdoc service 
 * @name hearth.services.PostScope
 * @description new post scope can be created using this service
 */

angular.module('hearth.services').service('PostScope', [
	'$rootScope', 'ItemServices', '$filter', 'Filter', '$locale',
	function($rootScope, ItemServices, $filter, Filter, $locale) {

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

			scope.item.text_short = $filter('ellipsis')(scope.item.text, 270, true);
			scope.item.updated_at_date = $filter('date')(scope.item.updated_at, $locale.DATETIME_FORMATS.medium);

			var timeout = null;
			var updateTimeAgo = function() {
				scope.item.updated_at_timeago = $filter('ago')(scope.item.updated_at);
				timeout = setTimeout(updateTimeAgo, 30000); // every few seconds refresh timeago dates
			}
			setTimeout(updateTimeAgo, 1000); // run it later

			scope.$on('$destroy', function() {
				clearTimeout(timeout);
			});

			// post address for social links
			scope.postAddress = $rootScope.appUrl + 'post/' + post._id;
			scope.isActive = $rootScope.isPostActive(post);

			// is this my post? if so, show controll buttons and etc
			scope.mine = scope.item.owner_id === (($rootScope.user) ? $rootScope.user._id : null);

			scope.isExpiringSoon = !scope.item.valid_until_unlimited && moment(scope.item.valid_until, moment.ISO_8601).subtract(7, 'days').isBefore(new Date()) && moment(scope.item.valid_until).isAfter(new Date());
			return scope;
		}

		return {
			'getPostScope': getPostScope
		};
	}
]);