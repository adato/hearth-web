'use strict';

/**
 * @ngdoc service
 * @name hearth.services.IsEmpty
 * @description Checks whether an Object or an Array is empty or not.
 *				If value is neither Array or Object, and it evaluates
 *				to false, isEmpty evaluates to true.
 */

angular.module('hearth.services').factory('IsEmpty', [function() {

	function isEmpty(value) {
		var property, propCounter = 0;

		if (value instanceof Array) {
			if (value.length === 1 && isEmpty(value[0])) {
				//if there is only one item and item is empty
				return true;
			} else if (value.length === 0) {
				return true;
			}
		} else if (value instanceof Object) {
			for (property in value) {
				propCounter++;
				return isEmpty(value[property]);
			}
			return propCounter === 0;
		} else if (!value) {
			return true;
		}
		return false;
	};

	return isEmpty;

}]);