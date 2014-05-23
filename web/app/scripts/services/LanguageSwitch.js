'use strict';

angular.module('hearth.services').service('LanguageSwitch', [
	'$feature', '$translate', '$http', 'ipCookie',
	function($feature, $translate, $http, ipCookie) {
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
			};

		this.getLanguages = function() {
			return languages;
		};
		this.uses = function() {
			return $translate.uses() || languages[1];
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