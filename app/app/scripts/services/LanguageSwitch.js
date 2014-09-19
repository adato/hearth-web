'use strict';

/**
 * @ngdoc service
 * @name hearth.services.LanguageSwitch
 * @description
 */
 
angular.module('hearth.services').service('LanguageSwitch', [
	'$feature', '$translate', '$http', 'ipCookie', '$rootScope',
	function($feature, $translate, $http, ipCookie, $rootScope) {
		var self = this,
			languages = [{
				code: 'en',
				name: 'English'
			}, {
				code: 'cs',
				name: 'Česky'
			}];

		this.init = function() {
			if ($feature.isEnabled('german')) {
				return languages.push({
					code: 'de',
					name: 'Deutsch'
				});
			}

			console.log("Language Inited");
			$rootScope.languageInited = true;
			$rootScope.$broadcast("languageInited");
		};
		
		this.getLanguages = function() {
			return languages;
		};
		this.getLanguage = function(code) {

			for(var i = 0; i< languages.length; i++) {
				if(languages[i].code == code) {
					return languages[i];
				}
			}
			return false;
		};
		this.swicthTo = function(lang) {
			var lang = self.getLanguage(lang);

			if(lang) {
				return self.use(lang);
			}
			return false;
		}
		this.uses = function() {
			return $.map(languages, function(item) {
				if (item.code === $translate.uses()) {
					return item;
				}
			})[0];
		};
		this.use = function(language) {
			ipCookie('language', language.code, {
				expires: 21*30
			});
			$http.defaults.headers.common['Accept-Language'] = language.code;
			return $translate.uses(language.code);
		};
		this.load = function() {
			return $.cookie('language');
		};
	}
]);