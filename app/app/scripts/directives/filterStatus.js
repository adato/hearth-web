'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.filterStatus
 * @description Displays filter status in bar
 * @restrict E
 */
angular.module('hearth.directives').directive('filterStatus', [
	'$location', '$translate',

	function($location, $translate) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'templates/directives/filterStatus.html',
			link: function(scope) {
				scope.$on('$routeUpdate', function() {
					var searchParams = $location.search(),
						related = searchParams.related;

					scope.filterData = !$.isEmptyObject(searchParams) ? searchParams : undefined;
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
				});
			}
		};
	}
]);