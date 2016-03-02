'use strict';

/**
 * @ngdoc service
 * @name hearth.services.$session
 * @description 
 */

angular.module('hearth.services').factory('$session', [
	'Session', '$q',
	function(Session, $q) {
		var deferredSession, session;
		deferredSession = $q.defer();
		session = Session.show(function() {
			return deferredSession.resolve(session);
		}, function(err) {
			return deferredSession.reject(err);
		});
		return deferredSession.promise;
	}
]);