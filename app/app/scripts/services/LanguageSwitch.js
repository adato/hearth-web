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
		this.languages = $$config.languages;

		this.init = function() {
			if ($feature.isEnabled('german')) {
				return languages.push({
					code: 'de',
					name: 'Deutsch'
				});
			}

			// console.log("Language Inited");
			$rootScope.languageInited = true;
			$rootScope.$broadcast("languageInited");
		};
		
		this.getLanguages = function() {
			return self.languages;
		};
		
		// test if language exists
		this.langExists = function(lang) {
			return !!~self.languages.indexOf(lang);
		};

		// switch to given language code
		this.swicthTo = function(lang) {

			if(lang) {
				self.setCookie(lang.code);
					
				Session.update({language: lang.code}, function(res) {
					
					location.reload();
					// return self.use(lang);
				}, function() {
					Notify.addSingleTranslate('NOTIFY.CHANGE_LANGUAGE_FAILED', Notify.T_ERROR);
				});
			}
			return false;
		}
		this.uses = function() {

			return $.map(languages, function(item) {
				if (item.code === $translate.use()) {
					return item;
				}
			})[0];
		};
		
		this.setCookie = function(lang) {
			$.cookie('language', lang, {expires: 21*30*100});
		};
		
		this.use = function(language) {
			self.setCookie(language.code);

			$http.defaults.headers.common['Accept-Language'] = language.code;
			$translate.use(language.code);
			tmhDynamicLocale.set(language.code);
			
			$rootScope.language = lang;
			$rootScope.$broadcast("initLanguageSuccess", lang);
			return lang;
		};

		this.load = function() {
			return $.cookie('language');
		};
	}
]);