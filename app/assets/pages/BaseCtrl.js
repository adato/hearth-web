'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.BaseCtrl
 * @description
 */

angular.module('hearth.controllers').controller('BaseCtrl', [
	'$scope', '$locale', '$rootScope', '$location', 'Auth', 'ngDialog', '$timeout', '$interval', '$element', 'CommunityMemberships', '$window', 'Post', 'Tutorial', 'Notify', 'Messenger', 'timeAgoService', 'ApiHealthChecker', 'PageTitle', '$state', 'UserBookmarks', 'User', '$analytics', 'Rights', 'ScrollService', 'ConversationAux', 'UnauthReload', 'Session', 'PostAux',
	function($scope, $locale, $rootScope, $location, Auth, ngDialog, $timeout, $interval, $element, CommunityMemberships, $window, Post, Tutorial, Notify, Messenger, timeAgoService, ApiHealthChecker, PageTitle, $state, UserBookmarks, User, $analytics, Rights, ScrollService, ConversationAux, UnauthReload, Session, PostAux) {
		var timeout;
		var itemEditOpened = false;
		$rootScope.myCommunities = [];
		$rootScope.pageName = '';
		$rootScope.searchQuery = {
			query: null,
			type: 'post'
		};
		$rootScope.appUrl = '';
		$rootScope.addressOld = '';
		$rootScope.addressNew = '';
		$rootScope.pageChangeWithScroll = true;
		$scope.segment = false;
		$rootScope.searchBarDisplayed = false;
		$rootScope.socialLinks = {
			facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
			gplus: 'https://plus.google.com/share?url=',
			twitter: 'https://twitter.com/share?url='
		};

		// enable $state to be used in tempaltes
		$rootScope.$state = $state;
		//$rootScope.$on('$stateChangeNotFound')

		$rootScope.missingPost = false;
		$rootScope.cacheInfoBox = {};

		// init globalLoading
		$rootScope.globalLoading = false;
		$rootScope.topArrowText = {};
		$scope.isScrolled = false;

		// expose scroll service functions
		$rootScope.scrollToElement = ScrollService.scrollToElement;
		$rootScope.top = ScrollService.scrollTop;
		$rootScope.scrollToError = ScrollService.scrollToError;

		$rootScope.reloadPage = function() {
			window.location = document.URL;
		};

		// expose some maintenance page functions
		// TODO: whole maintenance should be encapsulated in some component
		$rootScope.checkOnlineState = ApiHealthChecker.checkOnlineState
		$rootScope.closeMaintenanceNotify = ApiHealthChecker.closeNotify

		$scope.setPageTitle = function(state) {
			// var state = $state.$current;
			if (state.titleIgnore) return;
			// set new page title
			if (state.title === false)
				PageTitle.set(PageTitle.getDefault());
			else if ($rootScope.language) {
				PageTitle.setTranslate('TITLE.' + (state.title || state.name));
			}

		};

		$rootScope.dontScrollTopAfterPageChange = function() {
			$rootScope.pageChangeWithScroll = false;
		};

		var locationSearch;
		var searchParamsRetainer = {
			'messages': 1,
			'messages.new': 1,
			'messages.detail': 1
		};

		/**
		 * When started routing to another page, compare routes and if they differ
		 * scroll to top of the page, if not, refresh page with fixed height
		 */
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState) {

			if (toState.policy) {
				if (toState.policy === $window.$$config.policy.SIGNED_IN && !Auth.isLoggedIn()) {
					event.preventDefault()

					// here we store a location to the state to which we wanted to go which will
					// be used by login ctrl upon successful login
					UnauthReload.setLocation($state.href(toState, toParams))

					// we need to replace the current history entry so that we can always push the browser back button
					// and not wind up on login again
					return $state.go('login', {}, {location: 'replace'})

				} else if (toState.policy === $window.$$config.policy.UNAUTH && Auth.isLoggedIn()) {
					event.preventDefault()
					return $state.go('market')
				} else if (toState.policy === $window.$$config.policy.ADMIN && !Rights.userHasRight('admin.access')) {
					event.preventDefault()
					return $state.go('market')
				}
			}

			// retain optional state params on specified route groups
			if (toState && fromState && searchParamsRetainer[fromState.name] && searchParamsRetainer[fromState.name] === searchParamsRetainer[toState.name]) {
				locationSearch = $location.search()
			} else {
				locationSearch = void 0
			}

			// if a new version is available - make a reload to the target state instead of just a state change
			if (ApiHealthChecker.shouldReload()) {
				event.preventDefault()
				return $window.location = $state.href(toState, toParams)
			}

			// when changed route, load conversation counters
			//Auth.isLoggedIn() && Messenger.loadCounters();
			ngDialog.close()

			//close small-resolution menu
			$rootScope.leftSidebarShown = false

			if (!$rootScope.pageChangeWithScroll) {
				// dont scroll top after page change
				$rootScope.pageChangeWithScroll = true
				return
			}

			if (!$rootScope.addressNew) return $rootScope.top(0, 1)

			$rootScope.addressOld = $rootScope.addressNew
			$rootScope.addressNew = toState.originalPath

			var r1 = $rootScope.addressOld.split($$config.basePath)
			var r2 = $rootScope.addressNew.split($$config.basePath)

			// if first element in URL of old page is not same as first element in URL of new page
			// scroll to top - (alias scroll when we come to new URL)
			if (r1.length < 2 || r2.length < 2 || r1[1] != r2[1]) {
				$rootScope.top(0, 1)
			}
		})

		$rootScope.$on("initLanguageSuccess", $scope.setPageTitle);

		/**
		 * After routing finished, set current page segment to variable - used somewhere else
		 * and add class of given controller to wrapping div container
		 */
		$rootScope.$on("$stateChangeSuccess", function(ev, current) {

			if (locationSearch) $location.search(locationSearch)

			$rootScope.pageName = $state.current.name
			$scope.segment = current.name

			// TODO: what is this even good for?
			$("#all").removeClass()
			$("#all").addClass(current.controller)

			$scope.setPageTitle(current)
		})


		/**
		 * This will set up rollbar person
		 * Depends on $windo.Rollbar !!
		 */
		$rootScope.$on("initSessionSuccess", function(event, user) {
			if (!$window.Rollbar) return

			$window.Rollbar.configure({
				payload: {
					person: {
						id: user._id,
						username: user.name,
						// email is not reachable in session`s user variable, so we omit it
						email: user.email
					}
				}
			})
		})

		/**
		 * When submitted fulltext search
		 */
		$scope.search = searchQuery => {
			if (!searchQuery.query) {
				$("#search").focus()
				return false
			}
			$rootScope.toggleSearchBar(false) // turn off search input
			$rootScope.top(0, 1)
			$state.go('search', {
				query: searchQuery.query,
				// type: searchQuery.type
			})
			searchQuery.query = null
		}

		/**
		 * Set value of fulltext search
		 */
		$rootScope.setFulltextSearch = function(val) {
			$timeout(() => {
				$("#searchBox").val(val)
			})
		}

		/**
		 * Return profile of item based on its type (community, user, post)
		 */
		$rootScope.getActivityLink = function(object, target_object) {
			if (target_object) return $rootScope.getProfileLink(target_object._type, target_object._id)
			return $rootScope.getProfileLink(object._type, object._id)
		}

		/**
		 * Return profile of item based on its type and id
		 */
		$rootScope.getProfileLink = function(type, id, fullPath) {
			return (fullPath ? $$config.appUrl : $$config.basePath) + $$config.itemAddresses[type] + '/' + id
		}


		/**
		 * Refresh user to given path
		 */
		$rootScope.refreshToPath = function(path) {
			window.location = path || document.URL
		}

		$rootScope.isMine = function(author_id) {
			return $scope.loggedUser && author_id === $scope.loggedUser._id
		}

		angular.element(window).bind('scroll', function() {
			if ($(window).scrollTop() > 0 !== $scope.isScrolled) {
				$('html').toggleClass('scrolled');
				$scope.isScrolled = !$scope.isScrolled;
			}
		});

		function loadMyCommunities() {
			CommunityMemberships.get({
				user_id: $rootScope.loggedUser._id
			}, function(res) {
        $rootScope.myCommunities.length = 0;
        $rootScope.myCommunities.push(...res);
				$rootScope.myAdminCommunities = [];
				res.forEach(function(item) {
					// create list of communities I'm admin in
					if (item.admin == $rootScope.loggedUser._id) $rootScope.myAdminCommunities.push(item);
				});

				$rootScope.$emit('communities:loaded');
				$rootScope.communitiesLoaded = true;
			});
		};

		// try to load tutorial pages - if there is any, show tutorial
		$scope.checkTutorial = function() {
			// check only after login
			if ($.cookie('tutorial') === '1') {

				$.removeCookie('tutorial');
				Tutorial.get({
					user_id: $rootScope.loggedUser._id
				}, function(res) {
					if (res.length) $rootScope.showTutorial(res);
				});
			}
		};

		$scope.initHearthbeat = function() {
			$rootScope.pluralCat = $locale.pluralCat;

			$rootScope.DATETIME_FORMATS = $locale.DATETIME_FORMATS;
			$rootScope.appUrl = $$config.appUrl;

			if ($rootScope.loggedUser._id) {
				loadMyCommunities();
				$scope.checkTutorial();
			} else {
				// set to check tutorial after next login
				$.cookie('tutorial', 1, {
					path: '/'
				});
			}
			timeAgoService.init();
			Notify.checkRefreshMessage();

		};

		$rootScope.$on('reloadCommunities', loadMyCommunities);
		$scope.$on('initFinished', $scope.initHearthbeat);
		$rootScope.initFinished && $scope.initHearthbeat();

		// ======================================== PUBLIC METHODS =====================================
		$rootScope.showLoginBox = function(showMsgOnlyLogged) {
			UnauthReload.clearReloadLocation();
			var scope = $scope.$new();
			scope.showMsgOnlyLogged = showMsgOnlyLogged;
			ngDialog.open({
				template: 'assets/pages/userForms/login.html',
				controller: 'LoginCtrl',
				scope: scope,
				closeByEscape: true,
				showClose: false
			});
		};


		// $rootScope.reloadToMarketplace = function() {
		// 	$rootScope.searchQuery = {
		// 		query: null,
		// 		type: 'post'
		// 	};
		// 	$state.go('market', {
		// 		query: null,
		// 		type: null
		// 	}, {
		// 		reload: false
		// 	});
		// 	$scope.$broadcast('reloadMarketplace');
		// };

		/**
		 * When clicked on logout button
		 */
		function logoutCb() {
			$rootScope.refreshToPath($$config.basePath);
		}
		$scope.logout = function() {
			// Auth.logout(function() {
			Session.get(session => {
				if (session._id) delete session._id;
				User.logout({}, logoutCb, logoutCb);
			}, err => {
				User.logout({}, logoutCb, logoutCb);
			});
		};

		/**
		 * This will test, if image size is sufficient for facebook sharing
		 * based on this https://developers.facebook.com/docs/sharing/best-practices
		 */
		$rootScope.testImageForSharing = function(img) {
			return img.size &&
				img.size[0] >= $$config.fbSharing.minWidth &&
				img.size[1] >= $$config.fbSharing.minHeight;
		};

		/**
		 * This will select best image for facebook sharing
		 */
		$rootScope.getSharingImage = function(postImages, userImage) {

			// this will go throught post images and select first sufficient
			if (postImages)
				for (var img in postImages) {
					if ($rootScope.testImageForSharing(postImages[img]))
						return postImages[img];
				}

			// if(userImage && $rootScope.testImageForSharing(userImage))
			//     return userImage;

			return {
				size: $$config.defaultHearthImageSize,
				large: $$config.appUrl + $$config.defaultHearthImage,
			}
		};

		/**
		 * Open report modal window for given item
		 */
		$rootScope.openReportBox = function(item) {
			if (item.spam_reported)
				return false;

			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			var scope = $scope.$new();
			scope.post = item;
			ngDialog.open({
				template: $$config.modalTemplates + 'postReport.html',
				controller: 'PostReport',
				scope: scope,
				closeByEscape: true,
				showClose: false
			});
		};

		// insert post if it was inserted/updated and insert him to marketplace if missing
		// as temporary fix of #1010
		$rootScope.insertPostIfMissing = function(data) {
			$rootScope.missingPost = data;
		};

		// get last post if it was updated/inserted and delete it from cache
		$rootScope.getPostIfMissing = function() {
			var ret = $rootScope.missingPost;
			$rootScope.missingPost = false;
			return ret;
		};

		/**
		 *	@param {Object} user - user/community to whom to address the message
		 *	@param {Object} params - {Boolean} toAllMembers
		 */
		$rootScope.sendMessage = function(user, params) {
			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true);
			params = params || {};

			var scope = $scope.$new();
			scope.user = user;

			scope.params = {};
			if (!!params.toAllMembers) scope.params.for_all_members = true;

			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'newMessage.html',
				controller: 'NewMessage',
				scope: scope,
				closeByDocument: false,
				closeByEscape: false,
				showClose: false
			});
		};

		$rootScope.openEditForm = function(scope) {
			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'postEdit.html',
				controller: 'PostEdit',
				scope: scope,
				closeByDocument: false,
				closeByEscape: false,
				showClose: false
			});
		};

		// open modal window for item edit
		$rootScope.editItem = function(post, isInvalid, preset) {
			if (itemEditOpened)
				return false;
			itemEditOpened = true;

			$timeout(function() {
				itemEditOpened = false;
			}, 2000);

			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true)

			// createDraft
			var scope = $scope.$new();
			scope.isInvalid = isInvalid;
			scope.preset = preset;
			if (post) {
				Post.get({
					postId: post._id
				}, function(detail) {
					scope.post = detail;
					scope.postOrig = detail;
					scope.isDraft = false;
					$rootScope.openEditForm(scope);
				});
			} else {
				Post.createDraft({}, function(draft) {
					scope.post = draft;
					scope.post.type = null; // because editItem dialog should start without anything selected
					scope.isDraft = true;
					scope.postOrig = null;
					$rootScope.openEditForm(scope);
				});
			}
		};

		$rootScope.removeItemFromList = function(id, list) {
			for (var i = 0; i < list.length; i++) {
				if (list[i]._id === id) {
					list.splice(i, 1);
					break;
				}
			}
			return list;
		};

		// delete item
		$rootScope.deleteItem = function(post, cb) {
			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			$rootScope.globalLoading = true;
			Post.remove({
				postId: post._id
			}, function(res) {
				$rootScope.$broadcast("itemDeleted", post); // broadcast event to hearth

				Notify.addSingleTranslate('POST.NOTIFY.SUCCESS_DELETED', Notify.T_SUCCESS);
				$rootScope.globalLoading = false;

				cb && cb(post); // if callback given, call it
			}, function() {
				$rootScope.globalLoading = false;
			});
		};

		$rootScope.openModalContainer = function(path, heading) {
			var scope = $scope.$new();
			scope.path = path;
			scope.heading = heading;

			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'modalContainer.html',
				controller: 'ModalContainer',
				scope: scope,
				className: 'ngdialog-fullwidth ngdialog-theme-default',
				closeByDocument: false,
				closeByEscape: true,
				showClose: false
			});
			dialog.closePromise.then(function(data) {});
		};

		$rootScope.showTerms = function() {
			$rootScope.openModalContainer('assets/locales/' + $rootScope.language + '/terms.html', 'HEARTH.TERMS.NAVIGATION_ITEM')
		}

		/**
		 * Function will show modal window where community admin can remove post from his community
		 */
		$rootScope.postRemoveFromCommunity = function(post) {
			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			var scope = $scope.$new();
			scope.post = post;

			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'postRemoveFromCommunity.html',
				controller: 'PostRemoveFromCommunity',
				scope: scope,
				closeByDocument: false,
				closeByEscape: true,
				showClose: false
			});
		};

		/**
		 * Function will follow item - only for specific admin roles
		 * @todo: will be changed due another admin privilegs in future
		 */
		$rootScope.followItem = function(post) {
			if (post.is_followed) return false;

			if (!Auth.isLoggedIn()) return $rootScope.showLoginBox(true);

			Post.follow({
				id: post._id
			}, res => {
				if (res.ok === true) {
					post.is_followed = !post.is_followed;
					Notify.addSingleTranslate('POST.NOTIFY.SUCCESS_FOLLOWED', Notify.T_SUCCESS);
				}
			});
		};

		/**
		 * Function will unfollow item - only for admin roles
		 * @todo: will be changed due another admin privilegs in future
		 */
		$rootScope.unfollowItem = function(post) {
			if (!post.is_followed)
				return false;

			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			Post.unfollow({
				postId: post._id
			}, function(res) {
				if (res.ok === true) {
					post.is_followed = !post.is_followed;
					Notify.addSingleTranslate('POST.NOTIFY.SUCCESS_UNFOLLOWED', Notify.T_SUCCESS);
				}
			});
		};

		$rootScope.openLinkSharingBox = function(item) {
			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			var scope = $scope.$new();
			scope.post = item;
			ngDialog.open({
				template: $$config.modalTemplates + 'linkSharing.html',
				controller: 'LinkSharing',
				scope: scope,
				closeByEscape: true,
				showClose: false
			});
		};

		$rootScope.openEmailSharingBox = function(item) {
			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			var scope = $scope.$new();
			scope.post = item;
			ngDialog.open({
				template: $$config.modalTemplates + 'emailSharing.html',
				controller: 'EmailSharing',
				scope: scope,
				closeByEscape: true,
				showClose: false
			});
		};

		// show modal window with invite options
		$rootScope.openInviteBox = function() {
			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'inviteBox.html',
				controller: 'InviteBox',
				scope: $scope.$new(),
				className: 'ngdialog-invite-box',
				closeByDocument: false,
				closeByEscape: true,
				showClose: false
			});

			dialog.closePromise.then(function(data) {});
		};

		/**
		 * Function will open modal window and show tutorial
		 * - accepts param with array of slide items
		 */
		$rootScope.showTutorial = function(slides) {

			var scope = $scope.$new();
			scope.tutorials = slides || [];

			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'tutorial.html',
				controller: 'Tutorial',
				scope: scope,
				className: 'ngdialog-tutorial ngdialog-theme-default',
				closeByDocument: false,
				closeByEscape: true,
				showClose: false
			});

			dialog.closePromise.then(function(data) {});
		};

		/**
		 * ConfirmBox reveal function has this params:
		 * title: $translate code for box head title
		 * text: $translate code for box text
		 * callback: function to call when confirmed
		 * params: array of params to pass into callback when confirmed
		 * callbackScope: if callback should be called with some scope
		 * {String} policy - from $$config.policy
		 * {String} confirmText - what to translate for confirmation [OK]
		 * {String} cancelText - what to translate for cancel [CANCEL]
		 * {Boolean} hideCancel - hides cancel button if true
		 */
		$rootScope.confirmBox = function({title, text, callback, params, callbackScope, policy, confirmText, cancelText, translationValues, hideCancel} = {}) {

			if (policy === $window.$$config.policy.SIGNED_IN && !Auth.isLoggedIn()) return $rootScope.showLoginBox(true)

			// create new scope of confirmBox
			var scope = $scope.$new()
			scope.params = angular.isArray(params) ? params : [params]

			// scope.title = title
			// scope.text = text
			// scope.callback = callback
			// scope.confirmText = confirmText
			// scope.cancelText = cancelText
			// scope.translationValues = translationValues
			angular.extend(scope, {
				title,
				text,
				callback,
				confirmText,
				cancelText,
				translationValues,
				hideCancel,
			})

			if (callbackScope) scope.callbackScope = callbackScope;

			// open dialog window and inject new scope
			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'confirmBox.html',
				controller: 'ConfirmBox',
				scope: scope,
				data: params,
				className: 'ngdialog-tutorial ngdialog-theme-default ngdialog-confirm-box',
				closeByDocument: false,
				showClose: false,
				closeByEscape: true,
			})
		}

		// this will flash post box with some background color
		$rootScope.blinkPost = function(item) {
			var delayIn = 200;
			var delayOut = 2000;
			var color = "#FFB697";
			// select elements which we will be changing (item, item arrow, etc..)
			var elements = $("#post_" + item._id + " .item, #post_" + item._id + " .item .overlap, #post_" + item._id + " .item .arrowbox");

			elements.animate({
				backgroundColor: color
			}, delayIn, function() {
				elements.animate({
					backgroundColor: "#FFF"
				}, delayOut);
			});
		};


		// this will flash rating box with some background color
		$rootScope.flashRatingBackground = function(rating) {
			$timeout(function() {

				$('#rating_' + rating._id).toggleClass('blink-rating');
				$timeout(function() {
					$('#rating_' + rating._id).toggleClass('blink-rating');
				}, 1200);
			});
		};

		// == deactivate / prolong / activate post item
		// and close modal or call given callback
		/**
		 *	@param paramObject {Object} [optional] - message - the admin message to send to the server along with suspend
		 *																				- action - overload for action decision
		 */
		$rootScope.pauseToggle = function(item, paramObject = {}, cb) {
			var Action
			// var actionType
			// paramObject = paramObject || {};

			// suspend or play based on post active state
			if (paramObject.action) {
				Action = paramObject.action
			} else {
				if ($rootScope.isPostActive(item)) {
					Action = Post.suspend
					// actionType = 'suspend'
				} else {
					// if item is expired, then prolong him, or just resume
					Action = (item.state == "expired") ? Post.prolong : Post.resume
					// actionType = 'activate'
				}
			}

			$rootScope.globalLoading = true
			const parameters = {
				id: item._id
			}
			if (paramObject.message) parameters.message = paramObject.message

			// call service
			Action(parameters).$promise.then(res => {
				if (angular.isFunction(cb)) cb(item)

				$rootScope.$broadcast('postUpdated', res)
				Notify.addSingleTranslate('POST.NOTIFY.SUCCESS_UPDATED', Notify.T_SUCCESS)
				$rootScope.globalLoading = false


			}).catch(err => {
				$rootScope.globalLoading = false
				if (err.status == 422) {
					// somethings went wrong - post is not valid
					// open edit box and show errors
					$rootScope.editItem(item, true)
				}
			})
		}

		// small-resolution menu toggle
		$rootScope.toggleSidebar = param => {
			$rootScope.leftSidebarShown = (param !== void 0 ? param : !$rootScope.leftSidebarShown)
		}

		$rootScope.receivedRepliesAfterLoadHandler = function(data, scope) {
			$timeout(function() {
				if ($location.search().reply) {
					var id = $location.search().reply;
					for (var i in data) {
						if (data[i]._id == id && !data[i].comment) {

							scope.openRatingReplyForm(data[i]);
							$timeout(() => {
								ScrollService.scrollToElement("#rating_" + id);
								$("#rating_" + id).find('textarea').focus();
							});
							return;
						}
					}
				}
			});
		};

		// return false if post is inactive
		$rootScope.isPostActive = PostAux.isPostActive;

		$rootScope.toggleSearchBar = value => {
			$rootScope.searchBarDisplayed = (value ? value : !$rootScope.searchBarDisplayed);

			if ($rootScope.searchBarDisplayed) {
				$('#searchContainer').slideDown('slow', () => {
					$('#searchContainer').show();
					angular.element('#search').focus();
				});

				$(document).on('click.search', e => {
					var element = $(e.target);
					if (!element.parents('#searchContainer').length && !element.is('#searchContainer') && !element.is('#searchIcon')) {
						$timeout($rootScope.toggleSearchBar);
					}
				});
			} else {
				angular.element('#search').blur();
				$('#searchContainer').slideUp('slow', () => {
					$('#searchContainer').hide();
				});

				$(document).off('click.search');
			}
		};

		$rootScope.isSearchBarShown = () => {
			return $rootScope.searchBarDisplayed;
		};

		$rootScope.mixpanelTrackMoveToTop = () => {
			$analytics.eventTrack('Move to Top clicked', {
				'context': $state.current.name
			});
		};

		// expose rights check for use in templates
		$rootScope.userHasRight = Rights.userHasRight;

		$scope.$on('$destroy', () => {
			angular.element(window).unbind('scroll');
		});
	}
]);
