'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LanguageChangeCtrl
 * @description Language controller
 */

angular.module('hearth.controllers').controller('LanguageChangeCtrl', ['LanguageSwitch', function(LanguageSwitch) {
	var ctrl = this;
	//ctrl.languages = LanguageSwitch.getLanguages();
	ctrl.switchLang = function(lang) {
		LanguageSwitch.swicthTo(lang, true);
	};
}]);