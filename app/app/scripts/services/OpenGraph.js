'use strict';

/**
 * @ngdoc service
 * @name hearth.services.OpenGraph
 * @description
 */

angular.module('hearth.services').service('OpenGraph', [
	'$rootScope',
	function($rootScope) {
		var self = this,
			defaults = {
				title: '',
				description: '',
				image: '',
			},
			getUrl = function() {
				return window.location.href;
			};

		/**
		 * Nastavi defaultni opengraph info pro aplikaci
		 */
		this.setDefaultInfo = function(title, desc, image) {

			defaults.title = title || '';
			defaults.description = desc || '';
			defaults.image = image || '';
		};

		this.getDefaultInfo = function() {
			return defaults;
		};

		/**
		 * Nastavi info do opengraph meta tagu
		 */
		this.set = function(title, desc, url, image) {

			$rootScope.og_title = (typeof title === 'string') ? title : defaults.title;
			$rootScope.og_description = (typeof desc === 'string') ? desc : defaults.description;
			$rootScope.og_image = (typeof image === 'string') ? image : defaults.image;
			$rootScope.og_url = (typeof url === 'string') ? url : getUrl();

			// console.log($rootScope.og_title + ' -- ' + $rootScope.og_description);
		};

		/**
		 * Nastavi defaultni info do meta tagu
		 */
		this.setDefault = function() {

			self.set();
		};
	}
]);