'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MessagesCtrl
 * @description List of messages
 */

angular.module('hearth.controllers').controller('MessagesCtrl', [
	'$scope', '$rootScope', 'Conversations', 'UnauthReload', 'Messenger', '$routeParams', '$location',
	function($scope, $rootScope, Conversations, UnauthReload, Messenger, $routeParams, $location) {
		$scope.conversations = false;
		$scope.detail = false;
		$scope.detailIndex = false;
		$scope.showFulltext = false;
		$scope.showNewMessageForm = false;
		$scope.conversationFilter = 'all';
		$scope.conversationSearch = '';
		
		$scope.toggleAddForm = function(conversation) {
			$scope.showNewMessageForm = !$scope.showNewMessageForm;
			conversation && $scope.loadNewConversations();
		};

		$scope.applyFilter = function() {
			var filter = {};
			if($scope.conversationSearch)
				filter.query = $scope.conversationSearch;

			if(!!~['archive', 'as_replies', 'from_community'].indexOf($scope.conversationFilter))
				filter[$scope.conversationFilter] = true;

			$location.url("/messages?"+jQuery.param(filter));
			$scope.$broadcast('filterApplied', filter);
		};

		$scope.loadNewConversations = function() {
			// TODO
		};

		$scope.prependConversation = function(conversation) {
			$scope.conversations.unshift($scope.deserializeConversation(conversation));
			// $scope.showConversation(conversation, 0);
		};

		$scope.searchConversation = function() {
			// if fulltext is hidden, first only show input
			if(!$scope.showFulltext || !$scope.conversationSearch )
				return $scope.showFulltext = !$scope.showFulltext;

			$scope.conversationSearch && $scope.applyFilter();
		};

		$scope.showConversation = function(info, index) {
			console.log("Display: ", info._id, " index: ", index);
			info.read = true;
			$scope.showNewMessageForm = false;
			$scope.detail = info;
			$scope.detailIndex = parseInt(index);

			$location.url("/messages/"+info._id+"?"+jQuery.param( $location.search()));
		};

		$scope.loadCounters = function() {
			Messenger.loadCounters(function(res) {
				$scope.conversationsCounters = res;
			});
		};

		$scope.deserializeConversation = function(conversation) {
			if(!conversation.title) {
				conversation.title = [];

				for(var id in conversation.participants) {
					var user = conversation.participants[id];

					if($rootScope.loggedUser._id !== user._id)
						conversation.title.push(user.name);
				};
				conversation.title = conversation.title.join(", ");
			}
			return conversation;
		};

		$scope.deserialize = function(conversation) {
			return conversation.map($scope.deserializeConversation);
		};

		$scope.loadConversations = function(conf, done) {
			var filter;
			conf = conf || {};
			conf.exclude_self = true;

			filter = $location.search();
			if(filter)
				angular.extend(conf, filter);

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
				$scope.showConversation($scope.deserializeConversation(res), false);
			});
		};

		// when we leave/delete conversation - remove it from conversation list
		$scope.removeConversationFromList = function(ev, id) {
			var index = false;
			// find its position
			for(var i in $scope.conversations) {
				if($scope.conversations[i]._id == id) {
					index = i;
					break;
				}
			}

			// remove it
			if(index !== false)
				$scope.conversations.splice(i, 1);

			// and if it is currently open, jump to top
			if(id == $scope.detail._id) {
				$scope.showConversation($scope.conversations[0], 0);
			}
		};

		function init() {
			$scope.conversations = false;
			$scope.detail = false;
			$scope.detailIndex = false;
			$scope.showFulltext = false;
			$scope.showNewMessageForm = false;

			$scope.loadCounters();
			$scope.loadConversations({}, function(list) {
				// load first conversation on init
				if($routeParams.id)
					$scope.loadConversationDetail($routeParams.id);
				else if(list.length)
					$scope.showConversation(list[0], 0);
			});

		};

		UnauthReload.check();
		$scope.$on('conversationRemoved', $scope.removeConversationFromList);
		$scope.$on('filterApplied', init);
		$scope.$on('initFinished', init);
		$rootScope.initFinished && init();
	}
]);