'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ProfileProgress
 * @description
 */

angular.module('hearth.services').factory('ProfileProgress', [
	'IsEmpty',
	function(IsEmpty) {

		return {
			get: function(data, patternList) {
				var i, j, pattern,
					progress = 0,
					counter = 0,
					missingItems = [],
					errorCounter;

				if (data && patternList && patternList.length > 0) {

					for (i = 0; i < patternList.length; i++) {
						pattern = patternList[i];

						if (pattern.items && pattern.items.length > 0) {
							errorCounter = 0;
							for (j = 0; j < pattern.items.length; j++) {
								if (!IsEmpty(data[pattern.items[j].name])) {
									counter++;
									break;
								}
								errorCounter++;
							}
							if (errorCounter > 0) {
								missingItems.push(pattern.message);
							}
						} else {
							if (!IsEmpty(data[pattern.name])) {
								counter++;
							} else {
								missingItems.push(pattern.message);
							}
						}
					}

					progress = Math.round((counter / patternList.length) * 100);
				}
				return {
					progress: progress,
					missing: missingItems
				};
			}
		};
	}
]);