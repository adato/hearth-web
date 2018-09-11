'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.marketplaceBanner
 * @description Creates banner on marketplace screen (on top), unless is discarded by user
 * @restrict A
 */
angular.module('hearth.directives').directive('promotedEvents', [
	function() {
		return {
			restrict: 'E',
			controller: ['$http', function ($http) {
				var vm = this;
				vm.loading = false;
				vm.content = {};

				function init() {
					try {
						vm.loading = true;
						$http.get('https://cms.hearth.net/api/event/list', { withCredentials: false }).then(function (obj) {
							if (obj && obj.data && obj.data.response && obj.data.response.length) {
								var events = obj.data.response.filter(function (item) {
									if (item.isPromoted == true) return true; else return false;
								})
								if (events.length) vm.content = events;
							}
							vm.loading = false;
						}, function (err) { throw new Exception(err) });
					} catch (e) {
						//
					}
				}

				init();
			}],
			controllerAs: 'vm',
			scope: true,
			templateUrl: 'assets/components/promotedEvents/promotedEvents.html',
			link: function(scope, element, attrs) {
				
			}
		};
	}
]);