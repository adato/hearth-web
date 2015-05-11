'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.resizedThumbnailImage
 * @description 
 * @restrict A
 */
angular.module('hearth.directives').directive('exifRotated', function() {
	return {
		restrict: 'A',
        link: function(scope, element, attrs) {
	        element.bind('load', function() {
	        	if (typeof EXIF === 'undefined') return;
	        	console.log($(this));
        		$(this)[0].exifdata = false;
	        	EXIF.getData(this, function() {
	            	var orientation = EXIF.getTag(this, "Orientation");
	            	var rotate = '';
	            	switch (orientation) {
	            		case 1:
	            		case 2: break; // no rotation needed
	            		case 3:
	            		case 4: rotate = '-180deg'; break; // rotated 180deg
	            		case 5:
	            		case 6: rotate = '90deg'; break; // rotated -90deg
	            		case 7:
	            		case 8: rotate = '-90deg'; break; // rotated 90deg
	            	}
	            	if (rotate !== '') {
	            		var origWidth = parseInt($(this).css("width"));
	            		var origHeight = parseInt($(this).css("height"));
	            		var ratio = origHeight / origWidth;
	            		$(this).css("maxWidth", origWidth + (origWidth * ratio) + "px");
						$(this).css("height", origHeight + (origHeight * ratio) + "px");
	            		$(this).css("transform", "rotate(" + rotate + ") scale(1.01)");
	            	}
	        	});
            });
        }
	};
});
