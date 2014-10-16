'use strict';

angular.module('hearth', ['ngDialog', 'tmh.dynamicLocale', 'ngRoute', 'angular-flexslider', 'route-segment', 'view-segment', 'ngSanitize', 'ngResource', 'pascalprecht.translate', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'hearth.services', 'hearth.filters', 'hearth.directives', 'hearth.controllers', 'angulartics', 'angulartics.ga', 'chieffancypants.loadingBar', 'ngTagsInput', 'hearth.utils', 'hearth.geo', 'hearth.messages'])
    .config(['$sceProvider', '$locationProvider',
        function($sceProvider, $locationProvider) {
            $locationProvider.html5Mode(false).hashPrefix('!');
        }
    ]).config([
        'cfpLoadingBarProvider',
        function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
            return cfpLoadingBarProvider.includeSpinner;
        }
    ]).config([
        'tmhDynamicLocaleProvider',
        function(tmhDynamicLocaleProvider) {
            tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
        }
    ]).config([
        '$translateProvider',
        function($translateProvider) {

            preferredLanguage = preferredLanguage || $$config.defaultLanguage;
            // $translateProvider.translations(preferredLanguage, translations[preferredLanguage]);
            console.log("Setting preffered language", preferredLanguage);

            // $.getScript('vendor/angular-i18n/angular-locale_cs.js', function() {
            //     console.log('Localise file loaded');
            // });

            $translateProvider.preferredLanguage(preferredLanguage);
            $translateProvider.useStaticFilesLoader({
                prefix: 'locales/',
                suffix: '/messages.json'
            });
            return $translateProvider.useStorage('SessionLanguageStorage');
        }
    ]).config([
        '$httpProvider', '$translateProvider',
        function($httpProvider, $translateProvider) {
            $httpProvider.defaults.headers.common['Accept-Language'] = $translateProvider.preferredLanguage();
            return $httpProvider.responseInterceptors.push('TermsAgreement');
        }
    ]).factory('HearthLoginInterceptor', [
        '$q', '$location', '$timeout', '$rootScope',
        function($q, $location, $timeout, $rootScope) {
            // middleware for handling ajax responses
            return function(promise) {
                return promise.then(function(response) {
                    // when ok, it will pass
                    return response;
                }, function(response) {
                    // when request failed and interceptor is turned on
                    if (response.config.nointercept) {
                        return $q.reject(response);
                    } else {
                        // it will check 401 status (unauthorized)
                        if (response.status === 401) {
                            $rootScope.referrerUrl = $location.path();
                            // and reload to /login page
                            $location.path('/login');
                        }
                        return $q.reject(response);
                    }
                });
            };
        }
    ]).config([
        '$httpProvider',
        function($httpProvider) {
            return $httpProvider.responseInterceptors.push('HearthLoginInterceptor');
        }
    ]).run([
        '$rootScope', 'Auth', '$location', 'ipCookie', '$templateCache', '$http', '$translate', 'tmhDynamicLocale', '$locale',
        function($rootScope, Auth, $location, ipCookie, $templateCache, $http, $translate, tmhDynamicLocale, $locale) {

            $translate.uses(preferredLanguage);
            tmhDynamicLocale.set(preferredLanguage);
            
            // console.log($locale.DATETIME_FORMATS.shortDate);
            // setTimeout(function() {
            //     tmhDynamicLocale.set('en');

            //     console.log($locale.pluralCat);
            // }, 2000);

            $http.get('templates/geo/markerTooltip.html', {
                cache: $templateCache
            });
            $rootScope.appInitialized = false;
            Auth.init(function() {
                $rootScope.appInitialized = true;
                $rootScope.loggedUser = Auth.getCredentials();
                $rootScope.loggedEntity = Auth.getBaseCredentials();
                $rootScope.loggedCommunity = Auth.getCommunityCredentials();

                $rootScope.$broadcast("initFinished");
                $rootScope.initFinished = true;
            });
            $rootScope.$on('onUserLogin', function() {
                var backUrl;
                backUrl = ipCookie('backUrl');
                if (backUrl) {
                    ipCookie('backUrl', null);
                    return $location.url(backUrl);
                }
            });
            return $rootScope.$on('$locationChangeStart', function(event, next, current) {
                var url;
                url = current.split('#')[1];
                if (next.match(/login/) && url) {
                    if (current.match(/confirmEmail/g) || current.match(/password/g) || url === '/feedback?fromDelete') {
                        return;
                    }
                    return ipCookie('backUrl', url);
                }
            });
        }
    ]).run([
        '$rootScope', '$location', '$http', "$translate", "OpenGraph",
        function($rootScope, $location, $http, $translate, OpenGraph) {

            $rootScope.$on('$translateChangeSuccess', function() {
                OpenGraph.setDefaultInfo($translate('OG_DEFAULT_TITLE'), $translate('OG_DEFAULT_DESCRIPTION'));
                OpenGraph.setDefault();
            });
        }
    ]).run([
        'LanguageSwitch',
        function(LanguageSwitch) {
            LanguageSwitch.init();
        }
    ]);

var __indexOf = [].indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) {
            return i;
        }
    }
    return -1;
};

angular.module('hearth.controllers', []);
angular.module('hearth.directives', []);
angular.module('hearth.services', ['ivpusic.cookie']);
angular.module('hearth.utils', []);

/**
 * @description all code working with Google MAPS api
 */
angular.module('hearth.geo', []);

/**
 * @description all code solves messaging feature
 */
angular.module('hearth.messages', []);