/**
 * @ngdoc service
 * @name hearth.services.ApiMaintenanceInterceptor
 * @description
 */

angular.module('hearth.services').factory('ApiMaintenanceInterceptor', [
 '$q', '$location', '$timeout', '$rootScope', 'ApiHealthChecker',
    function($q, $location, $timeout, $rootScope, ApiHealthChecker) {

        return {
            responseError: function(rejection) {
                // if (!rejection.config.nointercept) {}
                if (rejection.status === 503) {
                    if(!!~rejection.data.indexOf('Application Error'))
                        ApiHealthChecker.turnOn();
                }
                return $q.reject(rejection);
            }
        };
    }
]);