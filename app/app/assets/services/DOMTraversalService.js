'use strict';

/**
 * @ngdoc service
 * @name hearth.services.DOMTraversalService
 * @description library exposing DOM traversal functions
 */

angular.module('hearth.services').factory('DOMTraversalService', [function() {

	var factory = {
		findParentBySelector: findParentBySelector
	};

	return factory;

	///////////////////

	function findParentBySelector(elem, selector) {
		var all = document.querySelectorAll(selector);
		var cur = elem;
		while (cur && !collectionHas(all, cur)) {
			cur = cur.parentNode;
		}
		return cur; //will return null if not found
	}
	// findParentBySelector helping function
	function collectionHas(a, b) {
		for (var i = 0, len = a.length; i < len; i++) {
			if (a[i] === b) return true;
		}
		return false;
	}

}]);