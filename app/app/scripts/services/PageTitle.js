'use strict';

/**
 * @ngdoc service
 * @name hearth.services.PageTitle
 * @description
 */

angular.module('hearth.services').service('PageTitle', [
	'$rootScope', '$translate',
	function($rootScope, $translate) {
		var self = this;
		var defaultTitle = '';
		var postfix = '';
		var delimiter = ' | ';

		this.getDefault = function() {
			return defaultTitle;
		};

		this.setDefault = function(d, p, delim) {
			defaultTitle = d;
			postfix = p;
			delimiter = delim || delimiter;
		};

		this.setTitle = function(title) {
			$('title').html(title);
		};

		this.setTranslate = function(titleCode, append) {
			var translate = $translate.instant(titleCode);
			if(translate == titleCode)
				translate = self.getDefault();

			self.set(translate, append);
		};
		
		this.set = function(title, append) {
            
            title +=  ((append) ? ' '+append : '');

			if(title && postfix)
				title += delimiter + postfix;
			else if(!title)
				title = postfix;

			self.setTitle(title);
		};
	}
]);