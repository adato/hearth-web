'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.privacySelector
 * @description Allows user to select privacy model for particular element
 * @restrict E
 */

angular.module('hearth.directives').directive('privacySelector', [
	'$rootScope', '$translate',
	function($rootScope, $translate) {
		return {
			restrict: 'AE',
			replace: true,
			scope: {
				ngDisabled: '=',
			},
			templateUrl: 'templates/directives/privacySelector.html',
			link: function($scope) {
				$scope.selectValues = [{
					title: $translate.instant('PROFILE.CONTACT.VISIBILITY_NOBODY'),
					value: 'nobody'
				}, {
					title: $translate.instant('PROFILE.CONTACT.VISIBILITY_FOLLOWEES'),
					value: 'followees'
				}, {
					title: $translate.instant('PROFILE.CONTACT.VISIBILITY_EVERYBODY'),
					value: 'everybody'
				}]
			}
		};
	}
]);