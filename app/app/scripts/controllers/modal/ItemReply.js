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
		$scope.showErrors = {
			text: false,
			agree: false
		}

		$scope.toggleMail = function() {
			$scope.reply.agree = !$scope.reply.agree;
			$scope.showErrors.agree = ! $scope.reply.agree;
		}

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
				$scope.closeThisDialog();
				$scope.post.reply_count += 1;
			}, function(res) {

				alert("There was an error while sending request to api.");
				$scope.sending = false;
			});
		};

		$scope.disableErrorMsg = function(key) {
			$scope.showErrors[key] = false;
		};
	}
]);