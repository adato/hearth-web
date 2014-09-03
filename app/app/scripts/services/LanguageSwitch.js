'use strict';

/**
 * @ngdoc service
 * @name hearth.services.LanguageSwitch
 * @description
 */
 
angular.module('hearth.services').service('LanguageSwitch', [
	'$feature', '$translate', '$http', 'ipCookie', '$rootScope',
	function($feature, $translate, $http, ipCookie, $rootScope) {
		var languages = [{
				code: 'en',
				name: 'English'
			}, {
				code: 'cs',
				name: 'Česky'
			}],
			init = function() {
				if ($feature.isEnabled('german')) {
					return languages.push({
						code: 'de',
						name: 'Deutsch'
					});
				}
				$rootScope.$broadcast("languageInited");
				$rootScope.languageInited = true;
			};
			
		this.getLanguages = function() {
			return languages;
		};
		this.uses = function() {
			return $.map(languages, function(item) {
				if (item.code === $translate.uses()) {
					return item;
				}
			})[0];
		};
		this.use = function(language) {
			ipCookie('language', language.code, {
				expires: 21
			});
			$http.defaults.headers.common['Accept-Language'] = language.code;
			return $translate.uses(language.code);
		};
		init();
	}
]);