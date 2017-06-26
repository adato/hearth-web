'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemSuspend
 * @description controller for ng-dialog when suspending an item
 */

angular.module('hearth.controllers').controller('ItemSuspend', [
	'$scope', '$rootScope', '$translate', '$filter', 'Notify', 'Post', '$timeout', 'Rights',
	function($scope, $rootScope, $translate, $filter, Notify, Post, $timeout, Rights) {

		var timeout = null

		$scope.sending = false
		$scope.showErrors = false
		$scope.postTypes = $$config.postTypes
		$scope.userHasRight = Rights.userHasRight

		var item = $scope.item
		var suspendMessage = $translate.instant('POST.SUSPEND.CONNECTED_MESSAGE', {
			author_name: item.author.first_name || item.author.name,
			post_type: $filter('translate')($scope.postTypes[item.author._type][item.exact_type][item.type]),
			post_title: item.title,

			// TODO: OMG
			post_url: $rootScope.appUrl + 'post/' + item._id,

			user_name: $rootScope.loggedUser.first_name
		})

		$scope.data = {
			suspendMessage: suspendMessage
		}
		$scope.showErrors = {
			message: false
		}

		$scope.showFinished = () => {
			$(".modal").slideToggle()
			timeout = $timeout($scope.closeThisDialog, 5000)
		}

		$scope.close = function() {
			$timeout.cancel(timeout)
			$scope.closeThisDialog()
		}

		$scope.suspend = function(data) {

			// validation
			if (!data.suspendMessage) return $scope.showErrors.message = true

			$rootScope.pauseToggle($scope.item, {
				message: data.suspendMessage,
				action: Post.suspend
			}, res => {
				$scope.closeThisDialog()
			})
		}

	}
])