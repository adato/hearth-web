(function(window) {
	'use strict'

	var cookieFactory = window.aeg.cookieFactory;

	//
	// REFERRALS
	//
	var referrer = 'referrals';

	/**
	*	Function that gets a referrer cookie if possible and returns all tokens as an array
	*/
	function getReferrerArray() {
		var c = cookieFactory.get(referrer);
		c = (c ? c.split('-') : []);
		// if referrer cookie exists but is not an array, return empty array
		if (Object.prototype.toString.call(c) !== '[object Array]') return [];
		return c;
	}

	/**
	*	Function that saves an array of tokens into cookie
	*	@param arr {Array}
	*/
	function saveReferrerArray(arr) {
		if (!arr || (Object.prototype.toString.call(arr) !== '[object Array]')) return;
		cookieFactory.set(referrer, arr.join('-'));
	}
	var search = window.location.search;

	/**
	 *	If the user has come from a referrer link with a token, save this token to cookie
	 */
	if (search) {
		var searchItems = search.slice(1).split('&');
		for (var i = searchItems.length;i--;) {
			var item = searchItems[i].split('=');
			if (item[0] === referrer) {
				var referrerArray = getReferrerArray();
				//only add unique referrals
				if (referrerArray.indexOf(item[1]) === -1) {
					referrerArray.push(item[1]);
					return saveReferrerArray(referrerArray);
				}
			}
		}
	}
	// /REFERRALS

})(window);