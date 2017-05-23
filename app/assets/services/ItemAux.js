'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ItemAux
 * @description functions for marketplace items / posts
 */

angular.module('hearth.services').factory('ItemAux', ['$q', 'ngDialog', 'Auth', '$rootScope', 'Post', 'Notify', '$state', 'UserBookmarks', '$analytics',
	function($q, ngDialog, Auth, $rootScope, Post, Notify, $state, UserBookmarks, $analytics) {

		const factory = {
			addItemToBookmarks,
			confirmSuspend,
			getExemplaryPosts,
			hideItem,
			heart,
			postHeartedByUser,
			logCharInfoShown,
			removeItemFromBookmarks,
			replyItem
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

		function getExemplaryPosts() {
			return $q((resolve, reject) => {
				return resolve([
					{
						id: 1,
						title: 'asdf',
					},
					{
						id: 2,
						title: 'qwer'
					}
				])
			})
		}

		/**
		 * Function will hide item from marketplace
		 */
		function hideItem(post, cb) {
			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true);

			$rootScope.globalLoading = true;
			Post.hide({
				id: post._id
			}, res => {
				if ($state.is('market')) {
					$rootScope.$broadcast('itemDeleted', post);
				}

				Notify.addSingleTranslate('NOTIFY.POST_HID_SUCCESFULLY', Notify.T_SUCCESS);
				$rootScope.globalLoading = false;

				cb && cb(post);
			}, err => {
				$rootScope.globalLoading = false;
			});
		}

		/**
		 * Function will add item to users bookmarks
		 */
		function addItemToBookmarks(post) {
			if (post.is_bookmarked) return false;

			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true);

			UserBookmarks.add({
				'postId': post._id
			}, function(res) {
				if (res.ok === true) {
					post.is_bookmarked = !post.is_bookmarked;
					$rootScope.$broadcast('postBookmarked');
					Notify.addSingleTranslate('NOTIFY.POST_BOOKMARKED_SUCCESFULLY', Notify.T_SUCCESS);
				}
			});
		}

		/**
		 * Function will remove item from users bookmarks
		 */
		function removeItemFromBookmarks(post) {
			if (!post.is_bookmarked) return false;

			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true);

			UserBookmarks.remove({
				postId: post._id
			}, function(res) {
				if (res.ok === true) {
					post.is_bookmarked = !post.is_bookmarked;
					$rootScope.$emit('postUnbookmarked', post);
					Notify.addSingleTranslate('NOTIFY.POST_UNBOOKMARKED_SUCCESFULLY', Notify.T_SUCCESS);
					$rootScope.$emit('item.removedFromBookmarks', post);
					$rootScope.$emit('itemList.refresh');
				}
			});
		}

		/**
		 * Function will show modal window with reply form to given post
		 */
		function replyItem(post) {
			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true);

			var scope = $rootScope.$new(true);
			scope.post = post;

			$rootScope.$broadcast('suspendPostWatchers');

			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'itemReply.html',
				controller: 'ItemReply',
				preCloseCallback: function() {
					$rootScope.$broadcast('resumePostWatchers');
				},
				scope: scope,
				closeByDocument: false,
				closeByEscape: true,
				showClose: false
			});
		}

		/**
		 *	function for hearting/unhearting items
		 */
		function heart({ item } = {}) {
			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true);
			if (item.heartLoading) return false;
			item.heartLoading = true;
			Post[item.hearted_by_me ? 'unheart' : 'heart']({ postId: item._id }, {}, res => {
				item.heartLoading = false;
				item.hearted_by_me = !item.hearted_by_me;
				if (item.hearted_by_me) {
					item.hearts.push(res);
				} else {
					for (var i = item.hearts.length;i--;) {
						if (item.hearts[i].user_id === $rootScope.loggedUser._id) {
							item.hearts.splice(i, 1);
							break;
						}
					}
				}
			}, err => {
				item.heartLoading = false;
			});
		}

		function postHeartedByUser({ item, userId }) {

			if (item.hearted_by_me !== void 0) return item.hearted_by_me;

			for (var i = item.hearts.length;i--;) {
				if (item.hearts[i].user_id === userId) {
					item.hearted_by_me = true;
					return postHeartedByUser({ item, userId });
				}
			}
			item.hearted_by_me = false;
			return postHeartedByUser({ item, userId });
		}

		function logCharInfoShown(location, character) {
			$analytics.eventTrack('Character info shown', {
				'Location': location,
				'context': $state.current.name
			});
		}

	}
]);