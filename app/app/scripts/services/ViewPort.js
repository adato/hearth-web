'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Viewport
 * @description This service contains some tests for browser viewport, currently works only with height
 */

angular.module('hearth.services').service('Viewport', [
	'$translate',
	function($translate) {

		var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		var self = this;

		// this will get browser viewport position
		this.getViewportPos = function() {
            return {
            	min: $('html').scrollTop(),
            	max: viewportHeight + $('html').scrollTop(),
            	height: viewportHeight,
            	mid: $('html').scrollTop() + viewportHeight / 2,
            };
		};
		
		// this will get target element position of max, min Y coord, height & mid position
		this.getTargetViewportPos = function(target) {
            var target = $(target);
            var height = target.height();

            return {
            	min: target.offset().top,
            	max: height + target.offset().top,
            	height: height,
            	mid: target.offset().top + height / 2,
            };
		};
		
		// test if given element is in browser viewport
		this.isInViewport = function(target) {
			var viewport = self.getViewportPos();
			var target = self.getTargetViewportPos(target);

			return (viewport.min <= target.min && viewport.max >= target.max)
		};

		// This will return distance from
		// bottom of viewport and bottom of target element if the viewport is above element
		// top of viewport and top of target element if the viewport is below element
		this.getTargetsDistance = function(target) {
			var viewport = self.getViewportPos();
			var target = self.getTargetViewportPos(target);

			if(viewport.min < target.min)
				return -1 * (viewport.max - target.max);
			else
				return (target.min - viewport.min);
		};

		// smooth scroll given pixels with offset
		this.scroll = function(h, offset) {
			if(h > 0) 
				h += offset; // if we scroll bot, add offset
			else	
				h -= offset; // if we scroll up, substract offset

			$("html, body").animate({ scrollTop: ($("html").scrollTop()+h)+"px" });
		};

		// test if target element is in viewport, if not, scroll to it
		this.scrollIfHidden = function(target, offset) {
			if(!self.isInViewport(target)) {
				self.scroll(self.getTargetsDistance(target), offset);
			}
		};

		return this;
	}
]);