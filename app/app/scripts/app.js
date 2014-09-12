'use strict';

angular.module('hearth', ['ngDialog', 'ngRoute', 'route-segment', 'view-segment', 'ngSanitize', 'ngResource', 'pascalprecht.translate', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'hearth.services', 'hearth.filters', 'hearth.directives', 'hearth.controllers', 'angulartics', 'angulartics.ga', 'chieffancypants.loadingBar', 'ngTagsInput', 'hearth.utils', 'hearth.geo', 'hearth.messages'])
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
    ]).config([
        '$routeSegmentProvider', '$routeProvider',
        function($routeSegmentProvider, $routeProvider) {


            $routeSegmentProvider
                .when('/search/?', 'search')
                .when('/', 'market')
                .when('/ad/:id', 'ad')
                .when('/404', 'err404')
                .when('/setup', 'setup')
                .when('/terms', 'terms')
                .when('/about', 'about')
                .when('/feedback', 'feedback')

                .when('/register', 'reg')
                .when('/login', 'login')
                .when('/reset-password', 'reset-pass')
                .when('/forgotten-password', 'forgot-pass')
                .when('/confirmEmail', 'confirm-email')
                .when('/change-password', 'change-pass')


                .when('/profile/:id', 'profile')
                .when('/profile/:id/posts', 'profile.posts')
                .when('/profile/:id/communities', 'profile.communities')
                .when('/profile/:id/given-ratings', 'profile.given')
                .when('/profile/:id/received-ratings', 'profile.received')
                .when('/profile/:id/following', 'profile.following')
                .when('/profile/:id/followers', 'profile.followers')
                .when('/profile/:id/invite', 'profile.invite')

                .when('/profile-edit', 'profileEdit')
                .when('/profile-settings', 'profileSettings')

            .when('/communities/:action?', 'communities')
            // .when('/community/:id/:action?', 'community')
            // .when('/community-create', 'community-create')
            // .when('/profile/:id/:action', 'profile-action')
            // .when('/', '')
            .segment('market', {
                templateUrl: 'templates/market.html',
                controller: 'MarketCtrl',
                reloadOnSearch: false,
                pageType: 'search'
            }).segment('search', {
                templateUrl: 'templates/fulltext.html',
                controller: 'FulltextCtrl'
            }).segment('reg', {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            }).segment('login', {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl',
                pageType: 'login'
            }).segment('confirm-email', {
                templateUrl: 'templates/confirmEmail.html',
                controller: 'ConfirmEmailCtrl'
            }).segment('change-pass', {
                templateUrl: 'templates/changePassword.html',
                controller: 'ChangePwdCtrl',
                access: 'private'
            }).segment('forgot-pass', {
                templateUrl: 'templates/forgottenPassword.html',
                controller: 'ForgottenPasswordCtrl'
            }).segment('reset-pass', {
                templateUrl: 'templates/resetPassword.html',
                controller: 'ResetPwdCtrl'
            }).segment('feedback', {
                templateUrl: 'templates/feedback.html',
                controller: 'FeedbackCtrl',
                pageType: 'feedback'
            }).segment('404', {
                templateUrl: 'templates/404.html'
            }).segment('setup', {
                templateUrl: 'templates/setup.html',
                controller: 'SetupCtrl'
            }).segment('terms', {
                controller: 'TermsCtrl',
                templateUrl: 'templates/terms.html'
            }).segment('about', {
                templateUrl: 'templates/about.html',
                pageType: 'about'
            }).segment('ad', {
                controller: 'ItemDetail',
                templateUrl: 'templates/itemDetail.html'
            }).segment('communities', {
                templateUrl: 'templates/communityList.html',
                controller: 'CommunityListCtrl',
                pageType: 'communities'

            }).segment('profileEdit', {
                templateUrl: 'templates/profile/editProfile.html',
                controller: 'ProfileEditCtrl',
                reloadOnSearch: false,
                pageType: 'profile'

            }).segment('profileSettings', {
                templateUrl: 'templates/profile/editSettings.html',
                controller: 'ProfileSettingsCtrl',
                reloadOnSearch: false,
                pageType: 'profile'

            }).segment('profile', {
                templateUrl: 'templates/profile/topPanel.html',
                controller: 'ProfileCtrl',
                reloadOnSearch: false,
                pageType: 'profile'
            })

            .within()

                .segment('home', {
                    default: true,
                    controller: 'ProfileDataFeedCtrl',
                    templateUrl: 'templates/profile/home.html'
                })
                .segment('posts', {
                    templateUrl: 'templates/profile/posts.html',
                    controller: 'ProfileDataFeedCtrl',
                    reloadOnSearch: false,
                    dependencies: ['id']
                })
                .segment('given', {
                    templateUrl: 'templates/profile/ratingsGiven.html',
                    controller: 'ProfileDataFeedCtrl',
                    reloadOnSearch: false,
                    dependencies: ['id']
                })
                .segment('received', {
                    templateUrl: 'templates/profile/ratingsReceived.html',
                    controller: 'ProfileDataFeedCtrl',
                    reloadOnSearch: false,
                    dependencies: ['id']
                })
                .segment('communities', {
                    templateUrl: 'templates/profile/communities.html',
                    controller: 'ProfileDataFeedCtrl',
                    reloadOnSearch: false,
                    dependencies: ['id']
                })
                .segment('followers', {
                    templateUrl: 'templates/profile/followers.html',
                    controller: 'ProfileDataFeedCtrl',
                    reloadOnSearch: false,
                    dependencies: ['id']
                })
                .segment('following', {
                    templateUrl: 'templates/profile/following.html',
                    controller: 'ProfileDataFeedCtrl',
                    dependencies: ['id']
                })

                .segment('invite', {
                    templateUrl: 'templates/profile/invite.html',
                    controller: 'ProfileInviteCtrl',
                    dependencies: ['id']
                })
            // .within()
            //     .segment('recommended', {
            //         templateUrl: 'templates/section1/item.html',
            //         controller: 'Section1ItemCtrl',
            //         dependencies: ['id']
            //     })
            //     segment('recommendations', {
            //         templateUrl: 'templates/section1/item.html',
            //         controller: 'Section1ItemCtrl',
            //         dependencies: ['id']
            //     })

            $routeProvider.otherwise({
                redirectTo: '/'
            });


            // }).when('/community/:id/:action?', {
            //     templateUrl: 'templates/communityProfile.html',
            //     controller: 'CommunityProfileCtrl',
            //     pageType: 'community-profile',
            //     reloadOnSearch: false
            // }).when('/community-create', {
            //     templateUrl: 'templates/communityRegister.html',
            //     controller: 'CommunityRegisterCtrl',
            //     pageType: 'community-create'
            // }).when('/my', {
            //     templateUrl: 'templates/my.html',
            //     controller: 'SearchCtrl',
            //     reloadOnSearch: false,
            //     pageType: 'my'
            // }).when('/profile/:id/:action', {
            //     templateUrl: 'templates/profile.html',
            //     controller: 'ProfileCtrl',
            //     reloadOnSearch: false,
            //     pageType: 'profile'
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