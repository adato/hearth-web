/**
 * @ngdoc service
 * @name hearth.services.ApiMaintenanceInterceptor
 * @description
 */

angular.module('hearth.services').factory('ApiMaintenanceInterceptor', [
	'$q', '$location', '$timeout', '$rootScope', 'ApiHealthChecker', '$injector',
	function($q, $location, $timeout, $rootScope, ApiHealthChecker, $injector) {

		function retryHttpRequest(config, deferred) {
			function successCallback(response) {
				deferred.resolve(response);
			}

			function errorCallback(response) {
				deferred.reject(response);
			}
			var $http = $injector.get('$http');
			$http(config).then(successCallback, errorCallback);
		}

		return {
			request: function(config) {
				// console.log(config);
				return config;
			},
			responseError: function(rejection) {

				// if (!rejection.config.nointercept) {}
				if (rejection.status === 503 || rejection.status === 0) {
					var deferred = $q.defer();

					ApiHealthChecker.sendFirstHealthCheck();
					var evListener = $rootScope.$on('ev:online', function() {
						evListener(); // turn off event

						if (rejection.config.method == 'GET')
							retryHttpRequest(rejection.config, deferred);
					});

					if (rejection.config.method == 'GET')
						return deferred.promise;
					else
						return $q.reject(rejection);

				} else {
					return $q.reject(rejection);
				}
			}
		};
	}
]);
