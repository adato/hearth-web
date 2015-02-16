'use strict';

/**
 * @ngdoc service
 * @name hearth.services.HearthLoginInterceptor
 * @description
 */

angular.module('hearth.services').factory('HearthLoginInterceptor', [
    '$q', '$location', '$timeout', '$rootScope',
    function($q, $location, $timeout, $rootScope) {

        return {
            request: function(config) {
                return config;
            },
            response: function(response) {
                return response;
            },
            responseError: function(rejection) {
                if (!rejection.config.nointercept) {
                    
                    if (rejection.status === 401) {
                        $rootScope.referrerUrl = $location.path();
                        $location.path('/login');
                    }
                }
                return $q.reject(rejection);
            }
        };

        // middleware for handling ajax responses
        // return function(promise) {
        //     return promise.then(function(response) {
        //         // when ok, it will pass
        //         return response;
        //     }, function(response) {
        //         // when request failed and interceptor is turned on
        //         } else {
        //             // it will check 401 status (unauthorized)
        //             return $q.reject(response);
        //         }
        //     });
        // };
    }
]);