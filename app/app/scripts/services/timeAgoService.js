'use strict';

/**
 * @ngdoc service
 * @name hearth.services.timeAgoService
 * @description
 */
 
angular.module('hearth.services').service('timeAgoService', [
	'$interval', '$translate',
	function($interval, $translate) {
		var ref;
		ref = null;
		return {
			getStrings: function() {
				return {
					seconds: $translate.instant('LESS_THAN_MINUTE_AGO'),
					minute: $translate.instant('MINUTE_AGO'),
					minutes: $translate.instant('%d MINUTES_AGO'),
					hour: $translate.instant('HOUR_AGO'),
					hours: $translate.instant('%d HOURS_AGO'),
					day: $translate.instant('DAY_AGO'),
					days: $translate.instant('%d DAYS_AGO'),
					month: $translate.instant('MONTH_AGO'),
					months: $translate.instant('%d MONTHS_AGO'),
					year: $translate.instant('YEAR_AGO'),
					years: $translate.instant('%d YEARS_AGO'),
					numbers: []
				};
			},
			nowTime: 0,
			initted: false,
			settings: {
				refreshMillis: 60000,
				strings: {}
			},
			doTimeout: function() {
				var now = new Date();

				ref.nowTime = now.getTime();
				return ref.nowTime;
			},
			init: function() {
				var that;
				if (!this.initted) {
					this.initted = true;
					this.nowTime = (new Date()).getTime();
					ref = this;
					that = this;
					that.settings.strings = that.getStrings();
					$interval(ref.doTimeout, ref.settings.refreshMillis);
					this.initted = true;
					return this.initted;
				}
			},
			inWords: function(distanceMillis) {
				var $l, days, hours, lang, minutes, seconds, separator, substitute, words, years;
				lang = window.lang;
				$l = this.getStrings();
				seconds = Math.abs(distanceMillis) / 1000;
				minutes = seconds / 60;
				hours = minutes / 60;
				days = hours / 24;
				years = days / 365;
				substitute = function(stringOrFunction, number) {
					var str, value;
					if ($.isFunction(stringOrFunction)) {
						str = stringOrFunction(number, distanceMillis);
					}
					if (!$.isFunction(stringOrFunction)) {
						str = stringOrFunction;
					}
					value = ($l.numbers && $l.numbers[number]) || number;
					return str.replace(/%d/i, value);
				};
				words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) || seconds < 90 && substitute($l.minute, 1) || minutes < 45 && substitute($l.minutes, Math.round(minutes)) || minutes < 90 && substitute($l.hour, 1) || hours < 24 && substitute($l.hours, Math.round(hours)) || hours < 42 && substitute($l.day, 1) || days < 30 && substitute($l.days, Math.round(days)) || days < 45 && substitute($l.month, 1) || days < 365 && substitute($l.months, Math.round(days / 30)) || years < 1.5 && substitute($l.year, 1) || substitute($l.years, Math.round(years));
				separator = $l.wordSeparator;
				if ($l.wordSeparator === void 0) {
					separator = ' ';
				}
				return $.trim([words].join(separator));
			},
			x: function(v) {
				var d;
				d = new Date(v);
				return d.getTime();
			}
		};
	}
]);