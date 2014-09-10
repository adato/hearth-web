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
					var p = el.attr('placeholder');
					el.attr('placeholder', '').autosize({append :''}).show().trigger('autosize.resize').attr('placeholder', p);
				});
			}
		};
	}]
);
