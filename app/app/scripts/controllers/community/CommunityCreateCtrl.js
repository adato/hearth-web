'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityCreateCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('CommunityCreateCtrl', [
	'$scope', '$rootScope', 'UnauthReload',
	function($scope, $rootScope, UnauthReload) {

		// using directive communityCreateEdit
		UnauthReload.check();
	}
]);
