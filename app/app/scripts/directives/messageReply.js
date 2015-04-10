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
				$scope.reply = {
					text: ''
				};
				$scope.showError = {
					text: false
				};
		
				$scope.validateReply = function(reply) {
					if(!reply.text)
						return $scope.showError.text = true;
				};

				$scope.sendReply = function(reply) {
					reply.id = $scope.conversationId;
					if($scope.sendingReply || !$scope.validateReply(reply))
						return false;
					$scope.sendingReply = true;

					console.log(reply);
					Conversations.reply(reply, function(res) {

						$scope.reply.text = '';
						$scope.sendingReply = false;
						$scope.$broadcast("conversationMessageAdded", reply);
					}, function(err) {
						$scope.sendingReply = false;
						Notify.addSingleTranslate('NOTIFY.MESSAGE_REPLY_FAILED', Notify.T_ERROR);
					});
				};

			}
		};
	}
]);