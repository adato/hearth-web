;(function(window) {
	'use strict'

	var en = 'en',
		cs = 'cs',
		sk = 'sk'

	var defaultLanguage = en,
		languageCookie = 'language';

	// all langs except default en language
	// what langs can be specified in url as /lang/...
	var langsAvailable = [cs, sk];

	var langTranslationMap = {};
	langTranslationMap[en] = en;
	langTranslationMap[cs] = cs;
	langTranslationMap[sk] = sk;

	var langPathMap = {};
	langPathMap[en] = '/';
	langPathMap[cs] = '/cs/';
	langPathMap[sk] = '/sk/';

	// expose changeLanguage function and variables to templates
	window.changeLanguage = changeLanguage;
	window.language = langTranslationMap;

	/**
	 *	LANGUAGE IMPORTANCE
	 *
	 *		1. cookie
	 *		2. browser language
	 *		3. default language - EN
	 */

	// language based on browser settings
	var langBrowser = window.navigator.userLanguage || window.navigator.language;

	// language based on url path
	var langUrl = document.location.pathname.replace(/^\/|\/$/g, '').split('/').slice(0, 1).toString();

	function redirectToLangVersion(lang, langsAvailable) {
		var loc = document.location.pathname.replace(/^\/|\/$/g, '');
		var langLoc = loc.split('/').slice(0, 1).toString();

		if (langsAvailable.indexOf(langLoc) == -1) {
			loc = langPathMap[lang] + loc;
		} else {
			var locParts = loc.split('/');
			if (locParts.length) locParts.shift();

			loc = langPathMap[lang] + locParts.join('/');
		}

		if (loc == 'undefined') {
			loc = defaultLanguage;
			window.aeg.cookieFactory.set(languageCookie, defaultLanguage);
		}

		// console.log("New url is: ", loc);
		window.location = loc;
	}

	function changeLanguage(lang, relocate) {
		// console.log('Settings language to cookies:', lang);

		// window.jCookie('language', lang, {path: '/', expires: 20 * 365});
		window.aeg.cookieFactory.set(languageCookie, lang);
		return (relocate ? window.location = langPathMap[lang] : true);
	}

	langBrowser = (langBrowser) ? langBrowser.substring(0, 2).toLowerCase() : defaultLanguage;
	langBrowser = (langTranslationMap[langBrowser]) ? langTranslationMap[langBrowser] : defaultLanguage;

	if (langsAvailable.indexOf(langUrl) == -1) langUrl = defaultLanguage;

	// ASSIGN LANG ATTRIBUTE TO HTML TAG
	document.querySelector('html').setAttribute('lang', langUrl);

	// console.log('Languages are: browser =', langBrowser, '| url =', langUrl, '| cookie =', window.aeg.cookieFactory.get(languageCookie));

	if (/prerender|bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
	    // console.log('Don\'t change language for crawlers');
	} else {
	    // console.log('Regular visitor - checking language');

		// if there is not set language in cookie yet
		// use language from browser
		if (!window.aeg.cookieFactory.get(languageCookie)) {
			// console.log('There is no language in cookie yet');
			changeLanguage(langBrowser);
		}

		// if we are not on right url, redirect
		if (langUrl != window.aeg.cookieFactory.get(languageCookie)) {
			// console.log('Language in URL is not the same as value in cookies, redirecting to ', window.aeg.cookieFactory.get(languageCookie));
			redirectToLangVersion(window.aeg.cookieFactory.get(languageCookie), langsAvailable);
		}
	}

})(window);