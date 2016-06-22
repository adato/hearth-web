'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.userIntelReadout
 * @description Writes out a table comprising information about a user
 * @restrict E
 */

angular.module('hearth.directives').directive('userIntelReadout', [
	'IsEmpty',
	function(IsEmpty) {
		return {
			restrict: 'E',
			scope: {
				entity: '=',
				type: '='
			},
			templateUrl: 'templates/directives/userIntelReadout.html',
			link: function(scope) {
				// var validTypes = ['informative', 'all'];
				// var index = validTypes.indexOf(scope.type);
				// scope.readoutTypeIndex = ((index > -1) ? index : validTypes.length);

				var motto = 'motto',
					about = 'about',
					interests = 'interests',
					work = 'work',
					locations = 'locations',
					languages = 'languages',
					email = 'email',
					phone = 'phone',
					webs = 'webs';

				var setup = {};
				setup.informative = [about, motto, locations, languages, email, phone];
				setup.infobox = setup.informative.slice(1);
				// note that there is a motto missing which is on purpose as it is shown differently usually
				setup.all = [motto, about, interests, work, locations, languages, email, phone, webs];
				setup.profile = setup.all.slice(1);

				scope.typeMatch = setup[scope.type] || setup.all;

				scope.isEmpty = IsEmpty;
			}
		}
	}
]);