'use strict';

angular.module('hearth.services').factory('ProfileProgress',
	function() {

		return {
			getProgress: function(data, pattern) {
				var progress = 0,
					counter = 0,
					sum = 0;

				if (pattern && data) {
					for (var key in pattern) {
						sum++;
						if (data[key] instanceof Array) {
							if (data[key].length > 0) {
								counter++;
							}
						} else if (data[key]) {
							counter++;
						}
					}
					progress = Math.round((counter / sum) * 100);
				}

				return progress;
			}
		};

	}
);