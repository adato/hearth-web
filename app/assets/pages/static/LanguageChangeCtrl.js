'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LanguageChangeCtrl
 * @description controller providing functions for language changes
 */

angular.module('hearth.controllers').controller('LanguageChangeCtrl', ['LanguageSwitch', '$rootScope', '$window', function(LanguageSwitch, $rootScope, $window) {

	const ctrl = this

	ctrl.currentLanguage = $window.preferredLanguage

	ctrl.switchLang = lang => {
		LanguageSwitch.switchTo(lang, true)
	}

	ctrl.languageStrings = LanguageSwitch.languageStrings

	ctrl.toggleLanguageSelectionDialog = () => {
		$rootScope.top()
		LanguageSwitch.toggleLanguageSelectionDialog()
	}

}]);