'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('ItemReply', [
	'$scope', '$rootScope', 'PostReplies', 'Notify', '$timeout',
	function($scope, $rootScope, PostReplies, Notify, $timeout) {
		var timeout = null;
		$scope.sending = false;
		$scope.showErrors = false;
		// $scope.author = null;
		$scope.reply = {
			id: $scope.post._id,
			agreed: true,
			message: '',
			current_community_id: null,
		};
		$scope.translationData = {
			name: $scope.post.author.name
		};
		$scope.showErrors = {
			message: false,
			agree: false
		}

		// $scope.$watch("author", function(val) {
		// 	$scope.reply.current_community_id = val;
		// });

		$scope.toggleMail = function() {
			$scope.reply.agree = !$scope.reply.agree;
			$scope.showErrors.agree = !$scope.reply.agree;
		};

		$scope.showFinished = function() {

			$(".reply-ad").slideToggle();
			timeout = $timeout(function() {
				$scope.closeThisDialog();
			}, 5000);
		};

		$scope.close = function() {
			$timeout.cancel(timeout);
			$scope.closeThisDialog();
		};

		$scope.sendReply = function() {

			$.each($scope.showErrors, function(key, value) {
				$scope.showErrors[key] = true;
			});
			$scope.replyForm.$setDirty();

			if ($scope.sending || !$scope.reply.agreed || $scope.replyForm.message.$invalid) {
				return false;
			}

			$rootScope.globalLoading = true;
			$scope.sending = true;
			PostReplies.add($scope.reply, function(res) {

				$rootScope.globalLoading = false;
				$scope.sending = false;
				$scope.showFinished();
				$scope.post.reply_count += 1;
				$scope.post.is_replied = true;

				// Notify.addSingleTranslate('NOTIFY.REPLY_SENT', Notify.T_SUCCESS);

			}, function(res) {
				Notify.addSingleTranslate('NOTIFY.REPLY_FAILED', Notify.T_ERROR, '.notify-reply-container');
				$scope.sending = false;
				$rootScope.globalLoading = false;
			});
		};

		$scope.disableErrorMsg = function(key) {
			$scope.showErrors[key] = false;
		};
	}
]);
