'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Viewport
 * @description This service contains some tests for browser viewport, currently works only with height
 */

angular.module('hearth.services').service('Viewport', [
	'$translate', '$window',
	function($translate, $window) {

		var viewportHeight;
		var self = this;

		function recountHeight() {
			viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		}

		// this will get browser viewport position
		this.getViewportPos = function(base) {
			base = base || 'html';
            return {
            	min: $(base).scrollTop(),
            	max: viewportHeight + $(base).scrollTop(),
            	height: viewportHeight,
            	mid: $(base).scrollTop() + viewportHeight / 2,
            };
		};
		
		// this will get target element position of max, min Y coord, height & mid position
		this.getTargetViewportPos = function(target) {
            var target = $(target);
            var height = target.height();

            if (!target.length) throw "NoElementErr";

            return {
            	min: target.offset().top,
            	max: height + target.offset().top,
            	height: height,
            	mid: target.offset().top + height / 2,
            };
		};
		
		// test if given element is in browser viewport
		this.isInViewport = function(target, base) {
			var viewport = self.getViewportPos(base);
			var target = self.getTargetViewportPos(target);

			if (!target.length || !viewport.length) throw "NoElementErr";

			return (viewport.min <= target.min && viewport.max >= target.max)
		};

		// This will return distance from
		// bottom of viewport and bottom of target element if the viewport is above element
		// top of viewport and top of target element if the viewport is below element
		this.getTargetsDistance = function(target, base) {
			var viewport = self.getViewportPos(base);
			var target = self.getTargetViewportPos(target);

			if (!target.length || !viewport.length) throw "NoElementErr";

			if(viewport.min < target.min)
				return -1 * (viewport.max - target.max);
			else
				return (target.min - viewport.min);
		};

		this.isBottomScrolled = function(element, outer, inner) {
			outer = $(outer, element);
			inner = $(inner, outer);
			return outer.scrollTop() + inner.height() >= inner.prop('scrollHeight');
		};

		// smooth scroll given pixels with offset
		this.scroll = function(h, offset, base) {
			base = base || 'html';
			if(h > 0) 
				h += offset; // if we scroll bot, add offset
			else	
				h -= offset; // if we scroll up, substract offset

			$(base).animate({ scrollTop: ($(base).scrollTop()+h)+"px" });
		};

		// test if target element is in viewport, if not, scroll to it
		this.scrollIfHidden = function(target, offset, base) {
			try {
				if(!self.isInViewport(target, base)) {
					self.scroll(self.getTargetsDistance(target), offset, base);
				}
			} catch (e) {
				if (e === "NoElementErr") console.log("element not found");
			}
		};

		recountHeight();
		angular.element($window).bind('resize', recountHeight);

		return this;
	}
]);