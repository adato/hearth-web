'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FormValidator
 * @description This contains validate functions for form inputs
 */

angular.module('hearth.services').service('FormValidator', [
	'$translate',
	function($translate) {
		var self = this;

		this.validateEmail = function(email) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			return email.trim().match(re);
		}

		$scope.validateEmails = function(emails) {
			var valid = true;
			// are given emails valid?
			jQuery.each(emails, function(key, email) {

				// this will set false to valid and call break when not valid
				return valid = !!validateEmail(email);
			});
			return valid;
		};

		return this;
	}
]);
