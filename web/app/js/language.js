'use strict'

var defaultLanguage = 'en';
var defaultLanguageUrl = 'cs'; // language version on root = /

// hack - put jquery cookie function to link onClick event
window.jCookie = $.cookie;


// language based on browser settings
var langBrowser = window.navigator.userLanguage || window.navigator.language;

// language based on url path
var langUrl = document.location.pathname.replace(/^\/|\/$/g, '').split("/").slice(0, 1).toString();

function redirectToLangVersion(lang, langsAvailable) {
	var loc = document.location.pathname.replace(/^\/|\/$/g, '');
	var langLoc = loc.split("/").slice(0, 1).toString();

	if(langsAvailable.indexOf(langLoc) == -1)
		loc = langPathMap[lang]+loc;
	else {

		var locParts = loc.split('/');
		if(locParts.length)
			locParts.shift();

		loc = langPathMap[lang] + locParts.join('/');
	}

	if(loc == 'undefined') {
		loc = defaultLanguage;
		window.jCookie('language', defaultLanguage, {path: '/', expires: 20 * 365});
	}

	console.log("New url is: ", loc);
	window.location = loc;
}

function changeLanguage(lang) {
	console.log('Settings language to cookies:', lang);
	
	window.jCookie('language', lang, {path: '/', expires: 20 * 365});
	return true;
}

// all langs except default cs language
// what langs can be specified in url as /lang/...
var langsAvailable = ['en', 'sk'];
var langTranslationMap = {
	'en': 'en',
	'cs': 'cs',
	'sk': 'sk',
};

var langPathMap = {
	'cs': '/',
	'en': '/en/',
	'sk': '/sk/',
};

langBrowser = (langBrowser) ? langBrowser.substring(0, 2).toLowerCase() : defaultLanguage;
langBrowser = (langTranslationMap[langBrowser]) ? langTranslationMap[langBrowser] : defaultLanguage;


if(langsAvailable.indexOf(langUrl) == -1)
	langUrl = defaultLanguageUrl;

console.log('Languages are: browser = ',langBrowser,' | url = ', langUrl, ' | cookie = ', $.cookie('language'));

if (/prerender|bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
    console.log('Don\'t change language for crawlers');
} else {
    console.log('Regular visitor - checking language');

	// if there is not set language in cookie yet
	// use language from browser
	if(!$.cookie('language')) {
		console.log('There is no language in cookie yet');
		changeLanguage(langBrowser, $);
	}

	// if we are not on right url, redirect
	if(langUrl != $.cookie('language')) {
		console.log('Language in URL is not the same as value in cookies, redirecting to ', $.cookie('language'));
		redirectToLangVersion($.cookie('language'), langsAvailable);
	}
}
