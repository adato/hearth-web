'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('ItemReply', [
	'$scope', '$rootScope', 'Auth', 'Errors', '$element', 'PostReplies',
	function($scope, $rootScope, Auth, Errors, $element, PostReplies) {
		$scope.sending = false;
		$scope.showErrors = false;
		$scope.reply = {
			agree: true,
			text: '',
		};
		$scope.translationData = {
			name: $scope.post.author.name
		};

		$('.reply-ad-textarea', $element).on('focus', function() {
			$(this).autosize();
		});

		$scope.toggleMail = function() {
			$scope.reply.agree = ! $scope.reply.agree;
		}

		$scope.sendReply = function() {
			var data = {
				id: $scope.post._id,
				message: $scope.reply.text,
				agreed: $scope.reply.agree
			};
			
			$scope.showErrors = true;
			if($scope.sending || $scope.replyForm.text.$invalid) {
				return false;
			}

			$scope.sending = true;
			PostReplies.add(data, function(res) {
				
				$scope.closeThisDialog();
				$scope.post.reply_count += 1;
			});
		};
	}
]);