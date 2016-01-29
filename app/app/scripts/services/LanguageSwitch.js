'use strict';

/**
 * @ngdoc service
 * @name hearth.services.LanguageSwitch
 * @description
 */

angular.module('hearth.services').service('LanguageSwitch', [
	'$feature', '$translate', '$http', '$rootScope', 'tmhDynamicLocale', 'Session', 'Notify',
	function($feature, $translate, $http, $rootScope, tmhDynamicLocale, Session, Notify) {
		var self = this;
		this.languages = Object.keys($$config.languages);

		// init languages
		this.init = function() {
			// console.log("Language Inited");
			$rootScope.languageInited = true;
			$rootScope.$broadcast("languageInited");
		};

		// get all languages
		this.getLanguages = function() {
			return self.languages;
		};

		// test if language exists
		this.langExists = function(lang) {
			return !!~self.languages.indexOf(lang);
		};

		// switch to given language code
		this.swicthTo = function(lang, unauthOnly) {
			if (lang) {
				self.setCookie(lang);
				if (unauthOnly) {
					location.reload();
					return true;
				};

				Session.update({
					language: lang
				}, function(res) {
					location.reload();
				}, function() {
					Notify.addSingleTranslate('NOTIFY.CHANGE_LANGUAGE_FAILED', Notify.T_ERROR);
				});
			}
			return false;
		};

		// return current used language
		this.uses = function() {
			return $rootScope.language;
		};

		// set cookie with language
		this.setCookie = function(lang) {
			$.cookie('language', lang, {
				expires: 21 * 30 * 100,
				path: '/'
			});
		};

		// use language
		this.use = function(language) {
			self.setCookie(language);

			$http.defaults.headers.common['Accept-Language'] = language;
			$translate.use(language);
			tmhDynamicLocale.set(language);
			$rootScope.language = language;
			$rootScope.$broadcast("initLanguageSuccess", language);
			return language;
		};

		// load used language from this
		this.load = function() {
			return $.cookie('language');
		};
	}
]);
