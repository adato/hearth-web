'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('EmailSharing', [
	'$scope', '$rootScope', 'Notify', 'Sharing',
	function($scope, $rootScope, Notify, Sharing) {
		$scope.sending = false;
		$scope.showErrors = false;
		$scope.sharing = {
			emails: '',
			message: '',
			id: $scope.post._id
		};
		$scope.showErrors = {
			emails: false,
			message: false,
		}

		$scope.showFinished = function() {
			$(".email-sharing").slideToggle();
			setTimeout(function() {
				$scope.closeThisDialog();
			}, 5000);
		};

		$scope.sendEmail = function() {

			$rootScope.globalLoading = true;
			$scope.sending = true;
			
			Sharing.emailPost($scope.sharing, function(res) {
                
				$scope.sending = false;
                $rootScope.globalLoading = false;
                $scope.showFinished();
                // Notify.addSingleTranslate('NOTIFY.POST_SPAM_REPORT_SUCCESS', Notify.T_SUCCESS);
            }, function(err) {
                
				$scope.sending = false;
                $rootScope.globalLoading = false;
                Notify.addSingleTranslate('NOTIFY.POST_SPAM_REPORT_FAILED', Notify.T_ERROR,  '.notify-report-container');
            });
		};
	}
]);