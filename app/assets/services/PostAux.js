'use strict';

/**
 * @ngdoc service
 * @name hearth.services.PostAux
 * @description functions for marketplace items / posts
 */

angular.module('hearth.services').factory('PostAux', ['$q', 'ngDialog', 'Auth', '$rootScope', 'Post', 'Notify', '$state', 'UserBookmarks', '$analytics', '$templateCache', '$locale', '$filter', '$sce',
	function($q, ngDialog, Auth, $rootScope, Post, Notify, $state, UserBookmarks, $analytics, $templateCache, $locale, $filter, $sce) {

		const postTypes = $$config.postTypes

		const factory = {
			addPostToBookmarks,
			confirmSuspend,
			extendForDisplay,
			getExemplaryPosts,
			getExemplaryPostsOpts,
			getRecommendedPostsOpts,
			getPostTypeCode,
			hideItem,
			heart,
			isMyPost,
			isPostActive,
			logCharInfoShown,
			logPostAction,
			logPostTextToggle,
			logViewActivity,
			postHeartedByUser,
			postInaccessibleModal,
			removePostFromBookmarks,
			replyItem,
			detectEmbed
		}

		return factory

		/////////////////////

		function confirmSuspend(post, scope) {
			scope.post = post
			ngDialog.open({
				template: $$config.modalTemplates + 'postSuspend.html',
				controller: 'PostSuspend',
				scope: scope,
				data: post,
				className: 'ngdialog-theme-default',
				closeByDocument: false,
				showClose: false,
				closeByEscape: true,
			})
		}

		function extendForDisplay(post) {
			post.updated_at_timeago = $filter('ago')(post.updated_at)
			post.updated_at_date = $filter('date')(post.updated_at, $locale.DATETIME_FORMATS.medium)
			post.text_parsed = $filter('nl2br')($filter('linky')(post.text, '_blank'))
			post.text_short = $filter('ellipsis')(post.text, 270, true)
			post.text_short_parsed = $filter('linky')(post.text_short, '_blank')
			post.embeds = detectEmbed(post);
		}

		function getExemplaryPosts() {
			return $q((resolve, reject) => {
				Post.exemplaryPosts({lang: $rootScope.language}, res => {
					return resolve(res.data)
				}, err => {
					const epError = 'Error during exemplary-posts fetch: ' + ( (() => { try{ return JSON.stringify(err) } catch (e) { return err } })() )
					Rollbar.error(epError)
					console.warn(erError)
				})
			})
		}

		function getExemplaryPostsOpts(posts) {
			this.template = $templateCache.get('assets/components/post/posts/exemplaryPosts.html')
			this.topListOptions = {
				disableLoading: true,
			  	getData: () => {return $q((resolve, reject) => resolve([...posts.main, ...posts.additional]))},
			  	templateUrl: 'assets/components/post/posts/post.html',
				bindToScope: {viewActivityMeta: {context: 'exemplary'}}
			}
      		// this.addListOptions = {
			// 	disableLoading: true,
			// 	getData: () => {return $q((resolve, reject) => resolve(posts.additional))},
			// 	isEmpty: !posts.additional.length,
			// 	templateUrl: 'assets/components/post/posts/post.html',
			// }
		}


		function getRecommendedPostsOpts(posts) {
			return {
				template: $templateCache.get('assets/components/post/posts/exemplaryPosts.html'),
				topListOptions: {
					disableLoading: true,
			  		getData: () => {return $q((resolve, reject) => resolve(posts))},
			  		templateUrl: 'assets/components/post/posts/post.html',
					bindToScope: {viewActivityMeta: {context: 'recommended'}}
				}
			}
		}

		/**
	   *
	   * @param author - e.g. user,community
	   * @param type - e.g. offer,need
	   * @param exact_type - e.g. loan,gift,any
	   * @returns post type code
	   */
		function getPostTypeCode(author, type, exact_type) {
			return postTypes[author][exact_type][type]
		}

		/**
		 * Function will hide post from marketplace
		 */
		function hideItem(post, cb) {
			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true)

			$rootScope.globalLoading = true
			Post.hide({
				id: post._id
			}, res => {
				if ($state.is('market')) {
					$rootScope.$broadcast('itemDeleted', post)
				}

				Notify.addSingleTranslate('NOTIFY.POST_HID_SUCCESFULLY', Notify.T_SUCCESS)
				$rootScope.globalLoading = false

				cb && cb(post)
			}, err => {
				$rootScope.globalLoading = false
			})
		}

		/**
		 * Function will add item to users bookmarks
		 */
		function addPostToBookmarks(post) {
			if (post.is_bookmarked) return false

			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true)

			UserBookmarks.add({
				'postId': post._id
			}, function(res) {
				if (res.ok === true) {
					post.is_bookmarked = !post.is_bookmarked
					$rootScope.$broadcast('postBookmarked')
					Notify.addSingleTranslate('NOTIFY.POST_BOOKMARKED_SUCCESFULLY', Notify.T_SUCCESS)
				}
			})
		}

		/**
		 * Function will remove item from users bookmarks
		 */
		function removePostFromBookmarks(post) {
			if (!post.is_bookmarked) return false

			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true)

			UserBookmarks.remove({
				postId: post._id
			}, function(res) {
				if (res.ok === true) {
					post.is_bookmarked = !post.is_bookmarked
					$rootScope.$emit('postUnbookmarked', post)
					Notify.addSingleTranslate('NOTIFY.POST_UNBOOKMARKED_SUCCESFULLY', Notify.T_SUCCESS)
					$rootScope.$emit('item.removedFromBookmarks', post)
					$rootScope.$emit('itemList.refresh')
				}
			})
		}

		/**
		 * Function will show modal window with reply form to given post
		 */
		function replyItem(post) {
			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true)

			var scope = $rootScope.$new(true)
			scope.post = post

			$rootScope.$broadcast('suspendPostWatchers')

			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'postReply.html',
				controller: 'PostReply',
				preCloseCallback: function() {
					$rootScope.$broadcast('resumePostWatchers')
				},
				scope: scope,
				closeByDocument: false,
				closeByEscape: true,
				showClose: false
			})
		}

		/**
		 *	function for hearting/unhearting items
		 */
		function heart({ item } = {}) {
			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true)
			if (item.heartLoading) return false
			item.heartLoading = true
			Post[item.hearted_by_me ? 'unheart' : 'heart']({ postId: item._id }, {}, res => {
				item.heartLoading = false
				item.hearted_by_me = !item.hearted_by_me
				if (item.hearted_by_me) {
					item.hearts.push(res)
				} else {
					for (var i = item.hearts.length;i--;) {
						if (item.hearts[i].user_id === $rootScope.loggedUser._id) {
							item.hearts.splice(i, 1)
							break
						}
					}
				}
			}, err => {
				item.heartLoading = false
			})
		}

		function isMyPost(post = {}) {
			return post.owner_id === ($rootScope.user && $rootScope.user._id)
		}

		function isPostActive(post = {}) {
			// this gets called way too often
			// console.log(post)
			return post.state === 'active'
		}

		function postHeartedByUser({ post, userId }) {
			if (post.hearted_by_me !== void 0) return post.hearted_by_me

			for (var i = post.hearts.length;i--;) {
				if (post.hearts[i].user_id === userId) {
					post.hearted_by_me = true
					return postHeartedByUser({ post, userId })
				}
			}
			post.hearted_by_me = false
			return postHeartedByUser({ post, userId })
		}

		function postInaccessibleModal() {
			$rootScope.confirmBox({title: 'POST.INACCESSIBLE.HEADER', text: 'POST.INACCESSIBLE.TEXT', hideCancel: true})
		}

		function logCharInfoShown(location, character) {
			$analytics.eventTrack('Character info shown', {
				'Location': location,
				'context': $state.current.name
			})
		}

		function logPostAction(event, scope) {
			$analytics.eventTrack(event + ' (Post)', {
				'is_mine': scope.mine,
				'type': scope.item.type,
				'exact_type': scope.item.exact_type,
			})
		}

		/**
		 *	@param {String} action - [expanded|collapsed]
		 */
		function logPostTextToggle({ action, post }) {
			$analytics.eventTrack('Post text length ' + action , {
				post_id: post._id
			})
		}

		/**
		 *	Function that logs to mixpanel that a post has been viewed
		 *	Logs the posts ID and the current url
		 */
		function logViewActivity({item, meta = {context: 'default'}, state}) {
	    if (meta.context !== 'default' && ['market', 'dashboard'].indexOf(state) < 0) console.warn('invalid combo', item, meta, state)
			$analytics.eventTrack('post-viewed', angular.merge({}, meta, {
				id: item._id,
	      state
			}))
		}


		/** 
		 * Function to detect if post has any youtube embed 
		 * @returns [] array of embed links
		 */
		function detectEmbed(item) {
			let embeds = [], match;
			if (!item || !item.text) return embeds;
			
			let regExp = /(http[s]?\:\/\/|www\.)*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?\s">]*)/;
			let reg2 = /(<a[^<]+<\/a>)/g;
			let replFn = (match, p1, p2, p3, offset, string) => {
				match = regExp.exec(p1);
				if (match && match[3].length == 11) {
					// success, we have YT video link here, lets replace it
					// with an actual embed
					return '<iframe class="embed-youtube" width="460" height="315" src="//www.youtube.com/embed/' 
					+ match[3] + '" frameborder="0" allowfullscreen></iframe>';
				} else {
					return p1;
				}

			}

			item.text_short_parsed = $sce.trustAsHtml(item.text_short_parsed.replace(reg2, replFn));
			item.text_parsed = $sce.trustAsHtml(item.text_parsed.replace(reg2, replFn));
		}

	}
])