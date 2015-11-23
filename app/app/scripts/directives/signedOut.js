'use strict';

angular.module('hearth.directives').directive('signedOut', [
	'$session',
	function($session) {
		return {
			link: function(scope, element) {
				return $session.then(function(session) {
					if (session._id) {
						return element.css('display', 'none');
					}
				}, function() {
					return element.css('display', 'none');
				});
			}
		};
	}
]);
