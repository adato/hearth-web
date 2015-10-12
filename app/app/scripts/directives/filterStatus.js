'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.filterStatus
 * @description Displays filter status in bar
 * @restrict E
 */
angular.module('hearth.directives').directive('filterStatus', [
	'$state', '$location', '$translate',

	function($state, $location, $translate) {
		return {
			restrict: 'E',
			replace: true,
      templateUrl: 'templates/_responsive/directives/filterStatus.html',
			scope: {},
			link: function(scope) {
				scope.resetFilter = function() {
					scope.$emit('filterReset');
				};
				scope.fetchData = function() {
					var searchParams = angular.copy($location.search()),
						related = searchParams.related;


					scope.filterData = !$.isEmptyObject(searchParams) ? searchParams : undefined;

					if(scope.filterData && $.isArray(scope.filterData.keywords)) {
						scope.filterData.keywords = scope.filterData.keywords.join(", ");
					}

					if (!$.isEmptyObject(searchParams)) {
						related = related ? related.split(',') : [];

						if (searchParams.my_section === 'true') {
							related.push('just-mine-connection');
						}
						if (related) {
							scope.filterData.related = $.map(related, function(text) {
								return $translate(text);
							});
							scope.filterData.related = scope.filterData.related.join(', ');
						}
					}
				};
				scope.$on('$routeUpdate', scope.fetchData);
				scope.fetchData();
			}
		};
	}
]);
