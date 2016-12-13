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
				$scope.participants = [];
				$scope.list = {
					participants: $scope.participants
				};
				$scope.showSubmit = false;

				$scope.$watch("list.participants", function(val) {
					$scope.participants = val;
					$scope.userList = [];
					baseElement.find(".select2-drop").addClass("select2-display-none");
				});

				/**
				 * This will return list of active and added participants IDs
				 * @return {[type]} [description]
				 */
				$scope.getIdList = function() {
					var list = {};
					var participants = $scope.users.concat($scope.participants);

					for (var i in participants) {
						list[participants[i]._id] = true;
					}

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
				 * Add participants to conversation
				 */
				$scope.participantSubmit = function() {
					var ids = []

					angular.forEach($scope.participants, function(participant) {
						ids.push(participant._id);
					});

					var params = {
						conversation_id: $scope.conversation._id,
						ids: ids
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