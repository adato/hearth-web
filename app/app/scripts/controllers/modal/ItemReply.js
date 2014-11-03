'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('ItemReply', [
	'$scope', '$rootScope', 'Auth', 'Errors', '$element', 'PostReplies', 'Notify',
	function($scope, $rootScope, Auth, Errors, $element, PostReplies, Notify) {
		$scope.sending = false;
		$scope.showErrors = false;
		$scope.reply = {
			agree: true,
			text: '',
		};
		$scope.translationData = {
			name: $scope.post.author.name
		};
		$scope.showErrors = {
			text: false,
			agree: false
		}

		$scope.toggleMail = function() {
			$scope.reply.agree = !$scope.reply.agree;
			$scope.showErrors.agree = ! $scope.reply.agree;
		};

		$scope.showFinished = function() {

			$(".reply-ad").slideToggle();
			setTimeout(function() {
				$scope.closeThisDialog();
			}, 10000);
		};

		$scope.sendReply = function() {
			var data = {
				id: $scope.post._id,
				message: $scope.reply.text,
				agreed: $scope.reply.agree
			};

			$.each($scope.showErrors, function(key, value) {
				$scope.showErrors[key] = true;
			});

			if ($scope.sending || !data.agreed || $scope.replyForm.text.$invalid) {
				return false;
			}

			$scope.sending = true;
			PostReplies.add(data, function(res) {

				$scope.sending = false;
				$scope.showFinished();
				$scope.post.reply_count += 1;
	            // Notify.addTranslate('NOTIFY.REPLY_SENT', Notify.T_SUCCESS);

			}, function(res) {

				Notify.addTranslate('NOTIFY.POST_EDIT_FAILED', Notify.T_ERROR);
				$scope.sending = false;
			});
		};

		$scope.disableErrorMsg = function(key) {
			$scope.showErrors[key] = false;
		};
	}
]);