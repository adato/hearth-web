'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.mailgunValidator
 * @description Get an email validated against Mailgun validator service. 
 * @restrict A
 */


// directive used as validator ( <input ... mailgun-validator> )
angular.module('hearth.directives').directive('mailgunValidator', ['$q',
	function($q) {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {

				ctrl.$asyncValidators.mailgun = function(modelValue, viewValue) {
					var value = modelValue || viewValue;
					var def = $q.defer();

					scope.$broadcast('mailgun-did-you-mean-hide');

					var inProgress = function() {}

					var onSuccess = function(data) {
						if (data.did_you_mean != '') {
							scope.$broadcast('mailgun-did-you-mean', {
								'model': (attrs.mailgunValidator ? attrs.mailgunValidator : null),
								'did_you_mean': data.did_you_mean
							});
						}

						if (data.is_valid) {
							def.resolve();
						} else {
							def.reject();
						}
					}

					var onError = function() {
						def.reject();
					}
					if (value == '' || value == null) {
						def.reject();
					}
					$(element).run_mailgun_validator(value, {
						api_key: 'pubkey-20c5fd734d4e505b2e90e43653400612',
						in_progress: inProgress,
						success: onSuccess,
						error: onError
					}, $(element));

					return def.promise;
				}
			}
		};
	}
]);


// directive used as a place to offer alternative emails to what user wrote to input
angular.module('hearth.directives').directive('mailgunValidatorDidYouMean', ['$q',
	function($q) {
		return {
			scope: {
				'target': '=',
			},
			template: '<span ng-show="showOptions" class="mailgun-validator-did-you-mean" test-beacon="mailgun-validator-did-you-mean">{{:: \'AUTH.MAILGUN.DID_YOU_MEAN\' | translate }} <a ng-click="target = options">{{ options }}</a> ?<br><br></span>',
			link: function(scope, element, attrs) {
				scope.showOptions = false;
				scope.$on('mailgun-did-you-mean', function(event, options) {
					if (is(options) && is(options['did_you_mean'])) {
						// if there is an attribute AND id matches current model, OR no id is set
						if ((typeof attrs.id != 'undefined' && is(options['model']) && options['model'] == attrs.id) || typeof attrs.id == 'undefined') {
							scope.showOptions = true;
							scope.options = options['did_you_mean'];
						}
					} else {
						scope.showOptions = false;
					}
				});
				scope.$on('mailgun-did-you-mean-hide', function() {
					scope.showOptions = false;
				});

				// helper
				function is(value) {
					return (true === (typeof value != 'undefined' && value != '' && value != null));
				}
			}
		};
	}
]);