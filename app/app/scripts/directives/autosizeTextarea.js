'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.datepicker
 * @description Solves UI for selecting date
 * @restrict A
 */
angular.module('hearth.directives').directive('autosizeTextarea',
	['$timeout',
	function( $timeout ) {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
				setTimeout(function() {
					var el = ($(element).prop('tagName') == 'TEXTAREA') ? $(element) : $('textarea', element);

					el.autosize({append :''});
					setTimeout(function () {
						el.trigger('autosize.resize');
					});
				});
			}
		};
	}]
);
