'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ItemAux
 * @description functions for marketplace items / posts
 */

angular.module('hearth.services').factory('ItemAux', ['ngDialog', 'Auth', '$rootScope', 'Post', 'Notify', '$state', 'UserBookmarks',
	function(ngDialog, Auth, $rootScope, Post, Notify, $state, UserBookmarks) {

		var factory = {
			confirmSuspend: confirmSuspend,
			hideItem: hideItem,
			replyItem: replyItem
		};

		return factory;

		/////////////////////

		function confirmSuspend(item, scope) {
			scope.item = item;
			ngDialog.open({
				template: $$config.modalTemplates + 'suspendItem.html',
				controller: 'ItemSuspend',
				scope: scope,
				data: item,
				className: 'ngdialog-theme-default',
				closeByDocument: false,
				showClose: false,
				closeByEscape: true,
			});
		}

		/**
		 * Function will hide item from marketplace
		 */
		function hideItem(post, cb) {
			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			$rootScope.globalLoading = true;
			Post.hide({
				id: post._id
			}, function(res) {
				if ($state.is('market')) {
					$rootScope.$broadcast('itemDeleted', post);
				}

				Notify.addSingleTranslate('NOTIFY.POST_HID_SUCCESFULLY', Notify.T_SUCCESS);
				$rootScope.globalLoading = false;

				cb && cb(post);
			}, function() {
				$rootScope.globalLoading = false;
			});
		}

		/**
		 * Function will add item to users bookmarks
		 */
		function addItemToBookmarks(post) {
			if (post.is_bookmarked)
				return false;

			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			UserBookmarks.add({
				'postId': post._id
			}, function(res) {
				if (res.ok === true) {
					post.is_bookmarked = !post.is_bookmarked;
					Notify.addSingleTranslate('NOTIFY.POST_BOOKMARKED_SUCCESFULLY', Notify.T_SUCCESS);
				}
			});
		}

		/**
		 * Function will remove item from users bookmarks
		 */
		function removeItemFromBookmarks(post) {
			if (!post.is_bookmarked)
				return false;

			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			UserBookmarks.remove({
				'postId': post._id
			}, function(res) {
				if (res.ok === true) {
					post.is_bookmarked = !post.is_bookmarked;
					Notify.addSingleTranslate('NOTIFY.POST_UNBOOKMARKED_SUCCESFULLY', Notify.T_SUCCESS);
				}
			});
		}

		/**
		 * Function will show modal window with reply form to given post
		 */
		function replyItem(post) {
			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			var scope = $rootScope.$new(true);
			scope.post = post;

			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'itemReply.html',
				controller: 'ItemReply',
				scope: scope,
				closeByDocument: false,
				closeByEscape: true,
				showClose: false
			});
		}

	}
]);