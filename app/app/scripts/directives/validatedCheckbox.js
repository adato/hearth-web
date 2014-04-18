'use strict';

angular.module('hearth.directives').directive('validatedCheckbox', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var input;
			input = element.find('input');
			return scope.$watch(function() {
				var hasError, hasPristine;
				hasPristine = input.hasClass('ng-pristine');
				hasError = input.hasClass('ng-invalid');
				if (!hasError || hasPristine) {
					return element.removeClass('ng-invalid');
				} else {
					return element.addClass('ng-invalid');
				}
			});
		}
	};
});