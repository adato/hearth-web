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
	 *	@param {String} entity - the JSON string containing all entity data
	 *	@return {Object} transformed entity object with location json_data removed. It is
	 *	 either object, or array, or array embedded in object.[prop]
	 */
	function getLocationJson(entity) {
		var opts = {},
			hasProp = false,
			ret = {};
		if (typeof this !== 'undefined') opts = this;

		try {
			if ((typeof entity).toLowerCase() !== 'string') {
				throw new Error("Invalid type of 'locations' for decoding");
			}
			var entityObj = $window.JSON.parse(entity);

			// if the path to entity is set, use it instead of default
			if (opts.prop && typeof entityObj[opts.prop] !== 'undefined' && entityObj[opts.prop]) {
				entityObj = entityObj[opts.prop]; // use this path to entity
				hasProp = true;
			}

			// decode it depending if it is an array or single object
			if (Array.isArray && Array.isArray(entityObj)) {
				for (var i in entityObj) {
					entityObj[i] = decodeEntity(entityObj[i]);
				}
			} else {
				entityObj = decodeEntity(entityObj);
			}

			// return value: either obj, or list embedded in obj
			if (hasProp) {
				ret[opts.prop] = entityObj;
			} else {
				ret = entityObj;
			}
			return ret;

		} catch (e) {
			// silent fail in case of "wrong" data
			// and return original entity
			return entity;
		}
	}

	/**
	 *	Single post location transform
	 */
	function decodeEntity(entity) {
		if (typeof entity.locations == 'undefined' || entity.locations === null || typeof entity.locations.length === 'undefined') {
			// this is kind of an error, but it still can occur:
			// for example when non-existing post is requested,
			// then a result from an endpoint (empty set or error json object)
			// is passed as 'entity' (which is bad, but it needs to pass without raising an error).
			return entity;
		}

		entity.locations.forEach(function(location, key) {
			// @kamil - this has been changed, so that when a location.json_data is not found, the location is left unchanged, instead of replaced with an empty array, which does zero sense 
			// entity.locations[key] = (typeof location.json_data !== 'undefined' ? location.json_data : []);
			entity.locations[key] = (typeof location.json_data !== 'undefined' ? location.json_data : location);
		});
		return entity;
	}


	/**
	 *	Enwrap locations[i] into json_data
	 *	entity.locations[i].json_data = entity.locations[i]
	 *	@param {Object} entity - entity data in object
	 *	@return {Object} transformed JSON string with location json_data added
	 */
	function insertLocationJson(entity) {
		try {
			if ((typeof entity).toLowerCase() !== 'object') {
				throw new Error("Invalid type of 'locations' for encoding");
			}
			if (typeof entity.locations === 'undefined' || entity.locations === null || typeof entity.locations.length === 'undefined') {
				throw new Error("Undefined or null entityLocations");
			}

			entity.locations.forEach(function(location, key) {
				entity.locations[key] = {
					json_data: (location.address_components ? location : {
						place_id: location.place_id
					})
				}
			});
			return $window.JSON.stringify(entity);

		} catch (e) {
			throw new Error("An error ocured while parsing object data: " + e.message);
		}
	}

}]);