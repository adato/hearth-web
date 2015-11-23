'use strict';

/**
 * @ngdoc service
 * @name hearth.services.$feature
 * @description 
 */

angular.module('hearth.services').provider('$feature', function() {
	var featureCookies, isEnabled;
	featureCookies = function() {
		return document.cookie.split('; ').reduce(function(cookies, cookie) {
			var index, name, value;
			if (cookie.indexOf('FEATURE_') !== 0) {
				return cookies;
			}
			index = cookie.indexOf('=');
			name = cookie.substring(8, index);
			value = !!cookie.substring(index + 1);
			cookies[name] = value;
			return cookies;
		}, {});
	};
	isEnabled = function(name, defaultValue) {
		if (defaultValue == null) {
			defaultValue = true;
		}
		if (featureCookies().hasOwnProperty(name)) {
			return featureCookies()[name];
		} else if ($$config.features && $$config.features.hasOwnProperty(name)) {
			return $$config.features[name];
		} else {
			return defaultValue;
		}
	};
	this.$get = function() {
		return {
			isEnabled: isEnabled
		};
	};
	this.isEnabled = isEnabled;
	return this;
});
