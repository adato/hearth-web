'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Ab
 * @description factory for A/B test logic
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
		} else if (false && LocalStorage.get(identificator)) {
			library[identificator] = $.cookie(identificator);
			return library[identificator];
		}
		return void 0;
	}

	function setItem(identificator, value) {
		library[identificator] = value;
		$.cookie(identificator, value);
	}

}]);