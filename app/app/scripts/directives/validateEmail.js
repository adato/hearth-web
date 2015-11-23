'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.validateEmail
 * @description Validate email input with custom validator
 * @require ngModel
 */

angular.module('hearth.directives').directive('validateEmail', ['Validators', function(Validators) {

	return {
		require: 'ngModel',
		restrict: '',
		link: function(scope, elm, attrs, ctrl) {
			// only apply the validator if ngModel is present and Angular has added the email validator
			if (ctrl && ctrl.$validators.email) {

				// this will overwrite the default Angular email validator
				ctrl.$validators.email = function(modelValue) {
					var validatorResult, re;

					if (attrs.hasOwnProperty("adminEmail"))
						re = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))(#[0-9a-zA-Z]*){0,1}$/);

					validatorResult = Validators.email(modelValue, re);
					return ctrl.$isEmpty(modelValue) || validatorResult || false
				};
			}
		}
	};
}]);
