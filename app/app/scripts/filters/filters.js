'use strict';

angular.module('hearth.filters', []).filter('urlize', function() {
	return function(input) {
		if (input) {
			var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
				pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
				emailAddressPattern = /\w+@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6})+/gim;

			return input
				.replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
				.replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>')
				.replace(emailAddressPattern, '<a href="mailto:$&" target="_blank">$&</a>');
		}
	};
}).filter('apiPrefix', function() {
	return function(input) {
		return $$config.apiPath + input;
	};
}).filter('UTCdate', function() {
	return function(timestamp) {
		return parseInt(timestamp, 10) - (new Date()).getTimezoneOffset() * 60000;
	};
});