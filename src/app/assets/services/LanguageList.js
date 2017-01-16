'use strict';

/**
 * @ngdoc service
 * @name hearth.services.LanguageList
 * @description Service comprising a list of languages and a language translation function
 */

angular.module('hearth.services').factory('LanguageList', ['$translate', function($translate) {

	var languageCodesList = ['cs', 'en', 'de', 'fr', 'es', 'ru', 'pt', 'ja', 'tr', 'it', 'uk', 'el', 'ro', 'eo', 'hr', 'sk', 'pl', 'bg', 'sv', 'no', 'nl', 'fi', 'tk', 'ar', 'ko', 'bo', 'zh', 'he'];

	var factory = {
		translate: translate,
		list: languageCodesList,
		localizedList: (function(list) {
			var arr = [];
			for (var i = list.length; i--;) {
				arr[i] = {
					code: list[i],
					name: translate(list[i])
				};
			}
			return arr.sort(function(a, b) {
				return a.name.localeCompare(b.name);
			});
		})(languageCodesList)
	};

	return factory;

	/////////////////

	function translate(alpha2Code) {
		return $translate.instant('MY_LANG.' + alpha2Code);
	}

}]);