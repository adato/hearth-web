'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.validateEmail
 * @description Validate email input with custom validator
 * @require ngModel
 */

angular.module('hearth.directives').directive('validateEmail', ['Validators', function (Validators) {

  return {
    require: 'ngModel',
    restrict: '',
    link: function (scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function (modelValue) {
          return ctrl.$isEmpty(modelValue) || Validators.email(modelValue);
        };
      }
    }
  };
});
