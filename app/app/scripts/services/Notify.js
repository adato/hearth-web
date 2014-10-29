'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Notification
 * @description Notification service
 */

angular.module('hearth.services').service('Notify', [
	'$translate',
	
	function($translate) {
		var tmpl = '<div data-alert class="alert-box $$type radius">$$text<i class="close">&times;</i></div>';
		var notifyTypes = { 1: 'success', 2: 'info', 3: 'warning', 4: 'error', 5: '' };
		var self = this;

		this.T_SUCCESS = 1;
		this.T_INFO = 2;
		this.T_WARNING = 3;
		this.T_ERROR = 4;
		this.T_TEXT = 5;

		this.TOP = '#notify-top';

		// add notification with plain text
		this.add = function(text, type, container, ttl, delay) {
			
			// if not set delay, set it to 0ms
			delay = delay || 0;
			// time to live - timeout to autoclose notify
			ttl = ttl || 114000;
			// default time is info box
			type = type || this.T_INFO;
			// default container is top center contaimer
			container = container || self.TOP;

			console.log("Adding notify: ", [text, type, container, ttl, delay]);
			
			// create notify with given type and text
			var newNotify = $(tmpl.replace('$$type', notifyTypes[type]).replace('$$text', text))
				// hide it at start
				.css('display', 'none')
				// add trigger for close on click
				.click(self.closeNotify);


			// also add trigger on click on cross icon
			newNotify.find('.close').click(function(ev) {
		 		// trigger close event on parent -> self.closeNotify
				$(ev.target).parent().click();
				ev.stopPropagation();
			});

			// after delay show notification
			setTimeout(function() {

				// add notify
				$(container).append(newNotify);
				// and fade in
				newNotify.fadeIn(300);

				// if timeout is set, trigger close event after given time
				if(ttl) setTimeout(newNotify.click, ttl);

			}, delay);
		};

		// hide all messages in given container
		this.hideAll = function(container, cb) {
			if(!$(container).children().length)
				return cb && cb();

			$(container).children().slideUp(function() {
				$(this).remove();
				cb && cb();
			});
		};

		// this will close all messages in given container and show given message
		this.addSingle = function(text, type, container, ttl, delay) {

			self.hideAll(container, function() {
				return self.add(text, type, container, ttl, delay);
			});
		};

		// this will close all messages in given container and show given message with translate
		this.addSingleTranslate = function(text, type, container, ttl, delay) {

			self.hideAll(container, function() {
				return self.addTranslate(text, type, container, ttl, delay);
			});
		};

		// add notification and translate given text with ng-translate
		this.addTranslate = function(text, type, container, ttl, delay) {
			return self.add(self.translate(text), type, container, ttl, delay);
		};

		// translate given message
		this.translate = function(text) {
			return $translate(text);
		};

		// close notify on some event
		this.closeNotify = function(ev) {

			$(ev.target).slideUp('fast', function() {
				$(ev.target).remove();	
			});
			return false;
		};

		return this;
	}
]);