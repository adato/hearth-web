'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.InfiniteScrollPagination
 * @description factory for keeping track of pages in infinite scroll
 */

angular.module('hearth.services').factory('InfiniteScrollPagination', ['$window', '$document', 'Throttle', 'ViewportUtils', '$state',
	function($window, $document, Throttle, ViewportUtils, $state) {

		var page = parseInt($state.params.page || 0),
			pageMarkers = {};

		var factory = {
			getPage: getPage,
			setPage: setPage,
			subscribe: subscribe
		};

		init(pageMarkers);

		return factory;

		///////////////////

		function calculateOffsetsAndSetPage(markers) {
			// page break is in the middle of the screen
			var scst = ViewportUtils.getScreenCenterScrollTop(),
				nearestTop,
				nearestTopTemp;

			// recalculate all page offsets in case something has
			// changed on the page since the last scroll event fired
			for (var page in markers) {
				if (markers.hasOwnProperty(page)) {
					markers[page].offset = ViewportUtils.getTopOffset(markers[page].el);

					// find the nearest page break above screen center
					var currTop = (scst - markers[page].offset);
					if (nearestTopTemp === void 0) {
						nearestTopTemp = currTop;
						nearestTop = page;
					} else if (currTop > 0 && currTop < nearestTopTemp) {
						nearestTopTemp = currTop;
						nearestTop = page;
					}
				}
			}
			// assign current page
			console.log('should set', nearestTop, 'dist', nearestTopTemp);
			setPage(nearestTop);
		}

		function getPage() {
			return page;
		}

		function init(markers) {
			angular.element($window).bind('scroll', Throttle.go(function(event) {
				calculateOffsetsAndSetPage(markers);
			}, 50));
		}

		function setPage(pageNumber) {
			page = pageNumber;
			$state.go('.', {
				page: pageNumber
			}, {
				notify: false
			});
			return true;
		}

		// function for pageMarker directives through which they init themselves to pagination
		function subscribe(markerElement, page) {
			pageMarkers[page] = {
				el: markerElement,
				offset: ViewportUtils.getTopOffset(markerElement)
			};
			console.log('subscripbing', page, pageMarkers[page]);
		}

	}
]);