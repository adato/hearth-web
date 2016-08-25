'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Ab
 * @description
 */

angular.module('hearth.services').factory('Ab', ['LocalStorage', function(LocalStorage) {

	var library = {};

	var factory = {
		getItem: getItem,
		setItem: setItem
	};

	return factory;

	/////////////////

	function getItem(identificator) {
		if (library[identificator]) {
			return library[identificator];
		} else if (LocalStorage.get(identificator)) {
			library[identificator] = LocalStorage.get(identificator);
			return library[identificator];
		}
	}

	function setItem(identificator, value) {
		library[identificator] = value;
		LocalStorage.set(identificator, value);
	}

}]);