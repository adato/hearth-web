'use strict';

/**
 * @ngdoc service
 * @name hearth.services.LanguageSwitch
 * @description
 */

angular.module('hearth.services').service('LanguageSwitch', [
	'$translate', '$http', '$rootScope', 'tmhDynamicLocale', 'Session', '$timeout',
	function($translate, $http, $rootScope, tmhDynamicLocale, Session, $timeout) {

		var self = this

		this.languages = (() => {
			var arr = []
			Object.keys($$config.languages).forEach(l => {
				if ($$config.languages[l]) arr.push(l)
			})
			return arr
		})()

		const ANIMATION_SPEED = 200 // = jQuery's fast

		// init languages
		this.init = () => {
			$rootScope.languageInited = true
			$rootScope.$broadcast("languageInited")
		}

		self.languageStrings = {
			cs: 'CZECH',
			en: 'ENGLISH',
			sk: 'SLOVAK'
		}

		// get all languages
		this.getLanguages = () => self.languages

		// test if language exists
		this.langExists = lang => !!~self.languages.indexOf(lang)

		// switch to given language code
		this.switchTo = function(lang, unauthOnly) {
			if (lang) {
				self.setCookie(lang)
				if (unauthOnly) {
					location.reload()
					return true
				}

				Session.updateLanguage({
					language: lang
				}, function(res) {
					location.reload()
				})
			}
			return false
		}

		// return current used language
		this.uses = () => $rootScope.language

		// set cookie with language
		this.setCookie = function(lang) {
			$.cookie('language', lang, {
				expires: 21 * 30 * 100,
				path: '/'
			})
		}

		// use language
		this.use = function(language) {
			self.setCookie(language)

			$http.defaults.headers.common['Accept-Language'] = language
			$translate.use(language)
			tmhDynamicLocale.set(language)
			$rootScope.language = language
			$rootScope.$broadcast("initLanguageSuccess", language)
			return language
		}

		var languageSelectionOpen = false
		var languageSelectionClickDisableActive = void 0
		self.toggleLanguageSelectionDialog = () => {

			// disable clicking on the language panel toggler for the duration
			// of the animation to prevent accidental double-clicking
			if (languageSelectionClickDisableActive === true) return false
			languageSelectionClickDisableActive = true
			setTimeout(() => languageSelectionClickDisableActive = false, ANIMATION_SPEED)

			$('#language-panel').slideToggle(ANIMATION_SPEED)

			if (!languageSelectionOpen) {
				// attach event handler to hide language panel when clicked
				// outside it's bounds but wait with it until the animation
				// is over
				$timeout(() => {
					$(document).on('click.langSearch', e => {
						var element = $(e.target)
						if (!element.parents('#language-panel').length) self.toggleLanguageSelectionDialog()
					})
				}, ANIMATION_SPEED)
			} else {
				// detach event handler
				$(document).off('click.langSearch')
			}
			languageSelectionOpen = !languageSelectionOpen

		}

		// load used language from this
		this.load = () => $.cookie('language')

	}
])