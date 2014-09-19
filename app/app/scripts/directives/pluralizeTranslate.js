'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.pluralizeTranslate
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('pluralizeTranslate', [
	'$translate', '$rootScope',
	function($translate, $rootScope) {
		return {
			transclude: true,
			restrict: 'E',
			scope: {
				count: "=",
				key: "=",
			},
			template: '<span ng-pluralize count="count" when="translateStrings"></span>',
			link: function($scope, el, attrs) {
				$scope.translateStrings = null;

				function refreshTranslation(key) {
					console.log("translating: " + key, $rootScope.languageInited);
					if($rootScope.languageInited) {
						$scope.translateStrings = jQuery.parseJSON($translate(key));
					}
				}

				$scope.$watch("key", refreshTranslation);
				
				$rootScope.$on("languageInited", function() {
					refreshTranslation($scope.key);
				});
				$rootScope.languageInited && refreshTranslation($scope.key);
			}
		};
	}
]);