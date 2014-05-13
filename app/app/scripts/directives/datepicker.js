'use strict';
/**
 * @ngdoc directive
 * @name datepicker
 * @description Solves UI for selecting date
 * @restrict A
 */
angular.module('hearth.directives').directive('datepicker',
	function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				$.fn.fdatepicker.dates['cs'] = {
					days: ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'],
					daysShort: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
					daysMin: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
					months: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],
					monthsShort: ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čer', 'Čev', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'],
					today: 'Dnes'
				};

				function destroy() {
					$(element).removeData();
					$('.datepicker-dropdown').remove();
				}
				attrs.$observe('datepicker', function() {
					var now = new Date(),
						limit = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)).getTime();

					destroy();
					$(element).fdatepicker({
						onRender: function(date) {
							return date.getTime() < limit ? 'disabled' : '';
						},
						autoclose: true,
						weekStart: attrs.datepicker === 'en' ? 0 : 1,
						format: attrs.datepicker === 'en' ? 'mm/dd/yyyy' : 'dd.mm.yyyy',
						language: attrs.datepicker
					});
				});
			}
		};
	}
);