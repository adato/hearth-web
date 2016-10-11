'use strict';

/**
 * @ngdoc service
 * @name hearth.services.RubySerializer
 * @description Custom serializer for ruby that does not encode URI component keys
 *
 * @warning manual encoding is required when using this serializer
 * @notice compatible with Angular version 1.4.9
 */

angular.module('hearth.services').factory('RubySerializer', ['$window', function($window) {

	function forEachSorted(obj, iterator, context) {
		var keys = Object.keys(obj).sort();
		for (var i = 0; i < keys.length; i++) {
			iterator.call(context, obj[keys[i]], keys[i]);
		}
		return keys;
	}

	function encodeUriQuery(val, pctEncodeSpaces) {
		return encodeURIComponent(val).
		replace(/%40/gi, '@').
		replace(/%3A/gi, ':').
		replace(/%24/g, '$').
		replace(/%2C/gi, ',').
		replace(/%3B/gi, ';').
		replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
	}

	function serializeValue(v) {
		if (v !== null && typeof v === 'object') {
			return JSON.stringify(v);
		}
		return v;
	}

	function forEach(obj, iterator, context) {
		var key, length;
		if (obj) {
			// 		if (isFunction(obj)) {
			// 			for (key in obj) {
			// 		        // Need to check if hasOwnProperty exists,
			// 		        // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
			// 		        if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
			// 		          iterator.call(context, obj[key], key, obj);
			// 		        }
			// 			}
			// 		} else if (isArray(obj) || isArrayLike(obj)) {
			var isPrimitive = typeof obj !== 'object';
			for (key = 0, length = obj.length; key < length; key++) {
				if (isPrimitive || key in obj) {
					iterator.call(context, obj[key], key, obj);
				}
			}
			// 		} else if (obj.forEach && obj.forEach !== forEach) {
			// 			obj.forEach(iterator, context, obj);
			// 		} else if (isBlankObject(obj)) {
			// 			// createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
			// 			for (key in obj) {
			// 				iterator.call(context, obj[key], key, obj);
			// 			}
			// 		} else if (typeof obj.hasOwnProperty === 'function') {
			// 	    	// Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
			// 	    	for (key in obj) {
			// 	        	if (obj.hasOwnProperty(key)) {
			// 	        		iterator.call(context, obj[key], key, obj);
			// 	        	}
			// 	    	}
			// 	    } else {
			// 	      // Slow path for objects which do not have a method `hasOwnProperty`
			// 	    	for (key in obj) {
			// 	        	if (hasOwnProperty.call(obj, key)) {
			// 	        		iterator.call(context, obj[key], key, obj);
			// 	        	}
			// 	    	}
			// 	    }
		}
		return obj;
	}

	return function(params) {
		if (!params) return '';
		var parts = [];
		forEachSorted(params, function(value, key) {
			if (value === null || typeof value === 'undefined') return;
			if ($window.Array.isArray(value)) {
				forEach(value, function(v, k) {
					parts.push(key + '=' + encodeUriQuery(serializeValue(v)));
				});
			} else {
				parts.push(key + '=' + encodeUriQuery(serializeValue(value)));
			}
		});
		return parts.join('&');
	};

}]);