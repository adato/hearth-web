'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.inputMaxLength
 * @description
 * @restrict AE
 */
angular.module('hearth.directives').directive('inputMaxLength', ['$timeout',
	function ($timeout) {
		return {
			restrict: 'AE',
			replace: true,
			transclude: true,
			require: '^form',
			scope: {
				inputType: '@',
				name: '@',
				placeholder: '@',
				maxLength: '@',
				minLength: '@',
				required: '@',
				showCounter: '=',
				model: '=',
				resized: "&"
			},
			templateUrl: 'templates/directives/inputMaxLength.html',
			link: function (scope, element, attrs, formCtrl) {
				scope.required = scope.required ? true : false;

				setTimeout(function () {
					var el = ($(element).prop('tagName') === 'TEXTAREA') ? $(element) : $('textarea', element);
					var p = el.attr('placeholder');
					el.attr('placeholder', '').autosize({
						append: '',
						callback: scope.resized
					}).show().trigger('autosize.resize').attr('placeholder', p);
				});
				scope.isBlur = function () {
					scope.showErrorMin = true;
				}
				scope.isFocus = function () {
					scope.showErrorMin = false;
				}

				scope.$watch('model', function (val) {
					scope.form = formCtrl[scope.name];

					if (val) {
						scope.typed = val.length;

						if (scope.typed > scope.maxLength) {
							scope.showError = true;
						} else {
							scope.showError = false;
						}
					} else {
						scope.typed = 0;
						scope.showError = false;
					}
				});
			}
		};
	}
]);