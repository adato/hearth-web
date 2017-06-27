'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.emailValidator
 * @description Get an email valiated against the server
 * @restrict A
 */
angular.module('hearth.directives').directive('emailValidator', ['$q', 'Validators', function($q, Validators) {

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
			ngModel.$parsers.push(val => {
				const valid = val ? Validators.emails(val.split(',').map(e => e.trim())) : false
        ngModel.$setValidity('format', valid)
        return valid ? val : void 0
			})
			ngModel.$formatters.push(val => {
				ngModel.$setValidity('format', val ? Validators.emails(val.split(',').map(e => e.trim())) : false)
				return val
			})
		}
	}

}])