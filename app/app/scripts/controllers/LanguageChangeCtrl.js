'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LanguageChangeCtrl
 * @description Language controller
 */

angular.module('hearth.controllers').controller('LanguageChangeCtrl', ['LanguageSwitch', '$rootScope', function(LanguageSwitch, $rootScope) {
	var ctrl = this;
	ctrl.currentLanguage = preferredLanguage;
	ctrl.switchLang = function(lang) {
		LanguageSwitch.switchTo(lang, true);
	};
	ctrl.languageStrings = LanguageSwitch.languageStrings;
	ctrl.toggleLanguageSelectionDialog = function() {
		$rootScope.top();
		LanguageSwitch.toggleLanguageSelectionDialog();
	};
}]);