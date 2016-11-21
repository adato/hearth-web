'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.conversationAddParticipants
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('conversationAddParticipants', [
	'$rootScope', '$q', 'User', '$timeout', 'Conversations',
	function($rootScope, $q, User, $timeout, Conversations) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				users: '=',
				conversation: '=',
				ngDisabled: '=',
				ngBlur: '&',
				ngFocus: '&',
				toggleParticipantsForm: '&'
			},
			templateUrl: 'assets/components/conversationAddParticipants/conversationAddParticipants.html',
			link: function($scope, baseElement) {
				var timer = null;
				$scope.userList = [];

				/**
				 * This will return list of already added user IDs
				 * @return {[type]} [description]
				 */
				$scope.getIdList = function() {
					var list = {};
					for (var i in $scope.users)
						list[$scope.users[i]._id] = true;
					return list;
				};

				/**
				 * This will remove duplicit users
				 */
				$scope.filterUnique = function(users) {
					var list = $scope.getIdList();
					for (var i = 0; i < users.length; i++)
						list[users[i]._id] && users.splice(i--, 1);
					return users;
				};

				/**
				 * Add participant to conversation
				 */
				$scope.addParticipant = function(item, model) {
					var params = {
						conversation_id: $scope.conversation._id,
						id: item._id
					};

					Conversations.addParticipants(params, function(res) {
						$scope.toggleParticipantsForm();
					});
				};

				/**
				 * Search users for autocomplete
				 */
				$scope.search = function(s) {
					var params = {
						limit: 10,
						query: '*' + s + '*',
						type: 'user'
					};

					if (!s || !s.length)
						return;

					timer && $timeout.cancel(timer);

					// Search after while when user stops typing
					timer = $timeout(function() {
						User.getConnections(params, function(res) {
							$scope.userList = $scope.filterUnique(res.data);
						});
					}, 200);
				};

				$timeout(function() {
					var input = baseElement.find('input');

					input.bind('blur', function() {
						$scope.ngBlur && $scope.ngBlur();
					});
					input.bind('focus', function() {
						$scope.ngFocus && $scope.ngFocus();
					});
				});
			}
		};
	}
]);