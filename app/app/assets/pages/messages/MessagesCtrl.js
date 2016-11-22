'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MessagesCtrl
 * @description List of messages
 */

angular.module('hearth.controllers').controller('MessagesCtrl', [
	'$scope', '$rootScope', 'Conversations', 'UnauthReload', 'Messenger', '$stateParams', '$location', '$timeout', 'PageTitle', '$translate', 'ResponsiveViewport', 'ConversationAux', '$state', 'IsEmpty',
	function($scope, $rootScope, Conversations, UnauthReload, Messenger, $stateParams, $location, $timeout, PageTitle, $translate, ResponsiveViewport, ConversationAux, $state, IsEmpty) {

		// start processing socket events
		ConversationAux.init({
			enableProcessing: true
		});

		$scope.filter = {
			type: '',
			post_id: void 0
		};

		// loading for the whole page including filters
		$scope.loaded = false;

		// loading for conversation list and conversation detail (used during changing of filters)
		$scope.reloading = false

		// don't really know what this one is for
		$scope.conversationLoadInProgress = false;
		var allConversationsLoaded = false;

		// the conversation list
		$scope.conversations = false;

		$scope.notFound = false;
		$scope.showFulltext = false;

		// this variable holds the displayed conversation
		$scope.detail = false;

		/**
		 *	- {String} filterString
		 */
		$scope.applyFilter = function(filterObject) {
			filterObject = filterObject || {};
			var query = filterObject.type.split(':');

			// weird approach, but whatever
			$scope.filter.post_id = query[0] === 'as_replies_post' ? query[1] : void 0;

			var filter = {
				key: query[0],
				value: query[1] || true
			};

			$location.url($location.path());
			if (filter.key) $location.search(filter.key, filter.value);
			init();
		};

		function redirectToFirstIfMatch(event, conversation) {
			if ($state.params.id === conversation.id) {
				if (!$scope.conversations.length || (ResponsiveViewport.isSmall() || ResponsiveViewport.isMedium())) {
					$state.go('messages');
				} else {
					$state.go('messages.detail', {
						id: ConversationAux.getFirstConversationIdIfAny()
					});
				}
			}
		}

		var filterTypes = ['archived', 'from_admin', 'as_replies', 'as_replies_post', 'from_community', 'users_posts'];

		function setParams() {
			var params = {};
			var searchParams = $location.search();
			if (searchParams.as_replies_post) {
				params.post_id = searchParams.as_replies_post;
			} else {
				for (var i = filterTypes.length; i--;) {
					if (searchParams[filterTypes[i]]) {
						params.filterType = filterTypes[i];
						break;
					}
				}
			}
			$scope.params = params;
		}

		function loadConversations(cb) {
			var params = $scope.params;
			params.wipe = true;

			ConversationAux.loadConversations(params).then(function(res) {
				$scope.conversations = res.conversations;
				$timeout(function() {
					$scope.$broadcast('scrollbarResize');
					$scope.$broadcast('classIfOverflowContentResize');
				}, 50);
				return (cb && typeof(cb) === 'function' ? cb(res.conversations) : false);
			});
		};

		// load another batch to the bottom of list when scrolled down
		$scope.loadBottom = function() {
			if ($scope.conversationLoadInProgress || allConversationsLoaded) {
				return false;
			}

			$scope.conversationLoadInProgress = true;
			var params = $scope.params;
			params.wipe = false;
			params.offset = $scope.conversations ? $scope.conversations.length : 0;

			ConversationAux.loadConversations(params).then(function(res) {
				if (res.thatsAllFolks) {
					allConversationsLoaded = true;
				}

				$scope.conversationLoadInProgress = false;

				$timeout(function() {
					$scope.$broadcast('scrollbarResize');
					$scope.$broadcast('classIfOverflowContentResize');
				}, 50);
			}, function(err) {
				$scope.conversationLoadInProgress = false;
			});
		};

		function loadPostConversations() {
			Conversations.getPosts(function(res) {
				$scope.postConversations = res;
			});
		};

		function init() {
			$scope.reloading = true;
			// set conversation to false, so that template ng-ifs evaluate correctly and show loading
			$scope.conversations = false;

			// set filter select-box to correct value
			// TODO - refactor those filters
			var searchParams = $location.search();
			var filterSet = false;

			if (searchParams.as_replies_post) {
				$scope.filter.type = 'as_replies_post:' + searchParams.as_replies_post;
				$scope.filter.post_id = searchParams.as_replies_post;
				filterSet = true;
			} else {
				for (var i = filterTypes.length; i--;) {
					if (searchParams[filterTypes[i]]) {
						$scope.filter.type = filterTypes[i];
						$scope.filter.post_id = void 0;
						filterSet = true;
						break;
					}
				}
			}

			setParams();

			if (filterSet) {
				$state.go('messages', {
					notify: false
				});
			}

			$scope.notFound = false;
			$scope.loadingBottom = false;
			allConversationsLoaded = false;

			loadPostConversations();

			loadConversations(function(res) {
				$scope.loaded = true;
				$scope.reloading = false;
				if (!($state.is('messages.new') || $state.params.id || ResponsiveViewport.isSmall() || ResponsiveViewport.isMedium())) $state.go('messages.detail', {
					id: $state.params.id ? $state.params.id : (res.length ? res[0]._id : void 0)
				});
			});

		};

		UnauthReload.check();

		$scope.$on('initFinished', init);
		$rootScope.$on('conversationRemoved', redirectToFirstIfMatch);
		$rootScope.$on('newConversationAdded', function(event, conversation) {
			if (!$scope.reloading && $scope.conversations && $scope.conversations.length === 1 && !ResponsiveViewport.isSmall() && !ResponsiveViewport.isMedium()) {
				$state.go('messages.detail', {
					id: conversation._id
				});
			}
		});
		$rootScope.initFinished && init();
	}
]);