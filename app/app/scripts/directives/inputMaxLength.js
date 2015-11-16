'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.inputMaxLength
 * @description
 * @restrict A
 */
angular.module('hearth.directives').directive('inputMaxLength', ['$timeout',
	function($timeout) {
		return {
			restrict: 'AE',
			replace: true,
			transclude: true,
			scope: {
				inputType: '@',
				name: '@',
				placeholder: '@',
				maxLength: '@',
				minLength: '@',
				showCounter: '=',
				model: '=',
				resized: "&"
			},
			templateUrl: 'templates/directives/inputMaxLength.html',
			link: function(scope, element, attrs) {
				scope.showError = false;

				setTimeout(function() {
					var el = ($(element).prop('tagName') == 'TEXTAREA') ? $(element) : $('textarea', element);
					var p = el.attr('placeholder');
					el.attr('placeholder', '').autosize({
						append: '',
						callback: scope.resized
					}).show().trigger('autosize.resize').attr('placeholder', p);
				});


				scope.$watch('model', function(val) {
					if (val) {
						scope.typed = val.length;
					} else {
						scope.typed = 0;
					}
				});

				if (scope.showCounter) {

				}
			}
		};
	}
]);