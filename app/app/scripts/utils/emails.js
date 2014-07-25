'use strict';
/**
 * @ngdoc directive
 * @name hearth.utils.input
 * @description defines types for emails - list of emails, separated by comma ","
 * @restrict A
 */
angular.module('hearth.utils').directive('input', function() {
	return {
		restrict: 'E',
		require: '?ngModel',
		link: function(scope, element, attr, ctrl) {
			if (attr.type === 'emails' && ctrl) {

				var i, email, emails,
					EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i; //Angular email regexp

				ctrl.$parsers.push(function(viewValue) {
					viewValue = viewValue || '';
					emails = viewValue.split(',');
					for (i = 0; i < emails.length; i++) {
						email = emails[i].trim();
						if (email && !emails[i].trim().match(EMAIL_REGEXP)) {
							ctrl.$setValidity('emails', false);
							return;
						}
					}
					ctrl.$setValidity('emails', true);
					return viewValue;
				});
			}
		}
	};
});