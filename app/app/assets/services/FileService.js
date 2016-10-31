'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FileService
 * @description Helping functions for operations done on/with files, images etc.
 */

angular.module('hearth.services').factory('FileService', [function() {

	var factory = {};

	// File type arrays should best be written in a format that is acceptible, when .join(',')-ed, in an input accept property.
	// For more info about this format, check:
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes
	var forbiddenFileTypes = ['.ade', '.adp', '.bat', '.chm', '.cmd', '.com', '.cpl', '.exe', '.hta', '.ins', '.isp', '.jar', '.jse', '.lib', '.lnk', '.mde', '.msc', '.msp', '.mst', '.pif', '.scr', '.sct', '.shb', '.sys', '.vb', '.vbe', '.vbs', '.vxd', '.wsc', '.wsf', '.wsh'];
	var imageFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

	factory.fileTypes = {
		forbidden: forbiddenFileTypes,
		image: imageFileTypes
	}

	factory.getCleanInvalidFileType = function() {
		return {
			shown: false,
			type: null
		};
	};

	return factory;

}]);