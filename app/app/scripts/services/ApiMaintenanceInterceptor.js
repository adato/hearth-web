/**
 * @ngdoc service
 * @name hearth.services.ApiMaintenanceInterceptor
 * @description
 */

angular.module('hearth.services').factory('ApiMaintenanceInterceptor', [
 '$q', '$location', '$timeout', '$rootScope', 'ApiHealthChecker',
    function($q, $location, $timeout, $rootScope, ApiHealthChecker) {

        return {
            request: function(config) {
                // console.log(config);

                return config;
            },
            responseError: function(rejection) {
                // if (!rejection.config.nointercept) {}
                if (rejection.status === 503 || rejection.status === 0) {
                    ApiHealthChecker.sendFirstHealthCheck();
                }
                return $q.reject(rejection);
            }
        };
    }
]);