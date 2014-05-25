'use strict';

/**
 * @ngdoc directive
 * @name hearth.utils.withErrors
 * @description
 * @restrict A
 */

angular.module('hearth.utils').directive('withErrors', function() {
	return {
		restrict: 'A',
		require: 'form',
		link: function(scope, element, attrs, form) {
			var clearPristine, fixAutoComplete;
			fixAutoComplete = function(form, element) {
				return angular.forEach(element[0].elements, function(formControl) {
					var model;
					$(formControl).removeClass('ng-pristine');
					$(formControl).addClass('ng-dirty');
					model = form[formControl.name];
					if (!model) {
						return;
					}
					switch (formControl.type) {
						case 'checkbox':
							if ( !! model.$viewValue !== !! formControl.checked) {
								return model.$setViewValue(formControl.value);
							}
							break;
						default:
							return model.$setViewValue(formControl.value);
					}
				});
			};
			clearPristine = function(form, element) {
				form.$pristine = false;
				element.removeClass('ng-pristine');
				form.$dirty = true;
				element.addClass('ng-dirty');
				return angular.forEach(element[0].elements, function(formControl) {
					var model;
					model = form[formControl.name];
					if (!model) {
						return;
					}
					return model.$setViewValue(model.$viewValue);
				});
			};
			return element.bind('submit', function(event) {
				fixAutoComplete(form, element);
				clearPristine(form, element);
				if (!form.$valid) {
					return event.preventDefault();
				}
			});
		}
	};
});