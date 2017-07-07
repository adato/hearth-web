'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.EmailSharing
 * @description
 */

angular.module('hearth.controllers').controller('EmailSharing', [
	'$scope', '$rootScope', 'Post', '$timeout',
	function($scope, $rootScope, Post, $timeout) {

		var timeout = null
		$scope.sending = false
		$scope.sharing = {
			emails: '',
			message: '',
			id: $scope.post._id
		}
		$scope.showErrors = {
			emails: false,
			message: false,
		}

		$scope.showFinished = () => {
			$(".email-sharing").slideToggle()
			timeout = $timeout($scope.closeThisDialog, 5000)
		}

		$scope.close = () => {
			$timeout.cancel(timeout)
			$scope.closeThisDialog()
		}

		$scope.send = (modelData, form) => {
			if (!form.$valid || $scope.sending) return

			const data = angular.copy(modelData)
			data.emails = data.emails.split(',').map(item => item.trim())

			$rootScope.globalLoading = true
			$scope.sending = true

			Post.emailShare(data).$promise.then(res => {
				$scope.showFinished()
				form.$setPristine()
				form.$setUntouched()
			}).catch(err => {
				console.error(err)
			}).finally(() => {
				$scope.sending = false
				$rootScope.globalLoading = false
			})
		}

	}
])