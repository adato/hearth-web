'use strict'

var defaultLanguage = 'en';
var defaultLanguageUrl = 'cs'; // language version on root = /

// language based on browser settings
var langBrowser = window.navigator.userLanguage || window.navigator.language;

// language based on url path
var langUrl = document.location.pathname.replace(/^\/|\/$/g, '').split("/").slice(0, 1).toString();

function redirectToLangVersion(lang, langsAvailable) {
	var loc = document.location.pathname.replace(/^\/|\/$/g, '');
	var langLoc = loc.split("/").slice(0, 1).toString();

	if(langsAvailable.indexOf(langLoc) == -1)
		loc = langPathMap[lang]+loc;
	else
		loc = loc.replace(/^.*\//g, lang);

	console.log("New url is: ", loc);
	window.location = loc;
}

// all langs except default cs language
// what langs can be specified in url as /lang/...
var langsAvailable = ['en'];
var langTranslationMap = {
	'en': 'en',
	'cs': 'cs',
	'sk': 'cs',
};

var langPathMap = {
	'cs': '/',
	'en': '/en/',
};

langBrowser = (langBrowser) ? langBrowser.substring(0, 2).toLowerCase() : defaultLanguage;
langBrowser = (langTranslationMap[langBrowser]) ? langTranslationMap[langBrowser] : defaultLanguage;


if(langsAvailable.indexOf(langUrl) == -1)
	langUrl = defaultLanguageUrl;

console.log('Languages are: browser = ',langBrowser,' | url = ', langUrl, ' | cookie = ', $.cookie('language'));


// if there is not set language in cookie yet
// use language from browser
if(!$.cookie('language')) {
	console.log('There is no language in cookie, setting value from browser', langBrowser);
	$.cookie('language', langBrowser, {path: '/', expire: 20 * 365});
}

// if we are not on right url, redirect
if(langUrl != $.cookie('language')) {
	console.log('Language in URL is not the same as value in cookies, redirecting to ', langUrl);
	redirectToLangVersion($.cookie('language'), langsAvailable);
}