'use strict';

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
				attrs.$observe('datepicker', function() {
					$(element).removeData();
					$('.datepicker-dropdown').remove()
					$(element).fdatepicker({
						autoclose: true,
						weekStart: attrs.datepicker === 'en' ? 0 : 1,
						format: attrs.datepicker === 'en' ? undefined : 'dd.mm.yyyy',
						language: attrs.datepicker
					});
				});
			}
		};
	}
);