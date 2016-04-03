'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.userIntelReadout
 * @description Writes out a table comprising information about a user
 * @restrict E
 */

angular.module('hearth.directives').directive('userIntelReadout', [
	'IsEmpty',
	function(IsEmpty) {
		return {
			restrict: 'E',
			scope: {
				entity: '=',
				type: '='
			},
			templateUrl: 'templates/directives/userIntelReadout.html',
			link: function(scope) {
				var validTypes = ['informative', 'all'];
				var index = validTypes.indexOf(scope.type);
				scope.readoutTypeIndex = ((index > -1) ? index : validTypes.length);
				scope.isEmpty = IsEmpty;
			}
		}
	}
]);