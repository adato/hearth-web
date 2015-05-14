'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.messageReply
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('messageReply', [
	'Conversations', 'Notify', '$timeout',
	function(Conversations, Notify, $timeout) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				conversation: '='
			},
			templateUrl: 'templates/directives/messageReply.html',
			link: function($scope, el, attrs) {
				$scope.sendingReply = false;
				$scope.actors = [];
				$scope.actorsCount = 0;
				$scope.reply = {
					text: '',
					current_community_id: false
				};
				$scope.showError = {
					text: false
				};


				$scope.validateReply = function(reply) {
					var invalid = false;

					if(!reply.text)
						invalid = $scope.showError.text = true;
					return !invalid;
				};
				
				$scope.onResize = function() {
					$scope.$emit('messageReplyFormResized');
				};

				$scope.sendReply = function(reply) {
					reply.id = $scope.conversation._id;
					if($scope.sendingReply || !$scope.validateReply(reply))
						return false;
					$scope.sendingReply = true;

				 	Conversations.reply(reply, function(res) {

						$scope.reply.text = '';
						
						$timeout(function() {
							$('textarea', el).trigger('autosize.resize');
							$scope.onResize();
						});
						
						$scope.msgReplyForm.$setUntouched();
						$scope.msgReplyForm.$setPristine();

						$scope.sendingReply = false;
						$scope.showError.text = false;
						$scope.$emit("conversationMessageAdded", res);
					}, function(err) {
						$scope.sendingReply = false;
						Notify.addSingleTranslate('NOTIFY.MESSAGE_REPLY_FAILED', Notify.T_ERROR);
					});
				};

				$scope.init = function() {
					$scope.actors = $scope.conversation.possible_actings;
					
					if ($scope.actors.length == 1){
						$scope.reply.current_community_id = ($scope.actors[0]._type == "User" ? undefined : $scope.actors[0]._id);
					}
 				};

				$scope.init();
			}
		};
	}
]);