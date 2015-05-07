'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MessagesCtrl
 * @description List of messages
 */

angular.module('hearth.controllers').controller('MessagesCtrl', [
	'$scope', '$rootScope', 'Conversations', 'UnauthReload', 'Messenger', '$routeParams', '$location', '$timeout',
	function($scope, $rootScope, Conversations, UnauthReload, Messenger, $routeParams, $location, $timeout) {
		$scope.filter = $location.search();
		$scope.showNewMessageForm = false;
		$scope.loaded = false;
		$scope.conversations = false;
		$scope.showFulltext = false;
		$scope.detail = false;

		var _loadTimeout = 5000; // pull requests interval in ms
        var _loadLock = false; // pull requests interval in ms
        var _loadTimeoutPromise = false;
        
		if(!Object.keys($scope.filter).length) {
			$scope.filter = {
				query: '',
				type: ''
			}
		}

		$scope.toggleAddForm = function(conversation) {
			if(conversation) {
				$location.url("/messages/");
				$scope.filter = {
					query: '',
					type: '',
				}
				$scope.loadConversations({}, function(list) {
					$scope.loadConversationDetail(conversation._id);
				});
				return;
			}

			$scope.showNewMessageForm = !$scope.showNewMessageForm;
		};

		$scope.getFilter = function() {
			var filter = angular.copy($location.search());
			if(!!~['archived', 'as_replies', 'from_community', 'users_posts'].indexOf(filter.type))
				filter[filter.type] = true;

			delete filter.type;
			return filter;
		};

		$scope.applyFilter = function() {
			var filter = angular.copy($scope.filter);

			if(!filter.query)
				delete filter.query;
			if(!filter.type)
				delete filter.type;
			
			$location.url("/messages?"+jQuery.param(filter));
			$scope.$broadcast('filterApplied', filter);
		};

		$scope.setCurrentConversationAsReaded = function() {
			if(!$scope.detail || $scope.detail.read)
				return false;
				
			Messenger.decrUnreaded();
			$scope.detail.read = true;
		};

		$scope.loadNewConversations = function() {
			if(!$scope.conversations.length)
				return $scope.loadFirstConversations();
			
            if(_loadLock) return false;
            _loadLock = true;
			
            $timeout.cancel(_loadTimeoutPromise);

            var conf = {newer:$scope.conversations[0].last_message_time, exclude_self: true};
            angular.extend(conf, $scope.getFilter());

			Conversations.get(conf, function(res) {
				_loadTimeoutPromise = $timeout($scope.loadNewConversations, _loadTimeout);
                _loadLock = false;
                
                if(res.conversations.length) {
	                $scope.prependConversations($scope.deserialize(res.conversations));
	                $scope.setCurrentConversationAsReaded();
                }
			}, function() {
                _loadLock = false;
                _loadTimeoutPromise = $timeout($scope.loadNewConversations, _loadTimeout);
            });
		};

		$scope.removeDuplicitConversations = function(list) {
			list.forEach(function(item) {
				$scope.removeConversationFromList(null, item._id, true);
			});
		};

		$scope.prependConversations = function(conversations) {
			$scope.removeDuplicitConversations(conversations);
			Array.prototype.unshift.apply($scope.conversations, conversations);
			$scope.$broadcast("scrollbarResize");
			$scope.$broadcast("classIfOverflowContentResize");
		};

		$scope.searchConversation = function() {
			// if fulltext is hidden, first only show input
			if(!$scope.showFulltext || !$scope.filter.query )
				return $scope.showFulltext = !$scope.showFulltext;

			$scope.filter.query && $scope.applyFilter();
		};

		$scope.showConversation = function(info, index) {
			if(!info.read)
				Messenger.decrUnreaded();
			
			info.read = true;
			$scope.showNewMessageForm = false;
			$scope.detail = info;

			$location.url("/messages/"+info._id+"?"+jQuery.param($location.search()));
		};

		$scope.loadCounters = function() {
			Messenger.loadCounters(function(res) {
				$scope.loaded = true;
				$scope.conversationsCounters = res;
				$scope.conversationsCounters.total = 0; // TODO
			});
		};

		$scope.deserializeConversation = function(conversation) {
			var post = conversation.post;
			conversation.maxAvatarCount = (conversation.participants_count > 4 ) ? 3 : 4; // print 4 avatars max or only 3 avatars and 4th will be +X counter

			// handle conversation title
			// if it is post reply conversation, add post type
			if(!conversation.title && post && post.title) {

				conversation.title = post.title;
				
				if(post.author._type == 'User')
					post.type_code = (post.type == 'offer' ? 'OFFER' : 'NEED');
				else
					post.type_code = (post.type == 'offer' ? 'WE_GIVE' : 'WE_NEED');
			}
			
			if(!conversation.title) {
				conversation.titleCustom = true;
				conversation.title = [];

				// if there is no title, build it from participants
				for(var i = 0; i < 2 && i < conversation.participants.length; i++) {
					var user = conversation.participants[i];
					conversation.title.push(user.name);
				};
				conversation.title = conversation.title.join(", ");
			}
			return conversation;
		};

		/**
		 * Deserialize whole array of conversations
		 */
		$scope.deserialize = function(conversations) {
			return conversations.map($scope.deserializeConversation);
		};

		$scope.loadConversations = function(conf, done) {
			conf = conf || {};
			conf.exclude_self = true;
			angular.extend(conf, $scope.getFilter());

			Conversations.get(conf, function(res) {
				$scope.conversations = $scope.deserialize(res.conversations);
				done && done($scope.conversations);
			});
		};
		
		// if we have detail ID in url load it and display in detail box
		$scope.loadConversationDetail = function(id) {

			// but first try to find it in list
			if($scope.conversations) for(var i in $scope.conversations) {
				if($scope.conversations[i]._id == id) {
					return $scope.showConversation($scope.conversations[i], i);
				}
			}

			// if requested conversation is not in list, load it from API
			Conversations.get({exclude_self: true, id: id}, function(res) {
				$scope.showConversation($scope.deserializeConversation(res), -1);
			});
		};

		$scope.findConversation = function(id) {
			for(var i in $scope.conversations) {
				if($scope.conversations[i]._id == id)
					return i;
			}
			return false;
		};

		$scope.updateConversation = function(ev, conversation) {
			if(!$scope.conversations.length || $scope.conversations[0]._id != conversation._id) {
				$scope.prependConversations([$scope.deserializeConversation(conversation)]);
			}
		};

		$scope.updateDeepConversation = function(ev, conv) {
			conv = $scope.deserializeConversation(conv);
		};

		// when we leave/delete conversation - remove it from conversation list
		$scope.removeConversationFromList = function(ev, id, dontSwitchConversation) {
			// find its position
			var index = $scope.findConversation(id);

			// remove it
			if(index !== false)
				$scope.conversations.splice(index, 1);

			// and if it is currently open, jump to top
			if(!dontSwitchConversation && id == $scope.detail._id) {
				if(!$scope.conversations.length) {
					$scope.detail = false;
					return $location.url("/messages");
				}
				// if we should switch to the first conversation at the top
				$scope.showConversation($scope.conversations[0], 0);
				$timeout(function() {
					$scope.$broadcast("scrollbarResize");
					$scope.$broadcast("classIfOverflowContentResize");
					$(".conversations .scroll-content").scrollTop(0);
				});
			}
		};

		$scope.loadFirstConversations = function() {
			$scope.loadCounters();
			$scope.loadConversations({}, function(list) {
				// load first conversation on init
				if($routeParams.id)
					$scope.loadConversationDetail($routeParams.id);
				else if(list.length)
					$scope.showConversation(list[0], 0);

				_loadTimeoutPromise = $timeout($scope.loadNewConversations, _loadTimeout);
			});
		};

		function init() {
			$scope.conversations = false;
			$scope.detail = false;
			$scope.showFulltext = false;
			$scope.showNewMessageForm = false;
			
			$scope.loadCounters();
			$scope.loadConversations({}, function(list) {
				// load first conversation on init
				if($routeParams.id)
					$scope.loadConversationDetail($routeParams.id);
				else if(list.length)
					$scope.showConversation(list[0], 0);

				_loadTimeoutPromise = $timeout($scope.loadNewConversations, _loadTimeout);
			});
		};

		UnauthReload.check();
		$scope.$on('conversationRemoved', $scope.removeConversationFromList);
		$scope.$on('conversationUpdated', $scope.updateConversation);
		$scope.$on('conversationDeepUpdate', $scope.updateDeepConversation);
		$scope.$on('filterApplied', init);
		$scope.$on('initFinished', init);
		$rootScope.initFinished && init();

		$scope.$on('$destroy', function() {
            // stop pulling new conversations on directive destroy
            $timeout.cancel(_loadTimeoutPromise);
        });
	}
]);