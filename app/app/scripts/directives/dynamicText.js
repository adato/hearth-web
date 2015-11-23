/**
 * @ngdoc directive
 * @name hearth.directives.dynamicText
 * @description Solves UI for selecting date
 * @restrict A
 */
angular.module('hearth.directives').directive('dynamicText', ['$interpolate',
	function($interpolate) {
		return {
			restrict: 'A',
			scope: {
				dynamicText: '=',
				dynamicData: '='
			},
			template: '<span ng-bind-html="text"></span>',
			link: function(scope, element, attrs) {
				function refresh() {
					scope.text = $interpolate(scope.dynamicText)(scope.dynamicData);
				}
				scope.$watch("dynamicText", refresh);
				scope.$watch("dynamicData", refresh);
				refresh();
			}
		};
	}
]);
