'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LanguageChangeCtrl
 * @description Language controller
 */

angular.module('hearth.controllers').controller('LanguageChangeCtrl', ['LanguageSwitch', function(LanguageSwitch) {
	var ctrl = this;
	ctrl.currentLanguage = preferredLanguage;
	ctrl.switchLang = function(lang) {
		LanguageSwitch.switchTo(lang, true);
	};
	ctrl.languageStrings = LanguageSwitch.languageStrings;
	ctrl.toggleLanguageSelectionDialog = function() {
		LanguageSwitch.toggleLanguageSelectionDialog();
	};
}]);