'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.emailValidator
 * @description Get an email valiated against the server
 * @restrict A
 */
angular.module('hearth.directives').directive('emailValidator', ['Email', '$q',
	function(Email, $q) {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				ctrl.$asyncValidators.used = function(modelValue, viewValue) {
					var value = modelValue || viewValue;
					var def = $q.defer();

					Email.exists({
						email: value
					}, function(ok) {
						// email exists, ie is already registered
						if (ok.ok === true)
							def.reject();
						else
							def.resolve();
					}, function(err) {
						// can be registered
						def.resolve();
					});
					return def.promise;
				}
			}
		};
	}
]);