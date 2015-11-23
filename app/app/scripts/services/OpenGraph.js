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
		this.setDefaultInfo = function(title, desc, image, imageWidth, imageHeight) {

			defaults.title = title || '';
			defaults.description = desc || '';
			defaults.image = image || '';
			defaults.imageWidth = imageWidth || 0;
			defaults.imageHeight = imageHeight || 0;
		};

		this.getDefaultInfo = function() {
			return defaults;
		};

		this.getDefaultImage = function() {
			return {
				og_image: defaults.image,
				og_image_width: defaults.imageWidth,
				og_image_height: defaults.imageHeight,
			};
		};

		this.setImageData = function(image, width, height) {
			if (image) {
				$rootScope.og_image = image;
				$rootScope.og_image_width = width;
				$rootScope.og_image_height = height;
			} else {
				var ogImg = self.getDefaultImage();
				for (var attr in ogImg) {
					$rootScope[attr] = ogImg[attr];
				}
			}
		};

		/**
		 * Nastavi info do opengraph meta tagu
		 */
		this.set = function(title, desc, url, image, imageSize) {
			var imageWidth, imageHeight;
			$rootScope.og_title = (typeof title === 'string') ? title : defaults.title;
			$rootScope.og_description = (typeof desc === 'string') ? desc : defaults.description;
			$rootScope.og_url = (typeof url === 'string') ? url : getUrl();

			if (imageSize) {
				imageWidth = imageSize[0];
				imageHeight = imageSize[1];
			}
			self.setImageData(image, imageWidth, imageHeight);

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
