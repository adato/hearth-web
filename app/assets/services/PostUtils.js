'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.PostUtils
 * @description provide helper function fot the post
 */

angular.module('hearth.services').factory('PostUtils', ['$analytics', '$window', '$state', function($analytics, $window, $state) {

  const postTypes = $$config.postTypes

	const factory = {
		getPostTypeCode,
		logViewActivity
	}

	return factory

	//////////////

  /**
   *
   * @param author - e.g. user,community
   * @param type - e.g. offer,need
   * @param exact_type - e.g. loan,gift,any
   * @returns post type code
   */
	function getPostTypeCode(author, type, exact_type) {
		return postTypes[author][exact_type][type]
	}

	/**
	 *	Function that logs to mixpanel that a post has been viewed
	 *	Logs the posts ID and the current url
	 */
	function logViewActivity({item, meta = {context: 'default'}, state}) {
    if (meta.context !== 'default' && state !== 'market') console.warn('invalid combo', item, meta, state)
		$analytics.eventTrack('post-viewed', angular.merge({}, meta, {
			id: item._id,
      state
		}))
	}

}])