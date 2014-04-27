'use strict';

angular.module('hearth.services').factory('ProfileProgress',
	function() {

		return {
			getProgress: function(data, pattern) {
				var progress = 0,
					counter = 0,
					sum = 0,
					item, property;

				if (pattern && data) {
					for (var key in pattern) {
						item = data[key];
						sum++;
						if (item instanceof Array) {
							if (item.length === 1 && item[0] || item.length > 1) {
								//if there is only one item and item is not empty or if there more items
								counter++;
							}
						} else if (item instanceof Object) {
							for (property in item) {
								if (item[property]) {
									counter++;
									break;
								}
							}

						} else if (item) {
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