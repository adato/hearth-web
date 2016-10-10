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
				ngModel: '=',
				relatedModel: '@'
			},
			templateUrl: 'assets/components/privacySelector/privacySelector.html',
			link: function(scope, elem, attrs) {

				attrs.$observe('relatedModel', function(val) {
					if (!val) {
						scope.ngModel = undefined;
					}
				});

				scope.selectValues = [{
					title: $translate.instant('PROFILE.CONTACT.VISIBILITY_NOBODY'),
					value: undefined
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