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

					console.log("translating: " + key, $rootScope.languageInited, $translate(key));
					if($rootScope.languageInited) {
						console.log("translating: " + key, $rootScope.languageInited, $translate(key));
						try {
							$scope.translateStrings = jQuery.parseJSON($translate(key));
					    } catch (e) {
							$scope.translateStrings = null;
					    }
					}
				}

				$scope.$watch("key", refreshTranslation);
				if( $rootScope.languageInited ) {
					console.log("INITED");
					refreshTranslation($scope.key);
				} 
				$rootScope.$on("languageInited", function() {
					console.log("INITED_EVENT");
					refreshTranslation($scope.key);
				});
			}
		};
	}
]);