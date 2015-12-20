'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.BaseCtrl
 * @description
 */

angular.module('hearth.controllers').controller('BaseCtrl', [
	'$scope', '$locale', '$rootScope', '$location', 'Auth', 'ngDialog', '$timeout', '$interval', '$element', 'CommunityMemberships', '$window', 'Post', 'Tutorial', 'Notify', 'Messenger', 'timeAgoService', 'ApiHealthChecker', 'PageTitle', '$state',
	function($scope, $locale, $rootScope, $location, Auth, ngDialog, $timeout, $interval, $element, CommunityMemberships, $window, Post, Tutorial, Notify, Messenger, timeAgoService, ApiHealthChecker, PageTitle, $state) {
		var timeout;
		var itemEditOpened = false;
		$rootScope.myCommunities = false;
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
		$scope.addresses = $$config.itemAddresses;
		$rootScope.socialLinks = {
			facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
			gplus: 'https://plus.google.com/share?url=',
			twitter: 'https://twitter.com/share?url='
		};

		$rootScope.missingPost = false;
		$rootScope.cacheInfoBox = {};

		// init globalLoading
		$rootScope.globalLoading = false;
		$rootScope.topArrowText = {};
		$scope.isScrolled = false;

		/**
		 * This will set fixed height of document for current height
		 */
		$scope.resfreshWithResize = function() {
			$("#all").css("min-height", $("#all").height() + "px");
		};

		$scope.removePageMinHeight = function() {
			$timeout(function() {
				$("#all").css("min-height", "unset");
			}, 500);
		};

		/**
		 * This will unset fixed height of document
		 */
		$rootScope.$on("subPageLoaded", $scope.removePageMinHeight);

		$rootScope.reloadPage = function() {
			window.location = document.URL;
		};

		$rootScope.checkOnlineState = function() {
			ApiHealthChecker.checkOnlineState();
		};

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

		/**
		 * When started routing to another page, compare routes and if they differ
		 * scroll to top of the page, if not, refresh page with fixed height
		 */
		$rootScope.$on("$stateChangeStart", function(event, next) {
			// when changed route, load conversation counters
			Auth.isLoggedIn() && Messenger.loadCounters();
			ngDialog.close();

			if (!$rootScope.pageChangeWithScroll) {
				// dont scroll top after page change
				$rootScope.pageChangeWithScroll = true;
				return $scope.resfreshWithResize();
			}

			if (!$rootScope.addressNew)
				return $rootScope.top(0, 1);;

			$rootScope.addressOld = $rootScope.addressNew;
			$rootScope.addressNew = next.originalPath;

			var r1 = $rootScope.addressOld.split($$config.basePath);
			var r2 = $rootScope.addressNew.split($$config.basePath);

			// if first element in URL of old page is not same as first element in URL of new page
			// scroll to top - (alias scroll when we come to new URL)
			if (r1.length < 2 || r2.length < 2 || r1[1] != r2[1])
				$rootScope.top(0, 1);
			else
				$scope.resfreshWithResize();
		});

		$rootScope.$on("initLanguageSuccess", $scope.setPageTitle);

		/**
		 * After routing finished, set current page segment to variable - used somewhere else
		 * and add class of given controller to wrapping div container
		 */
		$rootScope.$on("$stateChangeSuccess", function(ev, current) {
			$rootScope.pageName = $state.current.name;
			$scope.segment = current.name;

			$("#all").removeClass();
			$("#all").addClass(current.controller);
			$scope.setPageTitle(current);
		});


		/**
		 * This will set up rollbar person
		 * Depends on $windo.Rollbar !!
		 */
		$rootScope.$on("initSessionSuccess", function(event, user) {
			if ($window.Rollbar) {
				$window.Rollbar.configure({
					payload: {
						person: {
							id: user._id,
							username: user.name,
							// email is not reachable in session`s user variable, so we omit it
							email: user.email
						}
					}
				});
			}
		});

		$scope.showUI = function(ui) {
			$scope.$broadcast('showUI', ui);
		};

		/**
		 * When submitted fulltext search
		 */
		$scope.search = function(searchQuery) {
			if (!searchQuery.query) {
				$("#search").focus();
				return false;
			}

			$rootScope.top(0, 1);
			$state.go('search', {
				q: searchQuery.query,
				// type: searchQuery.type
			});
		};

		/**
		 * Close notification of maintenance message about new version
		 */
		$rootScope.closeMaintenanceNotify = function() {
			ApiHealthChecker.closeNotify();
		};

		/**
		 * Set value of fulltext search
		 */
		$rootScope.setFulltextSearch = function(val) {
			$timeout(function() {
				$("#searchBox").val(val);
			});
		};

		/**
		 * This will scroll up on page
		 */
		$rootScope.top = function(offset, delay) {
			$('html, body').animate({
				scrollTop: offset || 0
			}, delay || 1000);
		};

		/**
		 * Return profile of item based on its type (community, user, post)
		 */
		$rootScope.getProfileLinkByType = function(type) {
			return $scope.addresses[type];
		};

		/**
		 * Return profile of item based on its type (community, user, post)
		 */
		$rootScope.getActivityLink = function(object, target_object) {
			if (target_object)
				return $rootScope.getProfileLink(target_object._type, target_object._id);
			return $rootScope.getProfileLink(object._type, object._id);
		};

		/**
		 * Return profile of item based on its type and id
		 */
		$rootScope.getProfileLink = function(type, id, fullPath) {
			return (fullPath ? $$config.appUrl : $$config.basePath) + $rootScope.getProfileLinkByType(type) + "/" + id;
		};


		/**
		 * Refresh user to given path
		 */
		$rootScope.refreshToPath = function(path) {
			window.location = path || document.URL;
		};

		$rootScope.isMine = function(author_id) {
			return $scope.loggedUser && author_id === $scope.loggedUser._id;
		};

		angular.element(window).bind('scroll', function() {
			if ($(window).scrollTop() > 0 !== $scope.isScrolled) {
				$('html').toggleClass('scrolled');
				$scope.isScrolled = !$scope.isScrolled;
			}
		});

		$scope.loadMyCommunities = function() {

			CommunityMemberships.get({
				user_id: $rootScope.loggedUser._id
			}, function(res) {
				$rootScope.myCommunities = res;
				$rootScope.myAdminCommunities = [];
				res.forEach(function(item) {

					// create list of communities I'm admin in
					if (item.admin == $rootScope.loggedUser._id)
						$rootScope.myAdminCommunities.push(item);
				});
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
				$scope.loadMyCommunities();
				$scope.checkTutorial();
			} else {
				// set to check tutorial after next login
				$.cookie('tutorial', 1, {
					path: '/'
				});
			}
			timeAgoService.init();
			Notify.checkRefreshMessage();
			Auth.isLoggedIn() && Messenger.loadCounters();

		};

		$scope.$on('reloadCommunities', $scope.loadMyCommunities);
		$scope.$on('initFinished', $scope.initHearthbeat);
		$rootScope.initFinished && $scope.initHearthbeat();

		// ======================================== PUBLIC METHODS =====================================
		$rootScope.showLoginBox = function(showMsgOnlyLogged) {

			var scope = $scope.$new();
			scope.showMsgOnlyLogged = showMsgOnlyLogged;
			ngDialog.open({
				template: $$config.templates + 'userForms/login.html',
				controller: 'LoginCtrl',
				scope: scope,
				closeByEscape: true,
				showClose: false
			});
		};


		$rootScope.reloadToMarketplace = function() {
			$rootScope.searchQuery = {
				query: null,
				type: 'post'
			};
			$state.go('market', {
				query: null,
				type: null
			}, {
				reload: true
			});
		};

		/**
		 * When clicked on logout button
		 */
		$scope.logout = function() {
			Auth.logout(function() {
				$rootScope.refreshToPath($$config.basePath);
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
				template: $$config.templates + 'modal/itemReport.html',
				controller: 'ItemReport',
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

		$rootScope.sendMessage = function(user) {
			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			var scope = $scope.$new();
			scope.user = user;

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
				template: $$config.modalTemplates + 'itemEdit.html',
				controller: 'ItemEdit',
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
			}, 1000);

			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

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

				Notify.addSingleTranslate('NOTIFY.POST_DELETED_SUCCESFULLY', Notify.T_SUCCESS);
				$rootScope.globalLoading = false;

				cb && cb(post); // if callback given, call it
			}, function() {
				$rootScope.globalLoading = false;
				Notify.addSingleTranslate('NOTIFY.POST_DELETED_FAILED', Notify.T_ERROR);
			});
		};

		/**
		 * Function will show modal window with reply form to given post
		 */
		$rootScope.replyItem = function(post) {
			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			var scope = $scope.$new();
			scope.post = post;

			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'itemReply.html',
				controller: 'ItemReply',
				scope: scope,
				closeByDocument: false,
				closeByEscape: true,
				showClose: false
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
			$rootScope.openModalContainer('/app/locales/' + $rootScope.language + '/new-terms.html', 'MENU.TERMS');
		};

		/**
		 * Function will show modal window where community admin can remove post from his community
		 */
		$rootScope.removeItemFromCommunity = function(post) {
			if (!Auth.isLoggedIn())
				return $rootScope.showLoginBox(true);

			var scope = $scope.$new();
			scope.post = post;

			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'removeItemFromCommunity.html',
				controller: 'RemoveItemFromCommunity',
				scope: scope,
				closeByDocument: false,
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
				template: $$config.templates + 'modal/emailSharing.html',
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
				// showClose: false
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
		 */
		$rootScope.confirmBox = function(title, text, callback, params, callbackScope) {

			// create new scope of confirmBox
			var scope = $scope.$new();
			scope.title = title;
			scope.text = text;
			scope.callback = callback;
			scope.params = angular.isArray(params) ? params : [params];

			if (callbackScope)
				scope.callbackScope = callbackScope;

			// open dialog window and inject new scope
			var dialog = ngDialog.open({
				template: $$config.modalTemplates + 'confirmBox.html',
				controller: 'ConfirmBox',
				scope: scope,
				className: 'ngdialog-tutorial ngdialog-theme-default ngdialog-confirm-box',
				closeByDocument: false,
				showClose: false,
				closeByEscape: true,
			});
		};

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
		$rootScope.pauseToggle = function(item, cb) {
			var Action, actionType;

			// suspend or play based on post active state
			if ($rootScope.isPostActive(item)) {

				Action = Post.suspend;
				actionType = 'suspend';
			} else {

				// if item is expired, then prolong him, or just resume
				Action = (item.state == "expired") ? Post.prolong : Post.resume;
				actionType = 'activate';
			}

			$rootScope.globalLoading = true;
			// call service
			Action({
				id: item._id
			}, function(res) {

				if (angular.isFunction(cb))
					cb(item);

				$rootScope.$broadcast('postUpdated', res);
				Notify.addSingleTranslate('NOTIFY.POST_UPDATED_SUCCESFULLY', Notify.T_SUCCESS);
				$rootScope.globalLoading = false;

			}, function(err) {
				$rootScope.globalLoading = false;

				if (err.status == 422) {

					// somethings went wrong - post is not valid
					// open edit box and show errors
					$rootScope.editItem(item, true);
				} else {

					Notify.addSingleTranslate('NOTIFY.POST_UPDAT_FAILED', Notify.T_ERROR);
				}
			});
		};

		$rootScope.receivedRepliesAfterLoadHandler = function(data, scope) {
			$timeout(function() {
				if ($location.search().reply) {
					var id = $location.search().reply;
					for (var i in data) {
						if (data[i]._id == id) {

							scope.openRatingReplyForm(data[i]);
							$timeout(function() {
								$rootScope.scrollToElement("#rating_" + id);
								$("#rating_" + id).find('textarea').focus();
							});
							return;
						}
					}
				}
			});
		};

		// this will scroll to given element in given container (if not setted take body as default)
		$rootScope.scrollToElement = function(el, cont, off) {
			var offset = off || 200;
			var container = cont || 'html, body';
			var elementPos;

			if (!$(el).first().length)
				return false;

			elementPos = Math.max($(el).first().offset().top - offset, 0);
			$(container).animate({
				scrollTop: elementPos
			}, 'slow');
		};

		// this will scroll to given element or first error message on page
		$rootScope.scrollToError = function(el, cont) {
			setTimeout(function() {
				$rootScope.scrollToElement(el || $('.error').not('.alert-box,.ng-hide'), cont);
			});
		};

		// return false if post is inactive
		$rootScope.isPostActive = function(item) {
			return item.state === 'active';
			// return item.is_active && !item.is_expired;
		};

		$scope.$on('$destroy', function() {
			angular.element(window).unbind('scroll');
		})
	}
]);