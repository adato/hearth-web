'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.marketplaceBanner
 * @description Creates banner on marketplace screen (on top), unless is discarded by user
 * @restrict A
 */
angular.module('hearth.directives').directive('marketplaceBanner', ['$rootScope',
	function($rootScope) {
		return {
			restrict: 'E',
			controller: ['$http', '$rootScope', function ($http, $rootScope) {
				var vm = this;
				vm.content = {};

				function init() {
					var lang = $rootScope.language;
					try {
						$http.get('https://cms.hearth.net/api/banner/list', { withCredentials: false, cache:true }).then(function (obj) {
							if (obj && obj.data && obj.data.response && obj.data.response.length)
								vm.content = obj.data.response[0][lang];
						}, function (err) { throw new Exception(err) })
					} catch (e) {
						//console.log(e);
					}
				}

				init();
			}],
			controllerAs: 'vm',
			scope: true,
			templateUrl: 'assets/components/marketplaceBanner/marketplaceBanner.html',
			link: function(scope, element, attrs) {
				
			}
		};
	}
]);