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

			if(self.langExists(lang)) {
				// save to cookie
				$.cookie('language', lang, {expires: 21*30*100});
				
				// update language on API
				Session.update({language: lang}, function(res) {
					
					location.reload();
					// return self.use(lang);
				}, function() {
					Notify.addSingleTranslate('NOTIFY.CHANGE_LANGUAGE_FAILED', Notify.T_ERROR);
				});
			}
			return false;
		}
		this.uses = function() {
			return $.map(self.languages, function(item) {
				if (item === $translate.use()) {
					return item;
				}
			})[0];
		};
		this.use = function(lang) {
			$.cookie('language', lang, {
				expires: 21*30
			});
			$http.defaults.headers.common['Accept-Language'] = lang;
			$translate.use(lang);
			tmhDynamicLocale.set(lang);
			
			$rootScope.language = lang;
			$rootScope.$broadcast("initLanguageSuccess", lang);
			return lang;
		};

		this.load = function() {
			return $.cookie('language');
		};
	}
]);