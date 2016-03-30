'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Bubble
 * @description auxiliary bubble functions
 */

angular.module('hearth.services').factory('Bubble', ['User', '$rootScope', 'Auth', '$analytics',
	function(User, $rootScope, Auth, $analytics) {

	var factory = {};

	/**
	 * Function will remove reminder from users reminders
	 */
	factory.removeReminder = function($event, type, reason) {
		User.removeReminder({
			_id: $rootScope.loggedUser._id,
			type: type
		}, function() {
			Auth.refreshUserInfo();

			$analytics.eventTrack('User closed reminder', {
				'context': $state.current.name,
				'Reason': reason,
				'Bubble Type': type
			});

			$rootScope.loggedUser.reminders.splice(type, 1);
		});

		if ($event.stopPropagation) $event.stopPropagation();
	};

	factory.isInViewport = function(el) {
		var rect = el.getBoundingClientRect();
	    return (
	        rect.top >= 0 &&
	        rect.left >= 0 &&
	        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
	        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	    );
		// if (!$elem) return false;
		// var $window = $(window);
		//
		// var docViewTop = $window.scrollTop();
		// var docViewBottom = docViewTop + $window.height();
		//
		// var elemTop = $elem.offset().top;
		// var elemBottom = elemTop + $elem.height();
		//
		// return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}

	return factory;

	}
]);