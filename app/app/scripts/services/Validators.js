'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Validators
 * @description This service contains some functions for validating
 */

angular.module('hearth.services').service('Validators', [
	function() {
		var self = this;

		var EMAIL_VALIDATOR_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var URL_VALIDATOR_REGEXP = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

		var SOCIAL_NETWORK_VALIDATOR_REGEXP = {
			'twitter': {
				'url': 'twitter.com\/.*'
			},
			'facebook': {
				'url': 'facebook.com\/.*'
			},
			'linkedin': {
				'url': 'linkedin.com\/.*'
			},
			'googleplus': {
				'url': 'plus.google.com\/.*'
			}
		};

		this.match = function(e, regex) {
			var ret = e.match(regex);
			ret = (ret || false) && true;
			//console.log("ret:", ret)
			return ret;

		};

		// validate email
		this.email = function(e) {
			return this.match(e, EMAIL_VALIDATOR_REGEXP);
		};

		// validate emails in array
		this.emails = function(arr) {
			for (var i in arr)
				if (!self.email(arr[i]))
					return false;
			return true;
		};

		this.url = function(e) {
			return (e.length == 0 || this.match(e, URL_VALIDATOR_REGEXP));
		}

		this.urls = function(arr) {
			for (var i in arr)
				if (!self.url(arr[i]))
					return false;
			return true;
		}

		this.social = function(e, type) {
			if (!e) return true;
			var socUrlRegexp = SOCIAL_NETWORK_VALIDATOR_REGEXP[type].url;
			if (!socUrlRegexp) return false;
			var ret = this.match(e, socUrlRegexp) && this.url(e);
			return ret;
		}

		return this;
	}
]);