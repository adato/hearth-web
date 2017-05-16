'use strict';

/**
 * @ngdoc service
 * @name hearth.services.OpenGraph
 * @description
 */

angular.module('hearth.services').service('OpenGraph', ['$rootScope', '$log', function($rootScope, $log) {

	var self = this;

	const defaults = {
		title: '',
		description: '',
		image: '',
	};

	/**
	 * Set opengraph info for application
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
	 * Set info to opengraph meta tag
	 */
	this.set = function(title, desc, url, image, imageSize = []) {
		$rootScope.og_title = (typeof title === 'string') ? title : defaults.title;
		$rootScope.og_description = (typeof desc === 'string') ? desc : defaults.description;
		$rootScope.og_url = (typeof url === 'string') ? url : window.location.href;
		self.setImageData(image, imageSize[0], imageSize[1]);
		$rootScope.debug && $log.log('Opengraph debug: ', $rootScope.og_title + ' -- ' + $rootScope.og_description);
	};

	/**
	 * Set default info to opengraph meta tag
	 */
	this.setDefault = function() {
		self.set();
	};

}]);