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
				$(this)[0].exifdata = false;
				EXIF.getData(this, getData);
			});

			var getData = function() {
				var orientation = EXIF.getTag(this, "Orientation");
				var transform = '';
				$(this).css('transform', "none");

				if ($(this)[0].origWidth && $(this)[0].origHeight) { // restore initial if archived
					$(this).css("maxWidth", $(this)[0].origWidth);
					$(this).css("height", $(this)[0].origHeight);
				}

				switch (orientation) {
					case 1: break;
					case 2: transform = 'scaleX(-1)'; break; // no rotation needed
					case 3: transform = 'rotate(180deg)'; break; // rotated 180deg
					case 4: transform = 'rotate(180deg) scaleX(-1)'; break; // rotated 180deg and flipped
					case 5: transform = 'rotate(90deg) scaleY(-1)'; break; // rotated 90, flipped
					case 6: transform = 'rotate(90deg)'; break; // rotated 90deg
					case 7: transform = 'rotate(270deg) scaleY(-1)'; break; // rotated -90deg, flipped
					case 8: transform = 'rotate(270deg)'; break; // rotated -90deg
				}

				if (orientation > 4) {
					var origWidth = parseInt($(this).css("width"));
					var origHeight = parseInt($(this).css("height"));
					var ratio = origHeight / origWidth;
					$(this)[0].origWidth = $(this).css("maxWidth");
					$(this)[0].origHeight = $(this).css("height");

					if (ratio < 1) {
						$(this).css("maxWidth", origWidth + (origWidth * ratio) + "px");
						$(this).css("height", origWidth + "px");
					}
				}
				if (transform) {
					$(this).css('transform', transform);
				}
			}
		}
	};
});
