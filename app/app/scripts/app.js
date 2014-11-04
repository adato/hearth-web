'use strict';

angular.module('hearth', ['ngDialog', 'tmh.dynamicLocale', 'ngRoute', 'angular-flexslider', 'route-segment', 'view-segment', 'ngSanitize', 'ngResource', 'pascalprecht.translate', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'hearth.services', 'hearth.filters', 'hearth.directives', 'hearth.controllers', 'angulartics', 'angulartics.ga', 'chieffancypants.loadingBar', 'ngTagsInput', 'hearth.utils', 'hearth.geo', 'hearth.messages'])
    .config(['$sceProvider', '$locationProvider',
        function($sceProvider, $locationProvider) {

            // ============================
            // === Location Configuration
            // ============================
            $locationProvider.html5Mode(false).hashPrefix('!');
        }
    ]).config([
        'cfpLoadingBarProvider',
        function(cfpLoadingBarProvider) {

            // ===============================
            // === Loading Bar Configuration
            // ===============================
            cfpLoadingBarProvider.includeSpinner = false;
            return cfpLoadingBarProvider.includeSpinner;
        }
    ]).config([
        'tmhDynamicLocaleProvider', '$translateProvider',
        function(tmhDynamicLocaleProvider, $translateProvider) {
            
            // ===============================
            // === Localization
            // ===============================
            
            // get preferred language from cookies or config
            console.log("Setting preffered language", preferredLanguage);
            
            // configure dynamic locale - dates && pluralization && etc
            tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
            
            // configure translate provider - where language constants are
            $translateProvider.preferredLanguage(preferredLanguage);
            
            //  ====================== REVIEW ================
            // $translateProvider.useStorage('SessionLanguageStorage');
            $translateProvider.useStaticFilesLoader({
                prefix: 'locales/',
                suffix: '/messages.json'
            });
        }
    ]).config([
        '$httpProvider', '$translateProvider',
        function($httpProvider, $translateProvider) {

            // ===============================
            // === Configure ajax calls
            // ===============================
            
            // Add language header
            $httpProvider.defaults.headers.common['Accept-Language'] = $translateProvider.preferredLanguage();

            // ======== Watch for unauth responses
            $httpProvider.responseInterceptors.push('HearthLoginInterceptor');
            $httpProvider.responseInterceptors.push('ApiMaintenanceInterceptor');

            // ======== ?? wtf is this?
            $httpProvider.responseInterceptors.push('TermsAgreement');
        }
    ]).run([
        '$rootScope', 'Auth', '$location', 'ipCookie', '$templateCache', '$http', '$translate', 'tmhDynamicLocale', '$locale', 'LanguageSwitch', 'OpenGraph',
        function($rootScope, Auth, $location, ipCookie, $templateCache, $http, $translate, tmhDynamicLocale, $locale, LanguageSwitch, OpenGraph) {
            $rootScope.appInitialized = false;
            $rootScope.appInitialized = false;

            /**
             * This will cache some files at start
             */
            function cacheFiles(done) {

                // cache tooltip in MAP -- DEPRECATED -- remove when map will be refactored
                $http.get('templates/geo/markerTooltip.html', {
                    cache: $templateCache
                });
                done(null);
            }

            /**
             * This will init app language
             */
            function initLanguage(done) {
                
                // $translate.uses(preferredLanguage); // already loaded from config
                tmhDynamicLocale.set(preferredLanguage);

                var offEvent = $rootScope.$on('$translateLoadingSuccess', function($event, data){
                    offEvent(); // unregister event listener
                    LanguageSwitch.init();
                    $rootScope.language = preferredLanguage;
                    $rootScope.$broadcast("initLanguageSuccess", preferredLanguage);
                    done(null, data);
                });
            }
            
            /**
             * This will init session of user
             */
            function initSession(done) {
                // get session info from API
                Auth.init(function() {

                    // enrich rootScope with user/community credentials
                    angular.extend($rootScope, Auth.getSessionInfo());

                    $rootScope.$broadcast("initSessionSuccess", $rootScope.loggedUser);
                    done(null, $rootScope.loggedUser);
                });
            }

            /**
             * When localization loaded, fill opengraph info
             */
            function initOpenGraph(done) {

                $rootScope.$on('$translateChangeSuccess', function() {
                    OpenGraph.setDefaultInfo($translate('OG_DEFAULT_TITLE'), $translate('OG_DEFAULT_DESCRIPTION'));
                    OpenGraph.setDefault();
                });

                done(null);
            }
            
            // === Init hearth core parts
            async.parallel({
                language: initLanguage, // download language files
                session: initSession,   // get user session from api
                openGraph: initOpenGraph, // fill default og info
                cacheFiles: cacheFiles,   // cache some files at start
            }, function(err, init) {

                $rootScope.initFinished = true;
                $rootScope.$broadcast("initFinished");
            });
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