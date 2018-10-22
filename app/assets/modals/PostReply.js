'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.PostReply
 * @description
 */

angular.module('hearth.controllers').controller('PostReply', [
	'$scope', '$rootScope', 'PostReplies', 'Notify', '$timeout', 'ngDialog', 
	function($scope, $rootScope, PostReplies, Notify, $timeout, ngDialog) {

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

		$rootScope.$broadcast('suspendPostWatchers');

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
			$rootScope.$broadcast('resumePostWatchers');
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
				$scope.showFinished();
				$scope.post.reply_count += 1;
				$scope.post.is_replied = true;

				// show modal after ask for gift
				if ($scope.post.type == 'offer' && $rootScope.isTrustedProfileNotifyShown('trusted-profile-reply-offer-notify-closed')) {
					var ngDialogOptions = {
						template: 'trusted-profile',
						scope: $scope,
						closeByEscape: true,
						showClose: false,
						width:'40%',
						data: post
					};
			
					// show dialog containing info for user that he should update his profile
					let dialog = ngDialog.open(ngDialogOptions);
					dialog.closePromise.then(function (data) {
						if (data.value == 'close') {
							$rootScope.closeTrustedProfileNotify('trusted-profile-reply-offer-notify-closed')
						}
					})
				}

				$rootScope.$broadcast('postUpdateRepliedBy'); // update post counters
			}, function(res) {
				$scope.sending = false;
				$rootScope.globalLoading = false;
			});
		};

		$scope.disableErrorMsg = function(key) {
			$scope.showErrors[key] = false;
		};
	}
]);