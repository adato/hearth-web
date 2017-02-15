'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.PostUtils
 * @description provide helper function fot the post
 */

angular.module('hearth.services').factory('PostUtils', [
	function() {

    var postTypes = $$config.postTypes;

		var factory = {
			getPostTypeCode: getPostTypeCode
		};

		return factory;

    /**
     *
     * @param author - e.g. user,community
     * @param type - e.g. offer,need
     * @param exact_type - e.g. loan,gift,any
     * @returns post type code
     */
		function getPostTypeCode(author, type, exact_type) {
			return postTypes[author][exact_type][type];
		}

	}
]);
