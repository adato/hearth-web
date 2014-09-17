'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.pluralizeTranslate
 * @description 
 * @restrict A
 */

angular.module('hearth.directives').directive('pluralizeTranslate', [
	'$translate',
	function($translate) {
		return {
			transclude: false,
			restrict: 'E',
			scope: {
				count: "=",
				key: "=",
			},
			// template: '{{ translateDict | json }}',
			// template: '<ng-pluralize count="count" when="{{ translateDict }}">'+'</ng-pluralize>',
			template: '<span ng-pluralize count="count" when="translateStrings"></span>',
			link: function($scope, el, attrs) {
				$scope.translateDict = {};
				$scope.count= 1;
				console.log($scope.count);
				console.log($scope.key);

				$scope.translateStrings = {'0': '0 Süßigkeiten ausgewählt',
					'one': '1 Süßigkeiten zum Verkauf',
					'other': '{} Süßigkeiten zum Verkauf.'
				};

				$scope.$watch("key", function(key) {
					$scope.translateStrings = JSON.parse($translate(key));
				});
			}
		};
	}
]);

angular.module('hearth.directives').directive('ngPluralize', function() {
  return {
    restrict : 'EA',
    priority : 1, 
    transclude : 'element',
    link : function(scope, element, attrs, ctrl, transclude) {
      scope.$watch(attrs.when, function(when) {
        if (when) {
          transclude(function(clone) {
            element.replaceWith(clone);
            element = clone;
          });
        }
      });
  }
  };
});