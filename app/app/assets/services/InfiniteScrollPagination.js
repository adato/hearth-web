'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.InfiniteScrollPagination
 * @description factory for keeping track of pages in infinite scroll
 */

angular.module('hearth.services').factory('InfiniteScrollPagination', ['$window', '$document', 'Throttle', 'ViewportUtils', '$state', '$location', '$rootScope',
	function($window, $document, Throttle, ViewportUtils, $state, $location, $rootScope) {

		var currentPage = parseInt($location.search().page || 1),
			pageLimitBottom = parseInt($location.search().page || 1),
			pageCounter = currentPage,
			pageMarkers = {},
			scrollAlreadyBound,
			q = 0;

		var factory = {
			bindScroll: bindScroll,
			firstPageNotShown: firstPageNotShown,
			getPageAndIncrementBottom: getPageAndIncrementBottom,
			getPageBottom: getPageBottom,
			infiniteScrollRunner: infiniteScrollRunner,
			init: init,
			marketplaceInit: marketplaceInit,
			setPage: setPage,
			subscribe: subscribe,
			unbindScroll: unbindScroll
		};

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
			setPage(nearestTop);
		}

		// function called by marketplace controller on its initiation
		function marketplaceInit() {
			currentPage = 1;
		}

		// function that returns whether the marketplace has some
		// pages displayed but the first one is not amongst them
		function firstPageNotShown() {
			// check that at least one page exists and if there is the first one
			// however weird that sounds..
			for (var prop in pageMarkers) {
				if (pageMarkers.hasOwnProperty(prop) && pageMarkers[1] == void 0) return true;
			}
			// do not return that first is not shown if nothing is (yet) shown
			return false;
		}

		// return currently latest page number and increment
		// to be used when getting new posts
		function getPageAndIncrementBottom() {
			var p = pageCounter;
			pageCounter++;
			return p;
		}

		function getPageBottom() {
			return pageLimitBottom;
		}

		// should be run by marketplace controller
		function init(page) {
			var pageTemp = parseInt(page || $location.search().page || 1);
			currentPage = pageTemp;
			pageLimitBottom = pageTemp;
			pageCounter = currentPage;
			pageMarkers = {};
			setPage(page || $location.search().page || 1);
			bindScroll();
		}

		// function that binds scroll
		function bindScroll() {
			if (scrollAlreadyBound) return false;
			angular.element($window).bind('scroll', Throttle.go(infiniteScrollRunner, 20));
			scrollAlreadyBound = true;
		}

		function unbindScroll() {
			angular.element($window).unbind('scroll', infiniteScrollRunner);
			scrollAlreadyBound = void 0;
		}

		function infiniteScrollRunner() {
			calculateOffsetsAndSetPage(pageMarkers);
		}

		// set new url page
		function setPage(pageNumber) {
			if (pageNumber < 1) return false;
			currentPage = pageNumber;

			$location.search('page', pageNumber);
			// make sure it appears it properly
			if (!$rootScope.$$phase) $rootScope.$apply();
			return true;
		}

		// function for pageMarker directives through which they init themselves to pagination
		function subscribe(markerElement, page) {
			pageMarkers[page] = {
				el: markerElement,
				offset: ViewportUtils.getTopOffset(markerElement)
			};
		}

	}
]);