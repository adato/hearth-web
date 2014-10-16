'use strict';

/**
 * @ngdoc service
 * @name hearth.services.HearthLoginInterceptor
 * @description
 */

angular.module('hearth.services').factory('HearthLoginInterceptor', [
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
]);