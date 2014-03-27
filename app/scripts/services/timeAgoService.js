'use strict';

angular.module('hearth.services').service('timeAgoService', [
	'$interval', '$translate',
	function($interval, $translate) {
		var ref;
		ref = null;
		return {
			getStrings: function() {
				return {
					seconds: $translate('LESS_THAN_MINUTE_AGO'),
					minute: $translate('MINUTE_AGO'),
					minutes: $translate('%d MINUTES_AGO'),
					hour: $translate('HOUR_AGO'),
					hours: $translate('%d HOURS_AGO'),
					day: $translate('DAY_AGO'),
					days: $translate('%d DAYS_AGO'),
					month: $translate('MONTH_AGO'),
					months: $translate('%d MONTHS_AGO'),
					year: $translate('YEAR_AGO'),
					years: $translate('%d YEARS_AGO'),
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
				return ref.nowTime = (new Date()).getTime();
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
					return this.initted = true;
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