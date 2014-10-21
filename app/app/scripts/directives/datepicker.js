'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.datepicker
 * @description Solves UI for selecting date
 * @restrict A
 */
angular.module('hearth.directives').directive('datepicker', [
	'$rootScope', '$filter',
	function($rootScope, $filter) {
		return {
			restrict: 'A',
			scope: {
				datepicker: '@'
			},
			link: function(scope, element, attrs) {
				attrs.$observe('datepicker', function() {
					var now = new Date(),
						limit = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)).getTime();
					
					// datepicker has different format for dates - use m as Month number
					// for more info: http://api.jqueryui.com/datepicker/
					var dateFormat = $rootScope.DATETIME_FORMATS.shortDate.replace(/M/g, 'm');

					$(element).fdatepicker({
						onRender: function(date) {
							return date.getTime() < limit ? 'disabled' : '';
						},
						isInline: true,
						autoclose: true,
						weekStart: attrs.datepicker === 'en' ? 0 : 1,
						format: dateFormat,
						language: attrs.datepicker === 'cs' ? 'cz' : attrs.datepicker
					}).on('show', function() {
						$('.datepicker-dropdown:visible').css({
							top: parseInt($('.datepicker-dropdown:visible').css('top'), 10) - parseInt($('.main-container').css('margin-top'), 10)
						});
					});
				});
			}
		};
	}
]);
