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
				'conversationId': '='
			},
			templateUrl: 'templates/directives/messageReply.html',
			link: function($scope, el, attrs) {
				$scope.sendingReply = false;
				$scope.reply = {
					text: ''
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
					reply.id = $scope.conversationId;
					if($scope.sendingReply || !$scope.validateReply(reply))
						return false;
					$scope.sendingReply = true;

					Conversations.reply(reply, function(res) {

						$scope.reply.text = '';
						
						$timeout(function() {
							$('textarea', el).trigger('autosize.resize');
							$scope.onResize();
						});
						
						$scope.sendingReply = false;
						$scope.showError.text = false;
						$scope.$emit("conversationMessageAdded", res);
					}, function(err) {
						$scope.sendingReply = false;
						Notify.addSingleTranslate('NOTIFY.MESSAGE_REPLY_FAILED', Notify.T_ERROR);
					});
				};

				$scope.init = function() {
					$scope.reply.text = '';
				};
			}
		};
	}
]);