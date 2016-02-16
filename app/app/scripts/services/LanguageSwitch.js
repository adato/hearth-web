'use strict';

/**
 * @ngdoc service
 * @name hearth.services.LanguageSwitch
 * @description
 */

angular.module('hearth.services').service('LanguageSwitch', [
	'$translate', '$http', '$rootScope', 'tmhDynamicLocale', 'Session', '$timeout',
	function($translate, $http, $rootScope, tmhDynamicLocale, Session, $timeout) {
		var self = this;
		this.languages = Object.keys($$config.languages);
		var ANIMATION_SPEED = 600 // = jQuery's slow

		// init languages
		this.init = function() {
			// console.log("Language Inited");
			$rootScope.languageInited = true;
			$rootScope.$broadcast("languageInited");
		};

		self.languageStrings = {
			cs: 'CZECH',
			en: 'ENGLISH',
			sk: 'SLOVAK'
		};

		// get all languages
		this.getLanguages = function() {
			return self.languages;
		};

		// test if language exists
		this.langExists = function(lang) {
			return !!~self.languages.indexOf(lang);
		};

		// switch to given language code
		this.swicthTo = function(lang, unauthOnly) {
			if (lang) {
				self.setCookie(lang);
				if (unauthOnly) {
					location.reload();
					return true;
				};

				Session.update({
					language: lang
				}, function(res) {
					location.reload();
				});
			}
			return false;
		};

		// return current used language
		this.uses = function() {
			return $rootScope.language;
		};

		// set cookie with language
		this.setCookie = function(lang) {
			$.cookie('language', lang, {
				expires: 21 * 30 * 100,
				path: '/'
			});
		};

		// use language
		this.use = function(language) {
			self.setCookie(language);

			$http.defaults.headers.common['Accept-Language'] = language;
			$translate.use(language);
			tmhDynamicLocale.set(language);
			$rootScope.language = language;
			$rootScope.$broadcast("initLanguageSuccess", language);
			return language;
		};

		var languageSelectionOpen = false;
		var languageSelectionClickDisableActive = void 0;
		self.toggleLanguageSelectionDialog = function() {

			// disable clicking on the language panel toggler for the duration 
			// of the animation to prevent accidental double-clicking
			if (languageSelectionClickDisableActive === true) return false;
			languageSelectionClickDisableActive = true;
			setTimeout(function() {
				languageSelectionClickDisableActive = false;
			}, ANIMATION_SPEED);

			$('#language-panel').slideToggle(ANIMATION_SPEED);

			if (!languageSelectionOpen) {
				// attach event handler to hide language panel when clicked 
				// outside it's bounds but wait with it until the animation
				// is over
				$timeout(function() {
					$(document).on('click.langSearch', function(e) {
						var element = $(e.target);
						if (!element.parents('#language-panel').length) {
							self.toggleLanguageSelectionDialog();
						};
					});
				}, ANIMATION_SPEED);
			} else {
				// detach event handler
				$(document).off('click.langSearch');
			};
			languageSelectionOpen = !languageSelectionOpen;

		};

		// load used language from this
		this.load = function() {
			return $.cookie('language');
		};
	}
]);