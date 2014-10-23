/**
 * @ngdoc service
 * @name hearth.services.ApiMaintenanceInterceptor
 * @description
 */

angular.module('hearth.services').factory('ApiMaintenanceInterceptor', [
 '$q', '$location', '$timeout', '$rootScope', 'ApiHealthChecker',
    function($q, $location, $timeout, $rootScope, ApiHealthChecker) {

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
                    // it will check 503 && heroku maitenance is turned on
                    if (response.status === 503) {

                        if(!!~response.data.indexOf('Application Error'))
                            ApiHealthChecker.turnOn();

                        // if(response.headers) {
                        //     console.log(response);
                        //     console.log(response.headers());
                        // }
                        // $rootScope.referrerUrl = $location.path();
                        // and reload to /login page
                        // $location.path('/login');
                    }
                    return $q.reject(response);
                }
            });
        };
    }
]);