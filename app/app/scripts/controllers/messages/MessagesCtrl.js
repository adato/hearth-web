'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MessagesCtrl
 * @description List of messages
 */

angular.module('hearth.controllers').controller('MessagesCtrl', [
	'$scope', '$rootScope', 'Conversations', 'UnauthReload', 'Messenger', '$routeParams', '$location', '$timeout',
	function($scope, $rootScope, Conversations, UnauthReload, Messenger, $routeParams, $location, $timeout) {
		$scope.conversations = false;
		$scope.detail = false;
		$scope.showFulltext = false;
		$scope.showNewMessageForm = false;
		$scope.filter = $location.search();

		if(!Object.keys($scope.filter).length) {
			$scope.filter = {
				query: '',
				type: '',
			}
		}

		$scope.toggleAddForm = function(conversation) {
			$scope.showNewMessageForm = !$scope.showNewMessageForm;
			if(conversation) {
				$scope.loadNewConversations();
				$scope.loadConversationDetail(conversation._id);
			}
		};

		$scope.getFilter = function() {
			var filter = angular.copy($location.search());
			if(!!~['archive', 'as_replies', 'from_community'].indexOf(filter.type))
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
			
			console.log(filter);

			$location.url("/messages?"+jQuery.param(filter));
			$scope.$broadcast('filterApplied', filter);
		};

		$scope.loadNewConversations = function() {
			if(!$scope.conversations.length)
				return $scope.loadConversations({});

			Conversations.get({newer:$scope.conversations[0].last_message_time, exclude_self: true}, function(res) {
				$scope.prependConversations($scope.deserialize(res.conversations));
			});
		};

		$scope.prependConversations = function(conversation) {
			Array.prototype.unshift.apply($scope.conversations, $scope.deserializeConversation(conversation));
		};

		$scope.searchConversation = function() {
			// if fulltext is hidden, first only show input
			if(!$scope.showFulltext || !$scope.filter.query )
				return $scope.showFulltext = !$scope.showFulltext;

			$scope.filter.query && $scope.applyFilter();
		};

		$scope.showConversation = function(info, index) {
			info.read = true;
			$scope.showNewMessageForm = false;
			$scope.detail = info;

			$location.url("/messages/"+info._id+"?"+jQuery.param($location.search()));
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
			var index = $scope.findConversation(conversation._id);
			index && $scope.conversations.splice(index, 1);

			$scope.prependConversations([conversation]);
		};

		// when we leave/delete conversation - remove it from conversation list
		$scope.removeConversationFromList = function(ev, id) {
			// find its position
			var index = $scope.findConversation(id);

			// remove it
			if(index !== false)
				$scope.conversations.splice(index, 1);

			// and if it is currently open, jump to top
			if(id == $scope.detail._id) {
				$scope.showConversation($scope.conversations[0], 0);
				$timeout(function() {
					$(".conversations .scroll-content").scrollTop(0);
				});
			}
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
			});

		};

		UnauthReload.check();
		$scope.$on('conversationRemoved', $scope.removeConversationFromList);
		$scope.$on('conversationUpdated', $scope.updateConversation);
		$scope.$on('filterApplied', init);
		$scope.$on('initFinished', init);
		$rootScope.initFinished && init();
	}
]);