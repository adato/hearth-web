'use strict';

/**
 * @ngdoc service
 * @name hearth.services.PostScope
 * @description new post scope can be created using this service
 */

angular.module('hearth.services').factory('PostScope', [
	'$rootScope', 'PostServices', '$filter', 'Filter', '$locale', '$analytics', 'LanguageList', 'PostAux', '$state', '$timeout',
	function($rootScope, PostServices, $filter, Filter, $locale, $analytics, LanguageList, PostAux, $state, $timeout) {

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
			scope.logViewActivity = PostAux.logViewActivity
			scope.isInfoGift = PostAux.isInfoGift(post)

			angular.extend(scope, PostServices)

			PostAux.extendForDisplay(scope.item)

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

			$rootScope.$on('post-comment-new', (event, { postId, newComment, commentList }) => {
				if (post._id === postId) post.comments = commentList
			})

			// post address for social links
			scope.postAddress = $rootScope.appUrl + 'post/' + post._id
			scope.isActive = $rootScope.isPostActive(post)

			// is this my post? if so, show controll buttons and etc
			scope.mine = PostAux.isMyPost(scope.item)

			scope.isExpiringSoon = !scope.item.valid_until_unlimited && moment(scope.item.valid_until, moment.ISO_8601).subtract(7, 'days').isBefore(new Date()) && moment(scope.item.valid_until).isAfter(new Date())

			scope.logPostTextToggle = PostAux.logPostTextToggle

			scope.analytics = ev => PostAux.logPostAction(ev, scope)


			scope.max = (num1, num2) => {
				if ((typeof num1 == 'undefined' || num1 === null) && num2) return num2 || 0;
				if ((typeof num2 == 'undefined' || num2 === null) && num1) return num1 || 0;
				return Math.max(num1, num2) || 0;
			}

			return scope
		}

	}
])