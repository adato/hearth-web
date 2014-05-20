'use strict';

angular.module('hearth.services').factory('SessionLanguageStorage', [
	'$session', '$log',
	function($session, $log) {
		var changeSessionLanguage, language, session;
		session = null;
		language = preferredLanguage;
		changeSessionLanguage = function() {
			if (!session) {
				return;
			}
			if (session.language !== language) {
				session.language = language;
				return session.$update();
			}
		};
		$session.then(function(resolvedSession) {
			session = resolvedSession;
			return changeSessionLanguage();
		}, function() {
			return $log.warn('Cannot preserve session locale');
		});
		return {
			set: function(name, value) {
				language = value;
				return changeSessionLanguage();
			},
			get: function() {
				return (session != null ? session.language : void 0) || language;
			}
		};
	}
]);