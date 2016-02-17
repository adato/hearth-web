'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ItemServices
 * @description
 */

angular.module('hearth.services').factory('ItemServices', [
	'$rootScope', 'Filter',
	function($rootScope, Filter) {
		return {
			showMore: false,
			expanded: false,
			isActive: false,
			showListener: false,
			toggleTag: Filter.toggleTag,

			postTypes: $$config.postTypes,
			replyLabel: $$config.replyLabels,
			replyCountTexts: $$config.replyCountTexts,

			loggedUser: $rootScope.loggedUser,
			isPostActive: $rootScope.isPostActive,
			showLoginBox: $rootScope.showLoginBox,
			pauseToggle: $rootScope.pauseToggle,
			pluralCat: $rootScope.pluralCat,
			deleteItem: $rootScope.deleteItem,
			confirmBox: $rootScope.confirmBox,
			DATETIME_FORMATS: $rootScope.DATETIME_FORMATS,
			toggleReportNotLoggedIn: $rootScope.showLoginBox,
			replyItem: $rootScope.replyItem,
			edit: $rootScope.editItem,
			socialLinks: $rootScope.socialLinks,
			getProfileLink: $rootScope.getProfileLink,
			openReportBox: $rootScope.openReportBox,
			openEmailSharingBox: $rootScope.openEmailSharingBox,
			removeItemFromCommunity: $rootScope.removeItemFromCommunity,
			removeItemFromBookmarks: $rootScope.removeItemFromBookmarks,
			addItemToBookmarks: $rootScope.addItemToBookmarks,
			scrollToElement: $rootScope.scrollToElement,
			removeReminder: $rootScope.removeReminder
		};
	}
]);