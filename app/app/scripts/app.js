'use strict';

angular.module('hearth', ['ngDialog', 'ngRoute', 'angular-carousel', 'route-segment', 'view-segment', 'ngSanitize', 'ngResource', 'pascalprecht.translate', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'hearth.services', 'hearth.filters', 'hearth.directives', 'hearth.controllers', 'angulartics', 'angulartics.ga', 'chieffancypants.loadingBar', 'ngTagsInput', 'hearth.utils', 'hearth.geo', 'hearth.messages'])
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
        '$translateProvider',
        function($translateProvider) {

            preferredLanguage = preferredLanguage || $$config.defaultLanguage;
            // $translateProvider.translations(preferredLanguage, translations[preferredLanguage]);
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
            return function(promise) {
                return promise.then(function(response) {
                    return response;
                }, function(response) {
                    if (response.status === 401) {
                        $rootScope.referrerUrl = $location.path();
                        $location.path('/login');
                    }
                    return $q.reject(response);
                });
            };
        }
    ]).config([
        '$httpProvider',
        function($httpProvider) {
            return $httpProvider.responseInterceptors.push('HearthLoginInterceptor');
        }
    ]).run([
        '$rootScope', 'Auth', '$location', 'ipCookie', '$templateCache', '$http',
        function($rootScope, Auth, $location, ipCookie, $templateCache, $http) {

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