'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LanguageChangeCtrl
 * @description Language controller
 */

angular.module('hearth.controllers').controller('LanguageChangeCtrl', ['LanguageSwitch', '$rootScope', function(LanguageSwitch, $rootScope) {
	var ctrl = this;
	ctrl.currentLanguage = $rootScope.language;
	ctrl.switchLang = function(lang) {
		LanguageSwitch.switchTo(lang, true);
	};
	ctrl.toggleLanguageSelectionDialog = function() {
		LanguageSwitch.toggleLanguageSelectionDialog();
	};
}]);