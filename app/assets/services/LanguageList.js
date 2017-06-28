'use strict';

/**
 * @ngdoc service
 * @name hearth.services.LanguageList
 * @description Service comprising a list of languages and a language translation function
 */

angular.module('hearth.services').factory('LanguageList', ['$translate', function($translate) {

  const languageCodesList = ['cs', 'en', 'de', 'fr', 'es', 'ru', 'pt', 'ja', 'tr', 'it', 'uk', 'el', 'ro', 'eo', 'hr', 'sk', 'pl', 'bg', 'sv', 'no', 'nl', 'fi', 'tk', 'ar', 'ko', 'bo', 'zh', 'he', 'sq', 'hy', 'az', 'be', 'da', 'et', 'fo', 'fa', 'ka', 'te', 'hu', 'is', 'id', 'ky', 'lv', 'lt', 'mk', 'ms', 'mn', 'nn', 'tt', 'sr', 'sl', 'sw', 'th', 'ur', 'uz', 'vi'];

  const GROUP_CHOSEN = 'CHOSEN'
  const GROUP_OTHER = 'OTHER'

  const groups = {
    cs: GROUP_CHOSEN,
    en: GROUP_CHOSEN,
    sk: GROUP_CHOSEN
  }

	const factory = {
		translate: translate,
		list: languageCodesList,
		localizedList: (function(list) {
			var arr = [];
			for (var i = list.length; i--;) {
				arr[i] = {
					code: list[i],
					name: translate(list[i]),
          group: group(list[i])
				}
			}
			return arr.sort(function(a, b) {
				return a.name.localeCompare(b.name)
			})
		})(languageCodesList)
	}

	return factory

	/////////////////

	function translate(alpha2Code) {
		return $translate.instant('MY_LANG.' + alpha2Code)
	}

  function group(alpha2Code) {
    return $translate.instant('LANGUAGE.LIST.LABEL_' + (groups[alpha2Code] || GROUP_OTHER))
  }

}])