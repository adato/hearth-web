;(function(window, config) {
	'use strict'

	window.aeg = {
		$: $,
		cookieFactory: {
			get: cookieGet,
			set: cookieSet,
			remove: cookieRemove
		},
		fe: fe,
		findParentBySelector: findParentBySelector,
		formatDate: formatDate,
		request: request,
		requestApi: requestApi,
		shuffle: shuffle,
		throttle: throttle
	};

	////////////////////

	/**
	 *	Query document element finder
	 */
	function $(q) {
		return document['querySelector' + (q.slice(0,1) === '#' ? '' : 'All')](q);
	}

	function cookieGet(cname) {
		var name = cname + '=';
		var cookies = document.cookie.split(';');
		for (var i = 0;i < cookies.length;i++) {
			var c = cookies[i];
			while (c.charAt(0) === ' ') c = c.substring(1);
			if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
		}
		return '';
	}

	function cookieRemove(cname) {
		document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}

	function cookieSet(cname, cvalue, path) {
		document.cookie = cname + '=' + cvalue + '; expires=Thu, 31 Jan 3131 00:00:00 GMT' + (path ? '; path=' + path : '');
	}

	/**
	 *	For each function repeater
	 */
	function fe(q, fn) {
		if (! (q && q.length)) return;
		for (var i = 0, l = q.length; i < l; fn(q[i]), i++);
	}

	function findParentBySelector(elem, selector) {
		var all = document.querySelectorAll(selector);
		var cur = elem;
		while (cur && !collectionHas(all, cur)) {
			cur = cur.parentNode;
		}
		return cur; //will return null if not found
	}
	// findParentBySelector helping function
	function collectionHas(a, b) {
		for(var i = 0, len = a.length;i < len;i++) {
			if(a[i] === b) return true;
		}
		return false;
	}

	function formatDate(date) {
		if (!date || !typeof(date.getDate) === 'function') return '';
		return date.getDate() + '.\u00A0' + (date.getMonth() + 1) + '.\u00A0' + date.getFullYear();
	}

	/**
	 *	XHR
	 */
	function request(method, path) {
		return prepareRequest(method, path);
	}
	function requestApi(method, path, params) {
		params.toApi = true;
 		return prepareRequest(method, path, params);
 	}
	function prepareRequest(method, path, params) {
		params = params || {};

		var xhr = new XMLHttpRequest();
		xhr.open(method, path);

		if (params.toApi) {
	 		xhr.setRequestHeader('X-API-TOKEN', params.token);
	 		xhr.setRequestHeader('Accept', 'application/vnd.hearth-v1+json');
	 		xhr.setRequestHeader('X-API-VERSION', '1');
 			xhr.setRequestHeader('Content-Type', 'application/json');
		}

		return xhr;
	}

	/**
	 *	Array shuffler
	 */
	function shuffle(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	function throttle(callback, limit) {
	    var wait = false;
		limit = limit || 10;
	    return function() {
	        if (!wait) {
	            callback.call();
	            wait = true;
	            setTimeout(function() {
	                wait = false;
	            }, limit);
	        }
	    }
	}

})(window, window.hearthConfig);