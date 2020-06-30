'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.StaticPageCtrl
 * @description
 */
 
angular.module('hearth.controllers').controller('AboutCtrl', [
	'$state', '$scope', '$rootScope', 'Info',
	function($state, $scope, $rootScope, Info) {

		$scope.info = { 
			usersCount: 22341
		}

		$scope.init = function() {
			Info.get().$promise.then(function (result) {
				$scope.info.usersCount = result.users.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
			});
		}

		$scope.init();


	}
]);