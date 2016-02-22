'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Rights
 * @description
 */

angular.module('hearth.services').factory('Rights', ['$rootScope', function($rootScope) {

	var factory = {
		userHasRight: userHasRight
	};

	function userHasRight(rightString) {
		if (!rightString) return true;
		var rights = rightString.split('.'),
			prog = $rootScope.user.rights;
		if (prog && rights) {
			while (rights.length) {
				prog = prog[rights.shift()];
				if (!prog) return false;
			}
			return true;
		};
		return false;
	}

	return factory;

}]);