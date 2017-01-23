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
		$scope.reloading = false;

		// loading next batch of conversations
		$scope.conversationLoadInProgress = false;

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
			$scope.filter.community_id = query[0] === 'community_id' ? query[1] : void 0;

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

		var filterTypes = ['archived', 'from_admin', 'as_replies', 'as_replies_post', 'users_posts', 'community_id'];

		/**
		 *	Function that extend a param object for loading conversations with current filters
		 *	@param {Object} filter [optional]
		 *	@return {Object} filter - extended filter param
		 */
		function extendParams(params) {
			params = params || {};
			var searchParams = $location.search();
			if (searchParams.as_replies_post) {
				params.post_id = searchParams.as_replies_post;
			} else if (searchParams.community_id) {
				params.community_id = searchParams.community_id;
			} else {
				for (var i = filterTypes.length; i--;) {
					if (searchParams[filterTypes[i]]) {
						params.filterType = filterTypes[i];
						break;
					}
				}
			}
			return params;
		}

		function loadConversations(cb) {
			var params = {
				wipe: true
			};
			extendParams(params);
			ConversationAux.loadConversations(params).then(function(res) {
				if (res.thatsAllFolks) $scope.allConversationsLoaded = true;
				$scope.conversations = res.conversations;
				$timeout(function() {
					$scope.$broadcast('scrollbarResize');
					$scope.$broadcast('classIfOverflowContentResize');
				}, 50);
				return (cb && typeof(cb) === 'function' ? cb(res.conversations) : false);
			});
		}

		// load another batch to the bottom of list when scrolled down
		$scope.loadBottom = function() {
			if ($scope.conversationLoadInProgress || $scope.allConversationsLoaded) return false;

			// disable loading bottom sooner that when at least some conversations are loaded
			if (!($scope.conversations && $scope.conversations.length)) return false;

			$scope.conversationLoadInProgress = true;
			var config = {
				offset: ($scope.conversations ? $scope.conversations.length : 0)
			};
			extendParams(config);

			ConversationAux.loadConversations(config).then(function(res) {
				if (res.thatsAllFolks) $scope.allConversationsLoaded = true;
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
		}

		function loadCommunityConversations() {
			Conversations.getCommunityConversations(function(res) {
				$scope.communityConversations = res.communities;
			});
		}

		function init() {
			$scope.reloading = true;
			// set conversation to false, so that template ng-ifs evaluate correctly and show loading
			$scope.conversations = false;

			// set filter select-box to correct value
			// TODO - refactor those filters
			var searchParams = $location.search();

			// clean-up filter
			$scope.filter = {};

			if (searchParams.as_replies_post) {
				$scope.filter.type = 'as_replies_post:' + searchParams.as_replies_post;
				$scope.filter.post_id = searchParams.as_replies_post;
			} else if (searchParams.community_id) {
				$scope.filter.type = 'community_id:' + searchParams.community_id;
				$scope.filter.community_id = searchParams.community_id;
			} else {
				for (var i = filterTypes.length; i--;) {
					if (searchParams[filterTypes[i]]) {
						$scope.filter.type = filterTypes[i];
						$scope.filter.post_id = void 0;
						break;
					}
				}
			}

			$scope.notFound = false;
			$scope.loadingBottom = false;
			$scope.allConversationsLoaded = false;

			loadPostConversations();
			loadCommunityConversations();

			loadConversations(function(res) {
				$scope.loaded = true;
				$scope.reloading = false;

				// if we have an id in the url but the result of get conversations is empty
				// that means we do not wish to display the conversation
				if (!res.length) {
					return $state.go('messages', {
						notify: false
					});
				}

				var currConvInList = currentConvIsInTheList(res);
				if (!($state.is('messages.new') || $state.params.id || ResponsiveViewport.isSmall() || ResponsiveViewport.isMedium()) || !currConvInList) {
					$state.go('messages.detail', {
						id: $state.params.id && currConvInList ? $state.params.id : res[0]._id
					});
				}
			});
		}

		function currentConvIsInTheList(list) {
			if (!list) return;
			for (var i = list.length; i--;) {
				if (list[i] && (list[i]._id === $state.params.id)) return true;
			}
			return false;
		}

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