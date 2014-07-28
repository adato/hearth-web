'use strict';

angular.module('hearth.filters', [])
/**
 * @ngdoc filter
 * @name hearth.filters.urlize
 * @description
 */
.filter('urlize', function() {
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
})
/**
 * @ngdoc filter
 * @name hearth.filters.apiPrefix
 * @description
 */
.filter('apiPrefix', function() {
	return function(input) {
		return $$config.apiPath + input;
	};
})
/**
 * @ngdoc filter
 * @name hearth.filters.UTCdate
 * @description Returns date in UTC zone
 */
.filter('UTCdate', function() {
	return function(timestamp) {
		return parseInt(timestamp, 10) - (new Date()).getTimezoneOffset() * 60000;
	};
})
/**
 * @ngdoc filter
 * @name hearth.filters.ellipsis
 * @description Returns shortened text
 *
 * @param {String} text text to shorten
 * @param {String} limit limit count of characters (optional) (default:127)
 *
 * @return {String} shortened text
 */
.filter('ellipsis', function() {
	return function(text, limit) {
		text = (text || '').trim();
		limit = Math.abs(limit || 127);

		var originalLength = text.length;

		text = text.substring(0, limit).trim();
		if (originalLength > text.length && text[text.length - 1] !== '…') {
			text += '…';
		}
		return text;
	};
})

/**
 * @ngdoc filter
 * @name hearth.filters.timeAgoService
 * @description Returns date interval converted to text
 */
.filter('ago', [
	'timeAgoService',

	function(timeAgoService) {
		return function(value) {
			var nowDate = new Date(),
				valueDate = Date.parse(value);

			return timeAgoService.inWords(nowDate.getTime() - valueDate);
		};
	}
]);