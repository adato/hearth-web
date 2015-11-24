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
		return function(text, limit, fullWordsOnly) {

			var decodeEntities = (function() {
				// this prevents any overhead from creating the object each time
				var element = document.createElement('div');

				function decodeHTMLEntities(str) {
					if (str && typeof str === 'string') {
						// strip script/html tags
						str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
						str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
						element.innerHTML = str;
						str = element.textContent;
						element.textContent = '';
					}

					return str;
				}

				return decodeHTMLEntities;
			})();

			text = (text || '').trim();
			text = decodeEntities(text);

			limit = Math.abs(limit || 127);
			var originalLength = text.length;

			if (fullWordsOnly) {
				var whiteChars = ' \t,\n'.split('');
				// take full words only
				for (var i = limit; i < originalLength; i++) {

					limit++;
					if (whiteChars.indexOf(text[i]) != -1) {
						break;
					}
				}
			}

			text = text.substring(0, limit).trim();

			if (fullWordsOnly) {
				var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/gi;
				var regex = new RegExp(expression);
				if (text.match(regex))
					text += " ";
			}

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
])

.filter('nl2br', function() {
	return function(text) {
		return text.replace(/&#10;/g, '<br/>').replace(/\n/g, '<br/>');
	};
})

/**
 * @ngdoc filter
 * @name hearth.filters.num
 * @description Returns int number from string
 */
.filter('num', function() {
	return function(input) {
		return parseInt(input, 10);
	}
})

/**
 * @ngdoc filter
 * @name hearth.filters.protocolfree
 * @description Returns original string (url) without http(s):// protocol
 */
.filter('protocolfree', function() {
		return function(input) {
			return input.replace("http://", "").replace("https://", "");
		}
	})
	.filter('minMax', function() {
		return function(input, min, max, postfix, blank) {
			var val = parseInt(input);
			if (!postfix && postfix != '') postfix = '+';
			if (val < min)
				return blank ? '' : min;
			if (val > max)
				return max + postfix;
			return input;
		}
	})
	.filter('highlight', function($sce) {
		return function(text, phrase) {
			if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
				'<span class="highlighted">$1</span>')

			return $sce.trustAsHtml(text)
		}
	});