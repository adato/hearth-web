'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Facebook
 * @description
 */

angular.module('hearth.services').service('Facebook', [
	function() {

		var inited = false;

		this.init = function() {

			if (!inited) {
				FB.init({
					appId: $$config.fbAppId,
					cookie: true,
					status: true,
					xfbml: true,
					version: 'v2.6'
				});
			}
			inited = true;
		};

		this.init();
		return this;

	}
]);