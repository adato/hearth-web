'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.emailValidator
 * @description Get an email valiated against the server
 * @restrict A
 */
angular.module('hearth.directives').directive('emailExistsValidator', ['Email', '$q', function(Email, $q) {

	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			ctrl.$asyncValidators.used = function(modelValue, viewValue) {
				var value = modelValue || viewValue
				var def = $q.defer()

				Email.exists({
					email: value
				}).$promise.then(ok => {
					// email exists, ie is already registered
					def.reject()
				}).catch(err => {
					// can be registered
					def.resolve()
				})
				return def.promise
			}
		}
	}

}])