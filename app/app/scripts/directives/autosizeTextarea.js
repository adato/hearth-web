'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.autosizeTextarea
 * @description Makes textarea autoresizing based on content
 * @restrict A
 */
angular.module('hearth.directives').directive('autosizeTextarea',
	['$timeout',
	function( $timeout ) {
		return {
			restrict: 'A',
			scope: {
				resized: "&"
			},
			link: function(scope, element, attrs) {
				setTimeout(function() {
					var el = ($(element).prop('tagName') == 'TEXTAREA') ? $(element) : $('textarea', element);
					var p = el.attr('placeholder');
					el.attr('placeholder', '').autosize({append :'', callback: scope.resized}).show().trigger('autosize.resize').attr('placeholder', p);
				});
			}
		};
	}]
);
