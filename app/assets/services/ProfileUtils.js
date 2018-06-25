'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ProfileUtils
 * @description Helper class for all Hearth profiles (user himself, other users, community profiles...)
 */

angular.module('hearth.services').factory('ProfileUtils', ['Karma', 'MottoLength', '$window', '$q', '$rootScope', function(Karma, MottoLength, $window, $q, $rootScope) {

	const PROFILE_TYPES = {
		USER: 'user',
		COMMUNITY: 'community'
	}

	const MAX_MOTTO_LENGTH = MottoLength

	const factory = {
		transformDataForUsage,
		transformDataForSaving,
		single: {
			copyMottoIfNecessary,
			fillWebs,
			joinInterests,
			splitInterests
		},
		getPosts,
		params: {
			PROFILE_TYPES,
			MAX_MOTTO_LENGTH
		},
		getUploadOpts,
	}

	return factory

	/////////////////

	/**
	 *	Function returning some basic settings for avatar upload
	 */
	function getUploadOpts() {
		return {
			minSize: 400, // Pixels
			limitMb: 5,
			resultPropName: 'public_avatar_url'
		};
	}

	/**
	 *	- {Int} id - community id
	 *	- {Boolean} active - get active/passive posts
	 *	- {$resource} resource
	 *	- {function} cb - callback to call on finish
	 */
	function getPosts(opts) {
		return $q((resolve, reject) => {
			var type = opts.active ? 'active' : 'inactive';
      if (opts.getPostsStatus.running) {
        opts.getPostsQ.push([resolve, reject, type]);
      } else {
        opts.getPostsStatus.running = true;
        opts.resource(opts.params || {}, res => {
					opts.getPostsStatus.running = false;
          res.data.forEach(function (item) {
            if ($rootScope.isPostActive(item)) {
              opts.postCount.active++;
              opts.getPostsResult.active.push(item);
            } else {
              opts.postCount.inactive++;
              opts.getPostsResult.inactive.push(item);
            }
					});
          resolve(opts.getPostsResult[type]);
          if (opts.getPostsQ.length) {
            var r = opts.getPostsQ.splice(opts.getPostsQ.length - 1, 1)[0];
            r[0](opts.getPostsResult[r[2]]);
          }
        }, function (err) {
          reject(opts.getPostsResult[type]);
          if (opts.getPostsQ.length) {
            var r = opts.getPostsQ.splice(opts.getPostsQ.length - 1, 1)[1]
            r[0](opts.getPostsResult[r[2]]);
          }
        });
      }
		});
	}

	/**
	 *	Function that takes the profile and its type and processes all necessary transforms on it
	 *	so that it can be used without problem
	 *
	 *	@param {Object} paramObject	-	{Object}	profile [required] the object to be transformed
	 *								-	{String}	type [required] [one of PROFILE_TYPES]
	 *	@return {Object} paramObject.profile -	the transformed and ready for use profile object
	 */
	function transformDataForUsage(paramObject) {
		if (!(paramObject && paramObject.profile && paramObject.type && !!(PROFILE_TYPES[paramObject.type.toUpperCase()]))) throw new Error('Insufficient paramObject to transform input data correctly.');
		paramObject.type = paramObject.type.toUpperCase();

		// common for all types
		fillWebs(paramObject.profile);

		// type-specific
		switch (paramObject.type) {
			case PROFILE_TYPES.USER:
				// nothing yet ..
				break;

			case PROFILE_TYPES.COMMUNITY:
				// nothing yet ..
				break;
		}

		return paramObject.profile;
	}

	/**
	 *	Function that takes the profile and its type and processes all necessary transforms on it
	 *	so that it can be successfully saved to server.
	 *
	 *	@param {Object} paramObject	-	{Object}	profile [required] the object to be transformed
	 *								-	{String}	type [required] [one of PROFILE_TYPES]
	 *	@return {Object} paramObject.profile -	the transformed and ready for saving profile object
	 */
	function transformDataForSaving(paramObject) {
		if (!(paramObject && paramObject.profile && paramObject.type && !!(PROFILE_TYPES[paramObject.type.toUpperCase()]))) throw new Error('Insufficient paramObject to transform input data correctly.');
		paramObject.type = paramObject.type.toUpperCase();

		return paramObject.profile;
	}

	// FUNCTIONS
	function copyMottoIfNecessary(profile) {
		if (!profile.motto) {
			profile.motto = profile.about || profile.description || '';
			if (profile.motto.length > (MAX_MOTTO_LENGTH)) profile.motto = profile.motto.slice(0, MAX_MOTTO_LENGTH - 3) + '...';
		}
		return profile;
	}

	function fillWebs(profile) {
		if (!profile.webs || !profile.webs.length) profile.webs = [''];
		return profile;
	}

	function splitInterests(profile) {
		profile.interests = (profile.interests ? profile.interests.split(',') : []);
		return profile;
	}

	function joinInterests(profile) {
		// check the structure
		profile.interests = profile.interests || [];
		for (var i = profile.interests.length; i--;) {
			if (profile.interests[i].text) profile.interests[i] = profile.interests[i].text;
		}
		// profile.interests = profile.interests.join(',');
		return profile;
	}

}]);
