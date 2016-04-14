'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FileService
 * @description Helping functions for operations done on/with files, images etc.
 */

angular.module('hearth.services').factory('FileService', [function() {

	var factory = {};

	var forbiddenFileTypes = ['ade', 'adp', 'bat', 'chm', 'cmd', 'com', 'cpl', 'exe', 'hta', 'ins', 'isp', 'jar', 'jse', 'lib', 'lnk', 'mde', 'msc', 'msp', 'mst', 'pif', 'scr', 'sct', 'shb', 'sys', 'vb', 'vbe', 'vbs', 'vxd', 'wsc', 'wsf', 'wsh'];
	var imageFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

	factory.fileTypes = {
		forbidden: forbiddenFileTypes,
		image: imageFileTypes
	}

	return factory;

}]);