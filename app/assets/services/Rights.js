'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Rights
 * @description
 */

angular.module('hearth.services').factory('Rights', ['$rootScope', function($rootScope) {

	const factory = {
		userHasRight
	}

	return factory

	/////////////////

	function userHasRight(rightString) {
		if (!rightString) return true
		return $rootScope.loggedUser && $rootScope.loggedUser.permissions && ($rootScope.loggedUser.permissions.indexOf(rightString) > -1)
	}

}])