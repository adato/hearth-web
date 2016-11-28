'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.LocationJsonDataTransform
 * @description transform functions for location.json_data (both TO and FROM)
 *				To be used at ngResource transformRequest and trasnformResponse
 */

angular.module('hearth.services').factory('LocationJsonDataTransform', ['$window', function($window) {

	var factory = {
		getLocationJson: getLocationJson,
		insertLocationJson: insertLocationJson
	};

	return factory;

	/////////////////

	/**
	 *	Remove json_data from locations[i]
	 *	entity.locations[i] = entity.locations[i].json_data
	 */
	function getLocationJson(entity) {
		return locationJsonHelper(entity, true, this);
	}

	/**
	 *	Enwrap locations[i] into json_data
	 *	entity.locations[i].json_data = entity.locations[i]
	 */
	function insertLocationJson(entity) {
		return locationJsonHelper(entity, false, this);
	}

	/**
	 *	Function that either enwraps a locations[i] object into json_data object, or removes it
	 *
	 *	@param {Object} entity - the object containing a locations prop to be transformed
	 *	@param {Boolean} fromJson - if true, extracts locations from json_data prop,
	 *		creates and fills the json_data prop otherwise
	 *	@param {Object} opts - {string} prop - property on which to search for locations prop
	 *	@return {Object} transformed entity object
	 */
	function locationJsonHelper(entity, fromJson, opts) {
		var entityIsValid = true;
		if (fromJson && ((typeof entity).toLowerCase() === 'string')) {
			try {
				entity = $window.JSON.parse(entity);
			} catch (e) {
				entityIsValid = false;
			}
		}
		if (entityIsValid) {
			var entityDummy = [entity];
			opts = opts || {};
			if (opts.prop) entityDummy = entity[opts.prop];
			for (var q = entityDummy.length; q--;) {
				if (entityDummy[q].locations) {
					for (var i = entityDummy[q].locations.length; i--;) {
						entityDummy[q].locations[i] = (fromJson ? entityDummy[q].locations[i].json_data : {
							json_data: (entityDummy[q].locations[i].address_components ? entityDummy[q].locations[i] : {
								place_id: entityDummy[q].locations[i].place_id
							})
						});
					}
				}
			}
			if (!fromJson && ((typeof entity).toLowerCase() === 'object')) entity = $window.JSON.stringify(entity);
		}
		return entity;
	}

}]);