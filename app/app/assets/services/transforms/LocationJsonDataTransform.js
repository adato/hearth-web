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
	 *	@return {Object} transformed entity object with location json_data removed
	 */
	function getLocationJson(entity) {
		var opts = {};
		if (typeof this !== 'undefined' && this.opts) opts = this.opts;

		try {
			if ((typeof entity).toLowerCase() !== 'string') {
				throw new Error("Invalid type of 'locations' for decoding");
			}

			var entityDecoded = $window.JSON.parse(entity);

			// if the path to entity is set, use it instead of default
			if (opts.prop && typeof entityDecoded[opts.prop] !== 'undefined' && entityDecoded[opts.prop]) {
				entityDecoded = entityDecoded[opts.prop]; // use this path to entity
			}
			if (typeof entityDecoded.locations === 'undefined' || entityDecoded.locations === null || typeof entityDecoded.locations.length === 'undefined') {
				throw new Error("Undefined or null entityLocations");
			}

			entityDecoded.locations.forEach(function(location, key) {
				entityDecoded.locations[key] = (typeof location.json_data !== 'undefined' ? location.json_data : []);
			});
			return entityDecoded;

		} catch (e) {
			throw new Error("An error ocured while parsing input data: " + e.message);
		}

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