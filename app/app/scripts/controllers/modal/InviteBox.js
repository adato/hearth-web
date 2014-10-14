'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.Tutorial
 * @description
 */

angular.module('hearth.controllers').controller('InviteBox', [
	'$scope', '$rootScope', 'Invitation', 'OpenGraph',
	function($scope, $rootScope, Invitation, OpenGraph) {
		$scope.showEmailForm = false;
		$scope.inv = {
			text: '',
			addrs: '',
		};
		$scope.inviteInfo = OpenGraph.getDefaultInfo();

		function handleResult (res) {
			console.log(res);
			alert("OK");
		}

		$scope.init = function() {
			// dont open window for unauthorized users
			if(!$rootScope.loggedUser._id)
				return $scope.closeThisDialog();
		};

		$scope.sendEmailInvitation = function() {
			Invitation.add($scope.inv, handleResult);
		};

		// func will show or hide email form
		$scope.toggleEmailForm = function() {
			$scope.showEmailForm = ! $scope.showEmailForm;
		};

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);