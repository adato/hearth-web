'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.messageReply
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('messageReply', [
	function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				'conversationId': '='
			},
			templateUrl: 'templates/directives/messageReply.html',
			link: function($scope, el, attrs) {

				$scope.validateReply = function(reply) {
					var invalid = false;

					if(!reply.text)
						invalid = $scope.showError.text = true;
					
					return !invalid;
				};

				$scope.sendReply = function(reply) {
					reply.id = $scope.detail._id;

					if(!$scope.validateReply(reply))
						return false;

					if($scope.sendingReply)
						return false;
					$scope.sendingReply = true;

					Conversations.reply(reply, function(res) {

						$scope.reply.text = '';
						$scope.showError.text = false;
						$scope.replyForm.show = false;

						$scope.detail.messages = res.messages;

						$scope.sendingReply = false;
						Notify.addSingleTranslate('NOTIFY.MESSAGE_REPLY_SUCCESS', Notify.T_SUCCESS);
					}, function(err) {
						$scope.sendingReply = false;
						Notify.addSingleTranslate('NOTIFY.MESSAGE_REPLY_FAILED', Notify.T_ERROR);
					});
				};

			}
		};
	}
]);