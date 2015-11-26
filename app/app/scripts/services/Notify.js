'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Notification
 * @description Notification service
 */

angular.module('hearth.services').service('Notify', [
	'$translate',

	function($translate) {
		var tmpl = '<div data-alert class="alert-box $$type">$$text<i class="close">&times;</i></div>';
		var notifyTypes = {
			1: 'success',
			2: 'info',
			3: 'warning',
			4: 'error',
			5: ''
		};
		var self = this;

		this.T_SUCCESS = 1;
		this.T_INFO = 2;
		this.T_WARNING = 3;
		this.T_ERROR = 4;
		this.T_TEXT = 5;

		this.icons = {};
		this.icons[this.T_SUCCESS] = 'fa-check';
		this.icons[this.T_INFO] = 'fa-info-circle';
		this.icons[this.T_WARNING] = 'fa-exclamation-triangle';
		this.icons[this.T_ERROR] = 'fa-times';
		this.icons[this.T_TEXT] = '';

		this.TOP = '#notify-top';

		// add notification with plain text
		this.add = function(text, type, container, ttl, delay) {

			// if not set delay, set it to 0ms
			delay = delay || 0;
			// time to live - timeout to autoclose notify
			var ttlCustom = ttl || 4000;
			// default time is info box
			type = type || this.T_INFO;
			// default container is top center contaimer
			container = container || self.TOP;

			// if there is an error shown in its own container without ttl, we will show him for longer time
			if (container !== self.TOP && type == self.T_ERROR && !ttl) {
				ttlCustom = -1;
			}
			// add icon before text			
			if (self.icons[type])
				text = '<i class="fa ' + self.icons[type] + '"></i>' + text;

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
				if (ttlCustom >= 0) setTimeout(function() {
					newNotify.click();
				}, ttlCustom);

			}, delay);
		};

		// hide all messages in given container
		this.hideAll = function(container, cb) {
			if (!$(container).children().length)
				return cb && cb();

			$(container).children().slideUp(function() {
				$(this).remove();
				cb && cb();
			});
		};

		// this will close all messages in given container and show given message
		this.addSingle = function(text, type, container, ttl, delay) {
			container = container || self.TOP;

			self.hideAll(container, function() {
				return self.add(text, type, container, ttl, delay);
			});
		};

		// this will close all messages in given container and show given message with translate
		this.addSingleTranslate = function(text, type, container, ttl, delay) {
			container = container || self.TOP;

			self.hideAll(container, function() {
				return self.addTranslate(text, type, container, ttl, delay);
			});
		};

		// add notification and translate given text with ng-translate
		this.addTranslate = function(text, type, container, ttl, delay) {
			return self.add(self.translate(text), type, container, ttl, delay);
		};

		// this will save message to cookies - will be retrieved after next refresh
		this.addTranslateAfterRefresh = function(text, type, container, ttl, delay) {

			$.cookie("notify.afterRefresh", JSON.stringify(arguments), {
				path: '/'
			});
		};

		// this will take cookie and if not empty - it will show containing notification 
		this.checkRefreshMessage = function() {
			// if not empty
			if ($.cookie("notify.afterRefresh")) {
				try {
					var cookie = JSON.parse($.cookie("notify.afterRefresh"));

					// take cookie and parse him to array
					var args = $.map(cookie, function(value, index) {
						return [value];
					});

					// apply given arguments on this function
					self.addSingleTranslate.apply(self, args);
				} catch (e) {
					Rollbar.error("HEARTH: Error parsing JSON from cookie for afterRefresh notify", {
						error: e,
						source: $.cookie("notify.afterRefresh")
					});
				}

				// and delete cookie
				$.removeCookie("notify.afterRefresh");
			}
		};

		// translate given message
		this.translate = function(text) {
			return $translate.instant(text);
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