'use strict';

var scrollToHash;

angular.module('hearth.index', ['ngResource', 'pascalprecht.translate', 'hearth.services', 'hearth.filters'])
	.config(['$translateProvider',
		function($translateProvider) {
			preferredLanguage = preferredLanguage || 'cs';
			$translateProvider.translations(preferredLanguage, translations[preferredLanguage]);
			$translateProvider.preferredLanguage(preferredLanguage);
			$translateProvider.useStaticFilesLoader({
				prefix: '../locales/',
				suffix: '/messages.json'
			});
			return $translateProvider.useStorage('SessionLanguageStorage');
		}
	])
	.config(['$httpProvider', '$translateProvider',
		function($httpProvider, $translateProvider) {
			return $httpProvider.defaults.headers.common['Accept-Language'] = $translateProvider.preferredLanguage();
		}
	])
	.controller('IndexCtrl', [
		'$scope', '$timeout', 'LanguageSwitch', 'ResponseErrors',
		function($scope, $timeout, LanguageSwitch, ResponseErrors) {
			$scope.errors = new ResponseErrors();
			$scope.credentials = {
				username: '',
				password: ''
			};
			$scope.languages = LanguageSwitch.getLanguages();
			$scope.languageCode = LanguageSwitch.uses();

			return $scope.useLanguage = function(language) {
				return LanguageSwitch.use(language).then(function() {
					return $scope.languageCode = language;
				});
			};
		}
	])
	.directive('smoothScroll', function() {
		return {
			link: function(scope, element, attrs) {
				return $(element[0]).click(function(event) {
					event.preventDefault();
					return scrollToHash($(this).attr('href'));
				});
			}
		};
	})
	.directive('withErrors', function() {
		return {
			restrict: 'A',
			require: 'form',
			link: function(scope, element, attrs, form) {
				var clearPristine, fixAutoComplete;
				fixAutoComplete = function(form, element) {
					var idx, model, _i, _ref, _ref1, _results;
					_results = [];
					for (idx = _i = 0, _ref = element[0].length; 0 <= _ref ? _i <= _ref : _i >= _ref; idx = 0 <= _ref ? ++_i : --_i) {
						model = form[(_ref1 = element[0][idx]) != null ? _ref1.name : void 0];
						if (!model) {
							continue;
						}
						_results.push(model.$setViewValue(element[0][idx].value));
					}
					return _results;
				};
				clearPristine = function(form, element) {
					var idx, model, _i, _ref, _ref1, _results;
					form.$pristine = false;
					element.removeClass('ng-pristine');
					_results = [];
					for (idx = _i = 0, _ref = element[0].length; 0 <= _ref ? _i <= _ref : _i >= _ref; idx = 0 <= _ref ? ++_i : --_i) {
						model = form[(_ref1 = element[0][idx]) != null ? _ref1.name : void 0];
						if (!model) {
							continue;
						}
						model.$pristine = true;
						_results.push(angular.element(element[0][idx]).removeClass('ng-pristine'));
					}
					return _results;
				};
				return element.bind('submit', function(event) {
					fixAutoComplete(form, element);
					clearPristine(form, element);
					if (!form.$valid) {
						return event.preventDefault();
					}
				});
			}
		};
	})
	.run([
		'Auth', '$window', '$rootScope', '$timeout',
		function(Auth, $window, $rootScope, $timeout) {
			$timeout(function() {
				return scrollToHash(window.location.hash);
			}, 500);
			return Auth.init(function() {
				if (Auth.isLoggedIn()) {
					$window.location.href = 'app/#/search';
				}
				if (!Auth.isLoggedIn()) {
					return $rootScope.appLoaded = true;
				}
			});
		}
	]);

scrollToHash = function(hash) {
	var anchor, dest;
	anchor = $(hash);
	if (!anchor.size()) {
		return;
	}
	dest = 0;
	if (anchor.offset().top > ($(document).height() - $(window).height())) {
		dest = $(document).height() - $(window).height();
	} else {
		dest = anchor.offset().top;
	}
	return $('html, body').animate({
		scrollTop: dest
	}, 400, function() {
		return window.location.hash = hash;
	});
};