'use strict';

/**
 * @ngdoc service
 * @name hearth.services.PostScope
 * @description new post scope can be created using this service
 */

angular.module('hearth.services').factory('PostScope', [
	'$rootScope', 'ItemServices', '$filter', 'Filter', '$locale', '$analytics', 'LanguageList', 'ItemAux', 'PostUtils', '$state',
	function($rootScope, ItemServices, $filter, Filter, $locale, $analytics, LanguageList, ItemAux, PostUtils, $state) {

		const factory = {
			getPostScope
		}

		return factory

		////////////////

		function getPostScope(post, $scope) {
			var author = post
			if (post._type == 'Post') author = post.author

			// creates new isolated scope
			var scope = $scope.$new(true)

			scope.config = $rootScope.config
			scope.stateName = $state.current.name
			scope.keywords = $scope.keywordsActive
			scope.item = post
			scope.toggleTag = Filter.toggleTag
			scope.foundationColumnsClass = 'large-10'
			scope.showSharing = false
			scope.delayedView = true
			scope.language = $rootScope.language
			scope.postLanguage = LanguageList.translate(post.language)
			scope.logViewActivity = PostUtils.logViewActivity
			angular.extend(scope, ItemServices)

			ItemAux.extendForDisplay(scope.item)

			var timeout = null;
			var updateTimeAgo = function() {
				scope.item.updated_at_timeago = $filter('ago')(scope.item.updated_at)
				timeout = setTimeout(updateTimeAgo, 30000) // every few seconds refresh timeago dates
			}
			setTimeout(updateTimeAgo, 1000) // run it later

			var updateRepliedBy = function() {
				scope.item.replied_by_string = $filter('translate')(scope.replyCountTexts[scope.item.type] + '.' + scope.pluralCat(scope.item.reply_count), {
					value: scope.item.reply_count
				})
			}
			updateRepliedBy()
			scope.$on('postUpdateRepliedBy', updateRepliedBy)

			scope.$on('$destroy', () => clearTimeout(timeout))

			// post address for social links
			scope.postAddress = $rootScope.appUrl + 'post/' + post._id
			scope.isActive = $rootScope.isPostActive(post)

			// is this my post? if so, show controll buttons and etc
			scope.mine = ItemAux.isMyPost(scope.item)

			scope.isExpiringSoon = !scope.item.valid_until_unlimited && moment(scope.item.valid_until, moment.ISO_8601).subtract(7, 'days').isBefore(new Date()) && moment(scope.item.valid_until).isAfter(new Date())

			scope.logPostTextToggle = ItemAux.logPostTextToggle

			scope.analytics = ev => ItemAux.logPostAction(ev, scope)

			return scope
		}

	}
])