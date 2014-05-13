'use strict';

angular.module('hearth.services').factory('ProfileProgress',
	function() {

		function isEmpty(value) {
			var property, propCounter = 0;

			if (value instanceof Array) {
				if (value.length === 1 && isEmpty(value[0])) {
					//if there is only one item and item is empty
					return true;
				} else if (value.length === 0) {
					return true;
				}
			} else

			if (value instanceof Object) {
				for (property in value) {
					propCounter++;
					return isEmpty(value[property]);
				}
				return propCounter === 0;
			} else if (!value) {
				return true;
			}
			return false;
		}

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
								if (!isEmpty(data[pattern.items[j].name])) {
									counter++;
									break;
								}
								errorCounter++;
							}
							if (errorCounter > 0) {
								missingItems.push(pattern.message);
							}
						} else {
							if (!isEmpty(data[pattern.name])) {
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
);